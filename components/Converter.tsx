import { useCallback, useEffect, useRef, useState, type SubmitEvent } from "react"
import { GoArrowSwitch } from "react-icons/go"
import type { CurrencyCode } from "../data/currencyCodes.ts"
import { fetchPairRate } from "../lib/exchange.ts"
import SetCurrency from "./SetCurrency.tsx"

const DEFAULT_AMOUNT = "100"
const DEFAULT_FROM: CurrencyCode = "USD"
const DEFAULT_TO: CurrencyCode = "CHF"

type RateOutcome =
  | { ok: true; text: string }
  | { ok: false; stale: true }
  | { ok: false; message: string }

export default function Converter() {
  const [amount, setAmount] = useState(DEFAULT_AMOUNT)
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>(DEFAULT_FROM)
  const [toCurrency, setToCurrency] = useState<CurrencyCode>(DEFAULT_TO)
  const [result, setResult] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  const requestId = useRef(0)
  const abortRef = useRef<AbortController | null>(null)

  const loadRate = useCallback(
    async (nextAmount: string, from: CurrencyCode, to: CurrencyCode): Promise<RateOutcome> => {
      const value = Number(nextAmount)
      if (nextAmount.trim() === "" || !Number.isFinite(value) || value < 0) {
        return { ok: false, message: "Enter a valid amount." }
      }

      const id = ++requestId.current
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      try {
        const rate = await fetchPairRate(from, to, controller.signal)
        if (id !== requestId.current) return { ok: false, stale: true }
        return {
          ok: true,
          text: `${nextAmount.trim()} ${from} = ${(rate * value).toFixed(2)} ${to}`,
        }
      } catch (err) {
        if (id !== requestId.current) return { ok: false, stale: true }
        return {
          ok: false,
          message: err instanceof Error ? err.message : "Failed to fetch exchange rate.",
        }
      }
    },
    [],
  )

  const applyOutcome = (outcome: RateOutcome) => {
    if ("stale" in outcome) return
    if (outcome.ok) {
      setResult(outcome.text)
      setError("")
    } else {
      setResult("")
      setError(outcome.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    let active = true

    void loadRate(DEFAULT_AMOUNT, DEFAULT_FROM, DEFAULT_TO).then((outcome) => {
      if (!active) return
      applyOutcome(outcome)
    })

    return () => {
      active = false
      abortRef.current?.abort()
    }
  }, [loadRate])

  const switchCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const handleSubmit = (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError("")
    void loadRate(amount, fromCurrency, toCurrency).then(applyOutcome)
  }

  const status = loading
    ? "Fetching exchange rate…"
    : error || result || "Enter an amount and convert."

  return (
    <form className="converter-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label" htmlFor="amount">
          Enter Amount
        </label>
        <input
          id="amount"
          type="number"
          className="form-input"
          value={amount}
          min="0"
          step="any"
          onChange={(event) => setAmount(event.target.value)}
          required
        />
      </div>

      <div className="form-group form-currency-group">
        <div className="form-section">
          <label className="form-label">From</label>
          <SetCurrency
            label="From currency"
            selectedCurrency={fromCurrency}
            onCurrencyChange={setFromCurrency}
          />
        </div>

        <button
          type="button"
          className="exchange-icon"
          onClick={switchCurrencies}
          aria-label="Swap currencies"
        >
          <GoArrowSwitch />
        </button>

        <div className="form-section">
          <label className="form-label">To</label>
          <SetCurrency
            label="To currency"
            selectedCurrency={toCurrency}
            onCurrencyChange={setToCurrency}
          />
        </div>
      </div>

      <button type="submit" className="submit-button" disabled={loading}>
        {loading ? "Fetching…" : "Get Exchange Rate"}
      </button>
      <p
        className={error ? "exchange-result-rate is-error" : "exchange-result-rate"}
        role="status"
      >
        {status}
      </p>
    </form>
  )
}
