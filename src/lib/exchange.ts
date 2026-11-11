import type { CurrencyCode } from "../data/currencyCodes.ts"

interface PairResponse {
    result: "success" | "error"
    conversion_rate?: number
    "error-type"?: string
}

function apiErrorMessage(code: string): string {
    switch (code) {
        case "invalid-key":
            return "The API key was rejected. Check VITE_API_KEY in your .env file."
        case "inactive-account":
            return "This ExchangeRate-API account is not active."
        case "quota-reached":
            return "Monthly request quota reached for this API key."
        case "unsupported-code":
            return "One of the selected currencies is not supported by the API."
        default:
            return `Exchange rate request failed (${code}).`
    }
}

export async function fetchPairRate(
    from: CurrencyCode,
    to: CurrencyCode,
    signal?: AbortSignal,
): Promise<number> {
    const apiKey = import.meta.env.VITE_API_KEY

    if (!apiKey) {
        throw new Error(
            "Missing VITE_API_KEY. Copy .env.example to .env and add your ExchangeRate-API key.",
        )
    }

    const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}`
    const response = await fetch(url, { signal })

    if (!response.ok) {
        throw new Error(`Failed to fetch exchange rate (${response.status}).`)
    }

    let data: PairResponse
    try {
        data = (await response.json()) as PairResponse
    } catch {
        throw new Error("Exchange rate response was not valid JSON.")
    }

    if (data.result !== "success" || typeof data.conversion_rate !== "number") {
        throw new Error(apiErrorMessage(data["error-type"] ?? "unknown"))
    }

    return data.conversion_rate
}
