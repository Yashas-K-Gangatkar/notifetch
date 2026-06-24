/**
 * Currency formatting utilities.
 *
 * v2.9.36: Multi-currency support.
 *
 * The user's preferred currency is stored on the User table (`currency` field,
 * default "USD"). The Android app also has this field — both sync via the
 * shared backend.
 *
 * Exchange rates: hardcoded fallback rates updated periodically. For a real
 * product, replace `FALLBACK_RATES` with an API call to a forex provider
 * (e.g., open.er-api.com). Hardcoded rates are fine for MVP — users care
 * about relative values, not real-time precision.
 */

export type Currency = "USD" | "INR" | "EUR" | "GBP";

export const CURRENCIES: Array<{ code: Currency; symbol: string; label: string }> = [
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "INR", symbol: "₹", label: "Indian Rupee" },
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "GBP", symbol: "£", label: "British Pound" },
];

// Approximate rates as of 2026-06 (1 USD = X). Update quarterly.
const FALLBACK_RATES: Record<Currency, number> = {
  USD: 1,
  INR: 83.5,
  EUR: 0.92,
  GBP: 0.79,
};

let cachedRates: { rates: Record<Currency, number>; fetchedAt: number } | null = null;
const RATE_CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Get current exchange rates. Tries to fetch from API; falls back to hardcoded.
 * Returns rates relative to USD (1 USD = X target_currency).
 */
async function getRates(): Promise<Record<Currency, number>> {
  if (cachedRates && Date.now() - cachedRates.fetchedAt < RATE_CACHE_TTL_MS) {
    return cachedRates.rates;
  }

  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 3600 }, // Next.js cache for 1 hour
    });
    const data = await res.json();
    if (data?.rates) {
      const rates: Record<Currency, number> = {
        USD: 1,
        INR: data.rates.INR || FALLBACK_RATES.INR,
        EUR: data.rates.EUR || FALLBACK_RATES.EUR,
        GBP: data.rates.GBP || FALLBACK_RATES.GBP,
      };
      cachedRates = { rates, fetchedAt: Date.now() };
      return rates;
    }
  } catch {
    // Network error — use fallback
  }

  return FALLBACK_RATES;
}

/**
 * Convert an amount from one currency to another.
 *
 * @param amount - The amount to convert
 * @param from - Source currency (default USD)
 * @param to - Target currency (default USD)
 */
export async function convertCurrency(
  amount: number,
  from: Currency = "USD",
  to: Currency = "USD"
): Promise<number> {
  if (from === to) return amount;
  const rates = await getRates();
  // Convert to USD first, then to target
  const usdAmount = amount / rates[from];
  return usdAmount * rates[to];
}

/**
 * Format a monetary amount with the appropriate symbol and locale.
 *
 * @param amount - The amount (in the currency specified by `currency`)
 * @param currency - ISO 4217 code (USD, INR, EUR, GBP)
 * @param options - Intl.NumberFormat options
 */
export function formatCurrency(
  amount: number | null | undefined,
  currency: Currency = "USD",
  options: Intl.NumberFormatOptions = {}
): string {
  if (amount == null || isNaN(amount)) return "—";

  const localeMap: Record<Currency, string> = {
    USD: "en-US",
    INR: "en-IN",
    EUR: "de-DE",
    GBP: "en-GB",
  };

  try {
    return new Intl.NumberFormat(localeMap[currency], {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
      ...options,
    }).format(amount);
  } catch {
    // Fallback if Intl doesn't support the currency
    const symbol = CURRENCIES.find((c) => c.code === currency)?.symbol || "";
    return `${symbol}${amount.toLocaleString()}`;
  }
}

/**
 * Get the user's preferred currency from their session/profile.
 * Falls back to USD if not set.
 *
 * Server-side: pass the user's `currency` field from the DB.
 * Client-side: pass the value from useSession() or fetch from /api/user.
 */
export function getUserCurrency(sessionCurrency: string | null | undefined): Currency {
  if (!sessionCurrency) return "USD";
  const valid: Currency[] = ["USD", "INR", "EUR", "GBP"];
  return valid.includes(sessionCurrency as Currency)
    ? (sessionCurrency as Currency)
    : "USD";
}
