// =============================================================================
// NotiFetch — Worldwide Data Layer
// Reference/config data only. NO fake/demo data.
// All runtime data comes from the API (/api/notifications, /api/earnings, etc.)
// =============================================================================

// ─── Currency ────────────────────────────────────────────────────────────────

export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export const CURRENCIES: Record<string, Currency> = {
  USD: { code: "USD", symbol: "$", name: "US Dollar" },
  CAD: { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  MXN: { code: "MXN", symbol: "MX$", name: "Mexican Peso" },
  BRL: { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  ARS: { code: "ARS", symbol: "AR$", name: "Argentine Peso" },
  GBP: { code: "GBP", symbol: "£", name: "British Pound" },
  EUR: { code: "EUR", symbol: "€", name: "Euro" },
  INR: { code: "INR", symbol: "₹", name: "Indian Rupee" },
  JPY: { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  KRW: { code: "KRW", symbol: "₩", name: "South Korean Won" },
  AUD: { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  SGD: { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  THB: { code: "THB", symbol: "฿", name: "Thai Baht" },
  AED: { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  ZAR: { code: "ZAR", symbol: "R", name: "South African Rand" },
  CNY: { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  SEK: { code: "SEK", symbol: "kr", name: "Swedish Krona" },
  PLN: { code: "PLN", symbol: "zł", name: "Polish Zloty" },
  TRY: { code: "TRY", symbol: "₺", name: "Turkish Lira" },
  PHP: { code: "PHP", symbol: "₱", name: "Philippine Peso" },
  IDR: { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
  MYR: { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
  COP: { code: "COP", symbol: "CO$", name: "Colombian Peso" },
  CLP: { code: "CLP", symbol: "CL$", name: "Chilean Peso" },
  ILS: { code: "ILS", symbol: "₪", name: "Israeli Shekel" },
  NGN: { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  EGP: { code: "EGP", symbol: "E£", name: "Egyptian Pound" },
  SAR: { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
};

// ─── Regions ─────────────────────────────────────────────────────────────────

export interface Region {
  id: string;
  name: string;
  countries: string[];
  currency: string;
  distanceUnit: "mi" | "km";
  flag: string;
}

export const REGIONS: Region[] = [
  { id: "north-america", name: "North America", countries: ["US", "CA"], currency: "USD", distanceUnit: "mi", flag: "🇺🇸" },
  { id: "latin-america", name: "Latin America", countries: ["BR", "AR", "CO", "CL", "MX", "PE"], currency: "BRL", distanceUnit: "km", flag: "🇧🇷" },
  { id: "europe", name: "Europe", countries: ["GB", "DE", "FR", "ES", "IT", "NL", "PL", "SE", "IE"], currency: "EUR", distanceUnit: "km", flag: "🇪🇺" },
  { id: "india", name: "India & South Asia", countries: ["IN", "PK", "BD", "LK"], currency: "INR", distanceUnit: "km", flag: "🇮🇳" },
  { id: "east-asia", name: "East Asia", countries: ["JP", "KR", "CN", "TW"], currency: "JPY", distanceUnit: "km", flag: "🇯🇵" },
  { id: "sea", name: "Southeast Asia", countries: ["TH", "SG", "MY", "ID", "PH", "VN"], currency: "SGD", distanceUnit: "km", flag: "🇸🇬" },
  { id: "mena", name: "Middle East & Africa", countries: ["AE", "SA", "IL", "TR", "EG", "NG", "ZA", "KE"], currency: "AED", distanceUnit: "km", flag: "🇦🇪" },
  { id: "oceania", name: "Oceania", countries: ["AU", "NZ"], currency: "AUD", distanceUnit: "km", flag: "🇦🇺" },
];

// ─── Delivery Categories ──────────────────────────────────────────────────────

export interface DeliveryCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export const DELIVERY_CATEGORIES: DeliveryCategory[] = [
  { id: "food", name: "Food Delivery", icon: "🍕", description: "Restaurant meal delivery", color: "text-orange-400", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/30" },
  { id: "grocery", name: "Grocery Delivery", icon: "🛒", description: "Supermarket & convenience", color: "text-emerald-400", bgColor: "bg-emerald-500/10", borderColor: "border-emerald-500/30" },
  { id: "package", name: "Package & Parcel", icon: "📬", description: "Packages & parcels", color: "text-teal-400", bgColor: "bg-teal-500/10", borderColor: "border-teal-500/30" },
  { id: "courier", name: "Courier & Express", icon: "📦", description: "Same-day express courier", color: "text-blue-400", bgColor: "bg-blue-500/10", borderColor: "border-blue-500/30" },
  { id: "last-mile", name: "Last-Mile Delivery", icon: "📫", description: "E-commerce last mile", color: "text-indigo-400", bgColor: "bg-indigo-500/10", borderColor: "border-indigo-500/30" },
  { id: "ride-transport", name: "Ride & Transport", icon: "🚗", description: "Rideshare & taxi", color: "text-violet-400", bgColor: "bg-violet-500/10", borderColor: "border-violet-500/30" },
];

// ─── Supported Platforms (reference only — NO fake stats) ────────────────────

export interface Platform {
  id: string;
  name: string;
  category: string;
  regions: string[];
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  packageName: string;
  currency: string;
}

export const PLATFORMS: Platform[] = [
  // ── Food Delivery ──
  { id: "uber-eats", name: "Uber Eats", category: "food", regions: ["north-america", "europe", "india", "sea", "mena", "latin-america", "oceania"], color: "text-emerald-400", bgColor: "bg-emerald-500/10", borderColor: "border-emerald-500/30", icon: "🟢", packageName: "com.ubercab.driver", currency: "USD" },
  { id: "doordash", name: "DoorDash", category: "food", regions: ["north-america", "oceania"], color: "text-red-400", bgColor: "bg-red-500/10", borderColor: "border-red-500/30", icon: "🔴", packageName: "com.doordash.driverapp", currency: "USD" },
  { id: "grubhub", name: "Grubhub", category: "food", regions: ["north-america"], color: "text-yellow-400", bgColor: "bg-yellow-500/10", borderColor: "border-yellow-500/30", icon: "🟡", packageName: "com.grubhub.driver", currency: "USD" },
  { id: "deliveroo", name: "Deliveroo", category: "food", regions: ["europe", "mena", "sea"], color: "text-teal-400", bgColor: "bg-teal-500/10", borderColor: "border-teal-500/30", icon: "🦘", packageName: "com.deliveroo.driverapp", currency: "EUR" },
  { id: "just-eat", name: "Just Eat", category: "food", regions: ["europe"], color: "text-orange-400", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/30", icon: "🟠", packageName: "com.justeat.courier.uk", currency: "EUR" },
  { id: "foodpanda", name: "Foodpanda", category: "food", regions: ["sea", "mena", "east-asia"], color: "text-pink-400", bgColor: "bg-pink-500/10", borderColor: "border-pink-500/30", icon: "🐼", packageName: "com.logistics.rider.foodpanda", currency: "SGD" },
  { id: "swiggy", name: "Swiggy", category: "food", regions: ["india"], color: "text-amber-400", bgColor: "bg-amber-500/10", borderColor: "border-amber-500/30", icon: "🔥", packageName: "in.swiggy.deliveryapp", currency: "INR" },
  { id: "zomato", name: "Zomato", category: "food", regions: ["india"], color: "text-red-400", bgColor: "bg-red-500/10", borderColor: "border-red-500/30", icon: "🍅", packageName: "com.zomato.delivery", currency: "INR" },
  { id: "ifood", name: "iFood", category: "food", regions: ["latin-america"], color: "text-purple-400", bgColor: "bg-purple-500/10", borderColor: "border-purple-500/30", icon: "🟣", packageName: "br.com.ifood.driver.app", currency: "BRL" },
  { id: "wolt", name: "Wolt", category: "food", regions: ["europe", "mena", "east-asia"], color: "text-sky-400", bgColor: "bg-sky-500/10", borderColor: "border-sky-500/30", icon: "🔵", packageName: "com.wolt.courierapp", currency: "EUR" },
  { id: "glovo", name: "Glovo", category: "food", regions: ["europe", "mena", "sea"], color: "text-yellow-400", bgColor: "bg-yellow-500/10", borderColor: "border-yellow-500/30", icon: "🟨", packageName: "com.logistics.rider.glovo", currency: "EUR" },
  { id: "talabat", name: "Talabat", category: "food", regions: ["mena"], color: "text-orange-400", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/30", icon: "🟠", packageName: "com.logistics.rider.talabat", currency: "AED" },
  // ── Grocery ──
  { id: "instacart", name: "Instacart", category: "grocery", regions: ["north-america"], color: "text-orange-400", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/30", icon: "🥕", packageName: "com.instacart.shopper", currency: "USD" },
  { id: "blinkit", name: "Blinkit", category: "grocery", regions: ["india"], color: "text-yellow-400", bgColor: "bg-yellow-500/10", borderColor: "border-yellow-500/30", icon: "⚡", packageName: "app.blinkit.onboarding", currency: "INR" },
  { id: "bigbasket", name: "BigBasket", category: "grocery", regions: ["india"], color: "text-red-400", bgColor: "bg-red-500/10", borderColor: "border-red-500/30", icon: "🛒", packageName: "com.bigbasket.dapp.activity", currency: "INR" },
  { id: "zepto", name: "Zepto", category: "grocery", regions: ["india"], color: "text-purple-400", bgColor: "bg-purple-500/10", borderColor: "border-purple-500/30", icon: "🟣", packageName: "com.zepto.rider", currency: "INR" },
  // ── Package ──
  { id: "amazon-flex", name: "Amazon Flex", category: "package", regions: ["north-america", "europe", "india", "oceania", "sea"], color: "text-teal-400", bgColor: "bg-teal-500/10", borderColor: "border-teal-500/30", icon: "📦", packageName: "com.amazon.flex.rabbit", currency: "USD" },
  { id: "dunzo", name: "Dunzo", category: "package", regions: ["india"], color: "text-cyan-400", bgColor: "bg-cyan-500/10", borderColor: "border-cyan-500/30", icon: "🏃", packageName: "com.dunzo.partner", currency: "INR" },
  { id: "lalamove", name: "Lalamove", category: "package", regions: ["sea", "east-asia", "mena"], color: "text-orange-400", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/30", icon: "🚚", packageName: "com.lalamove.global.driver.sea", currency: "SGD" },
  // ── Ride ──
  { id: "uber-driver", name: "Uber Driver", category: "ride-transport", regions: ["north-america", "europe", "india", "sea", "mena", "latin-america", "oceania"], color: "text-violet-400", bgColor: "bg-violet-500/10", borderColor: "border-violet-500/30", icon: "🚗", packageName: "com.ubercab.driver", currency: "USD" },
  { id: "lyft-driver", name: "Lyft Driver", category: "ride-transport", regions: ["north-america"], color: "text-pink-400", bgColor: "bg-pink-500/10", borderColor: "border-pink-500/30", icon: "🌸", packageName: "com.lyft.android.driver", currency: "USD" },
  { id: "ola-driver", name: "Ola Driver", category: "ride-transport", regions: ["india", "oceania"], color: "text-yellow-400", bgColor: "bg-yellow-500/10", borderColor: "border-yellow-500/30", icon: "🟡", packageName: "com.olacabs.oladriver", currency: "INR" },
  { id: "grab-driver", name: "Grab Driver", category: "ride-transport", regions: ["sea"], color: "text-green-400", bgColor: "bg-green-500/10", borderColor: "border-green-500/30", icon: "🟢", packageName: "com.grabtaxi.driver2", currency: "SGD" },
  { id: "bolt", name: "Bolt", category: "ride-transport", regions: ["europe", "mena", "sea"], color: "text-green-400", bgColor: "bg-green-500/10", borderColor: "border-green-500/30", icon: "⚡", packageName: "ee.mtakso.driver", currency: "EUR" },
  { id: "rapido", name: "Rapido", category: "ride-transport", regions: ["india"], color: "text-yellow-400", bgColor: "bg-yellow-500/10", borderColor: "border-yellow-500/30", icon: "🏍️", packageName: "com.rapido.rider", currency: "INR" },
  // ── Last-Mile ──
  { id: "delhivery", name: "Delhivery", category: "last-mile", regions: ["india"], color: "text-blue-400", bgColor: "bg-blue-500/10", borderColor: "border-blue-500/30", icon: "📦", packageName: "com.delhivery.delhiverypartner", currency: "INR" },
  { id: "ekart", name: "Ekart", category: "last-mile", regions: ["india"], color: "text-blue-400", bgColor: "bg-blue-500/10", borderColor: "border-blue-500/30", icon: "📦", packageName: "com.ekart.logistics.app", currency: "INR" },
  { id: "xpressbees", name: "Xpressbees", category: "last-mile", regions: ["india"], color: "text-pink-400", bgColor: "bg-pink-500/10", borderColor: "border-pink-500/30", icon: "📦", packageName: "com.xpressbees.unified_new_arch", currency: "INR" },
];

// ─── Navigation Items ─────────────────────────────────────────────────────────

export const NAV_ITEMS = [
  { id: "hero", label: "Home" },
  { id: "dashboard", label: "Dashboard" },
  { id: "earnings", label: "Earnings" },
  { id: "platforms", label: "Platforms" },
  { id: "pricing", label: "Pricing" },
  { id: "settings", label: "Settings" },
];

// ─── Utility Functions ────────────────────────────────────────────────────────

export function getCurrencySymbol(code: string): string {
  return CURRENCIES[code]?.symbol ?? code;
}

export function formatCurrency(value: number | { price: number; name: string }, currency: string): string {
  const num = typeof value === "object" ? value.price : value;
  const sym = getCurrencySymbol(currency);
  if (num === 0) return "Free";
  if (currency === "INR") return `${sym}${Math.round(num).toLocaleString()}`;
  if (["JPY", "KRW", "IDR"].includes(currency)) return `${sym}${Math.round(num).toLocaleString()}`;
  return `${sym}${num.toFixed(2)}`;
}

// ─── Pricing ─────────────────────────────────────────────────────────────────

export const PRICING = {
  "north-america": { free: { price: 0, name: "Free" }, pro: { price: 4.99, name: "Pro" }, premium: { price: 9.99, name: "Premium" } },
  "europe": { free: { price: 0, name: "Free" }, pro: { price: 4.49, name: "Pro" }, premium: { price: 8.99, name: "Premium" } },
  "india": { free: { price: 0, name: "Free" }, pro: { price: 149, name: "Pro" }, premium: { price: 299, name: "Premium" } },
  "default": { free: { price: 0, name: "Free" }, pro: { price: 3.99, name: "Pro" }, premium: { price: 7.99, name: "Premium" } },
};
