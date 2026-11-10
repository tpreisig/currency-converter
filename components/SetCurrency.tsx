import { useState, type ChangeEvent } from "react"
import {
    currencyCodes,
    isCurrencyCode,
    type CurrencyCode,
} from "../data/currencyCodes.ts"

const flagOverrides: Partial<Record<CurrencyCode, string>> = {
    EUR: "eu",
    ANG: "cw",
}

function flagCodeFor(currency: CurrencyCode): string {
    return flagOverrides[currency] ?? currency.slice(0, 2).toLowerCase()
}

function Flag({ currency }: { currency: CurrencyCode }) {
    const [failed, setFailed] = useState(false)
    if (failed) return null

    return (
        <img
            src={`https://flagcdn.com/${flagCodeFor(currency)}.svg`}
            alt=""
            onError={() => setFailed(true)}
        />
    )
}

interface SetCurrencyProps {
    label: string
    selectedCurrency: CurrencyCode
    onCurrencyChange: (code: CurrencyCode) => void
}

export default function SetCurrency({
    label,
    selectedCurrency,
    onCurrencyChange,
}: SetCurrencyProps) {
    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        const next = event.target.value
        if (isCurrencyCode(next)) onCurrencyChange(next)
    }

    return (
        <div className="currency-select">
            <Flag key={selectedCurrency} currency={selectedCurrency} />
            <select
                className="currency-dropdown"
                value={selectedCurrency}
                onChange={handleChange}
                aria-label={label}
            >
                {currencyCodes.map((currency) => (
                    <option key={currency} value={currency}>
                        {currency}
                    </option>
                ))}
            </select>
        </div>
    )
}
