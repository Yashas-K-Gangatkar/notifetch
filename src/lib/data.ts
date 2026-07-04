// =============================================================================
// NotiFetch — Worldwide Data Layer
// A-Z Delivery Categories · 80+ Global Platforms · Multi-Currency · Multi-Region
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

// ─── Delivery Categories (A-Z) ──────────────────────────────────────────────

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
  { id: "alcohol", name: "Alcohol Delivery", icon: "🍷", description: "Wine, beer & spirits", color: "text-purple-400", bgColor: "bg-purple-500/10", borderColor: "border-purple-500/30" },
  { id: "bicycle-courier", name: "Bicycle Courier", icon: "🚲", description: "Bike messenger & express", color: "text-lime-400", bgColor: "bg-lime-500/10", borderColor: "border-lime-500/30" },
  { id: "cannabis", name: "Cannabis & CBD", icon: "🌿", description: "Legal cannabis delivery", color: "text-green-400", bgColor: "bg-green-500/10", borderColor: "border-green-500/30" },
  { id: "courier", name: "Courier & Express", icon: "📦", description: "Same-day express courier", color: "text-blue-400", bgColor: "bg-blue-500/10", borderColor: "border-blue-500/30" },
  { id: "document", name: "Document Delivery", icon: "📄", description: "Legal docs & contracts", color: "text-slate-400", bgColor: "bg-slate-500/10", borderColor: "border-slate-500/30" },
  { id: "flower", name: "Flower Delivery", icon: "💐", description: "Flowers & arrangements", color: "text-pink-400", bgColor: "bg-pink-500/10", borderColor: "border-pink-500/30" },
  { id: "food", name: "Food Delivery", icon: "🍕", description: "Restaurant meal delivery", color: "text-orange-400", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/30" },
  { id: "freight", name: "Freight & Trucking", icon: "🚛", description: "Heavy freight transport", color: "text-amber-400", bgColor: "bg-amber-500/10", borderColor: "border-amber-500/30" },
  { id: "furniture", name: "Furniture & Appliance", icon: "🛋️", description: "Large item delivery", color: "text-stone-400", bgColor: "bg-stone-500/10", borderColor: "border-stone-500/30" },
  { id: "grocery", name: "Grocery Delivery", icon: "🛒", description: "Supermarket & convenience", color: "text-emerald-400", bgColor: "bg-emerald-500/10", borderColor: "border-emerald-500/30" },
  { id: "laundry", name: "Laundry & Dry Clean", icon: "👔", description: "Wash, fold & dry clean", color: "text-cyan-400", bgColor: "bg-cyan-500/10", borderColor: "border-cyan-500/30" },
  { id: "last-mile", name: "Last-Mile Delivery", icon: "📫", description: "E-commerce last mile", color: "text-indigo-400", bgColor: "bg-indigo-500/10", borderColor: "border-indigo-500/30" },
  { id: "medical", name: "Medical & Pharmacy", icon: "💊", description: "Prescriptions & supplies", color: "text-red-400", bgColor: "bg-red-500/10", borderColor: "border-red-500/30" },
  { id: "package", name: "Package & Parcel", icon: "📬", description: "Packages & parcels", color: "text-teal-400", bgColor: "bg-teal-500/10", borderColor: "border-teal-500/30" },
  { id: "pet-supplies", name: "Pet Supplies", icon: "🐾", description: "Pet food & accessories", color: "text-yellow-400", bgColor: "bg-yellow-500/10", borderColor: "border-yellow-500/30" },
  { id: "qsr", name: "QSR & Fast Food", icon: "🍔", description: "Quick-service restaurant orders", color: "text-orange-400", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/30" },
  { id: "ride-transport", name: "Ride & Transport", icon: "🚗", description: "Rideshare & taxi", color: "text-violet-400", bgColor: "bg-violet-500/10", borderColor: "border-violet-500/30" },
  { id: "same-day", name: "Same-Day Delivery", icon: "⚡", description: "Any same-day service", color: "text-sky-400", bgColor: "bg-sky-500/10", borderColor: "border-sky-500/30" },
  { id: "white-glove", name: "White-Glove", icon: "🤝", description: "Premium careful handling", color: "text-fuchsia-400", bgColor: "bg-fuchsia-500/10", borderColor: "border-fuchsia-500/30" },
];

// ─── Platform ────────────────────────────────────────────────────────────────

export interface Platform {
  id: string;
  name: string;
  category: string;
  regions: string[];
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  connected: boolean;
  notificationsToday: number;
  earningsToday: number;
  currency: string;
}

export const PLATFORMS: Platform[] = [
  // ── Food Delivery ──────────────────────────────────────────────────────────
  { id: "uber-eats", name: "Uber Eats", category: "food", regions: ["north-america", "europe", "india", "sea", "mena", "latin-america", "oceania"], color: "text-emerald-400", bgColor: "bg-emerald-500/10", borderColor: "border-emerald-500/30", icon: "🟢", connected: true, notificationsToday: 24, earningsToday: 87.50, currency: "USD" },
  { id: "doordash", name: "DoorDash", category: "food", regions: ["north-america", "oceania"], color: "text-red-400", bgColor: "bg-red-500/10", borderColor: "border-red-500/30", icon: "🔴", connected: true, notificationsToday: 18, earningsToday: 62.30, currency: "USD" },
  { id: "grubhub", name: "Grubhub", category: "food", regions: ["north-america"], color: "text-yellow-400", bgColor: "bg-yellow-500/10", borderColor: "border-yellow-500/30", icon: "🟡", connected: false, notificationsToday: 8, earningsToday: 31.20, currency: "USD" },
  { id: "deliveroo", name: "Deliveroo", category: "food", regions: ["europe", "mena", "sea"], color: "text-teal-400", bgColor: "bg-teal-500/10", borderColor: "border-teal-500/30", icon: "🦘", connected: true, notificationsToday: 15, earningsToday: 48.00, currency: "EUR" },
  { id: "just-eat", name: "Just Eat", category: "food", regions: ["europe"], color: "text-orange-400", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/30", icon: "🟠", connected: false, notificationsToday: 12, earningsToday: 42.50, currency: "EUR" },
  { id: "foodpanda", name: "Foodpanda", category: "food", regions: ["sea", "mena", "east-asia"], color: "text-pink-400", bgColor: "bg-pink-500/10", borderColor: "border-pink-500/30", icon: "🐼", connected: false, notificationsToday: 10, earningsToday: 35.00, currency: "SGD" },
  { id: "swiggy", name: "Swiggy", category: "food", regions: ["india"], color: "text-amber-400", bgColor: "bg-amber-500/10", borderColor: "border-amber-500/30", icon: "🔥", connected: true, notificationsToday: 22, earningsToday: 1200, currency: "INR" },
  { id: "zomato", name: "Zomato", category: "food", regions: ["india"], color: "text-red-400", bgColor: "bg-red-500/10", borderColor: "border-red-500/30", icon: "🍅", connected: true, notificationsToday: 19, earningsToday: 980, currency: "INR" },
  { id: "ifood", name: "iFood", category: "food", regions: ["latin-america"], color: "text-purple-400", bgColor: "bg-purple-500/10", borderColor: "border-purple-500/30", icon: "🟣", connected: false, notificationsToday: 14, earningsToday: 85.00, currency: "BRL" },
  { id: "rappi", name: "Rappi", category: "food", regions: ["latin-america"], color: "text-orange-400", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/30", icon: "🟧", connected: false, notificationsToday: 11, earningsToday: 65.00, currency: "COP" },
  { id: "wolt", name: "Wolt", category: "food", regions: ["europe", "mena", "east-asia"], color: "text-sky-400", bgColor: "bg-sky-500/10", borderColor: "border-sky-500/30", icon: "🔵", connected: false, notificationsToday: 9, earningsToday: 38.00, currency: "EUR" },
  { id: "glovo", name: "Glovo", category: "food", regions: ["europe", "mena", "sea"], color: "text-yellow-400", bgColor: "bg-yellow-500/10", borderColor: "border-yellow-500/30", icon: "🟨", connected: false, notificationsToday: 7, earningsToday: 28.00, currency: "EUR" },
  { id: "meituan", name: "Meituan", category: "food", regions: ["east-asia"], color: "text-yellow-400", bgColor: "bg-yellow-500/10", borderColor: "border-yellow-500/30", icon: "🟡", connected: false, notificationsToday: 25, earningsToday: 350, currency: "CNY" },
  { id: "ele-me", name: "Ele.me", category: "food", regions: ["east-asia"], color: "text-blue-400", bgColor: "bg-blue-500/10", borderColor: "border-blue-500/30", icon: "🐝", connected: false, notificationsToday: 20, earningsToday: 280, currency: "CNY" },
  { id: "demae-can", name: "Demae-can", category: "food", regions: ["east-asia"], color: "text-red-400", bgColor: "bg-red-500/10", borderColor: "border-red-500/30", icon: "🍱", connected: false, notificationsToday: 8, earningsToday: 4500, currency: "JPY" },
  { id: "talabat", name: "Talabat", category: "food", regions: ["mena"], color: "text-orange-400", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/30", icon: "🟠", connected: false, notificationsToday: 13, earningsToday: 120, currency: "AED" },
  { id: "menulog", name: "Menulog", category: "food", regions: ["oceania"], color: "text-purple-400", bgColor: "bg-purple-500/10", borderColor: "border-purple-500/30", icon: "📋", connected: false, notificationsToday: 6, earningsToday: 45.00, currency: "AUD" },

  // ── Grocery Delivery ───────────────────────────────────────────────────────
  { id: "instacart", name: "Instacart", category: "grocery", regions: ["north-america"], color: "text-orange-400", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/30", icon: "🥕", connected: true, notificationsToday: 12, earningsToday: 45.80, currency: "USD" },
  { id: "gopuff", name: "Gopuff", category: "grocery", regions: ["north-america", "europe"], color: "text-purple-400", bgColor: "bg-purple-500/10", borderColor: "border-purple-500/30", icon: "🟣", connected: false, notificationsToday: 8, earningsToday: 32.00, currency: "USD" },
  { id: "gorillas", name: "Gorillas", category: "grocery", regions: ["europe"], color: "text-lime-400", bgColor: "bg-lime-500/10", borderColor: "border-lime-500/30", icon: "🦍", connected: false, notificationsToday: 6, earningsToday: 28.00, currency: "EUR" },
  { id: "getir", name: "Blinkit", category: "grocery", regions: ["europe", "mena"], color: "text-purple-400", bgColor: "bg-purple-500/10", borderColor: "border-purple-500/30", icon: "⚡", connected: false, notificationsToday: 7, earningsToday: 25.00, currency: "EUR" },
  { id: "bigbasket", name: "BigBasket", category: "grocery", regions: ["india"], color: "text-red-400", bgColor: "bg-red-500/10", borderColor: "border-red-500/30", icon: "🛒", connected: false, notificationsToday: 9, earningsToday: 650, currency: "INR" },
  { id: "blinkit", name: "Zepto", category: "grocery", regions: ["india"], color: "text-yellow-400", bgColor: "bg-yellow-500/10", borderColor: "border-yellow-500/30", icon: "⚡", connected: false, notificationsToday: 11, earningsToday: 720, currency: "INR" },
  { id: "mercado", name: "Flink", category: "grocery", regions: ["latin-america"], color: "text-yellow-400", bgColor: "bg-yellow-500/10", borderColor: "border-yellow-500/30", icon: "📦", connected: false, notificationsToday: 5, earningsToday: 45.00, currency: "BRL" },
  { id: "woolworths", name: "Shipt", category: "grocery", regions: ["oceania"], color: "text-green-400", bgColor: "bg-green-500/10", borderColor: "border-green-500/30", icon: "🟢", connected: false, notificationsToday: 4, earningsToday: 38.00, currency: "AUD" },

  // ── Package & Parcel ───────────────────────────────────────────────────────
  { id: "amazon-flex", name: "Amazon Flex", category: "package", regions: ["north-america", "europe", "india", "oceania", "sea"], color: "text-teal-400", bgColor: "bg-teal-500/10", borderColor: "border-teal-500/30", icon: "📦", connected: true, notificationsToday: 6, earningsToday: 52.40, currency: "USD" },
  { id: "fedex", name: "UPS", category: "package", regions: ["north-america", "europe", "mena", "sea", "oceania"], color: "text-purple-400", bgColor: "bg-purple-500/10", borderColor: "border-purple-500/30", icon: "🟪", connected: false, notificationsToday: 5, earningsToday: 48.00, currency: "USD" },
  { id: "ups", name: "Dunzo", category: "package", regions: ["north-america", "europe"], color: "text-amber-400", bgColor: "bg-amber-500/10", borderColor: "border-amber-500/30", icon: "🟫", connected: false, notificationsToday: 4, earningsToday: 42.00, currency: "USD" },
  { id: "dhl", name: "Lalamove", category: "package", regions: ["europe", "mena", "sea", "east-asia", "oceania"], color: "text-yellow-400", bgColor: "bg-yellow-500/10", borderColor: "border-yellow-500/30", icon: "🟡", connected: false, notificationsToday: 6, earningsToday: 45.00, currency: "EUR" },
  { id: "dunzo", name: "Borzo", category: "package", regions: ["india"], color: "text-cyan-400", bgColor: "bg-cyan-500/10", borderColor: "border-cyan-500/30", icon: "🏃", connected: false, notificationsToday: 8, earningsToday: 550, currency: "INR" },
  { id: "lalamove", name: "Postmates", category: "package", regions: ["sea", "east-asia", "mena"], color: "text-orange-400", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/30", icon: "🚚", connected: false, notificationsToday: 7, earningsToday: 85.00, currency: "SGD" },
  { id: "borzo", name: "Roadie", category: "package", regions: ["india", "sea", "mena", "latin-america"], color: "text-green-400", bgColor: "bg-green-500/10", borderColor: "border-green-500/30", icon: "🟢", connected: false, notificationsToday: 5, earningsToday: 420, currency: "INR" },

  // ── Courier & Express ──────────────────────────────────────────────────────
  { id: "postmates", name: "Postmates", category: "courier", regions: ["north-america"], color: "text-yellow-400", bgColor: "bg-yellow-500/10", borderColor: "border-yellow-500/30", icon: "🛵", connected: false, notificationsToday: 9, earningsToday: 38.00, currency: "USD" },
  { id: "roadie", name: "Roadie", category: "courier", regions: ["north-america"], color: "text-blue-400", bgColor: "bg-blue-500/10", borderColor: "border-blue-500/30", icon: "🛣️", connected: false, notificationsToday: 4, earningsToday: 55.00, currency: "USD" },
  { id: "deliv", name: "Deliv", category: "courier", regions: ["north-america"], color: "text-sky-400", bgColor: "bg-sky-500/10", borderColor: "border-sky-500/30", icon: "🚐", connected: false, notificationsToday: 3, earningsToday: 35.00, currency: "USD" },
  { id: "stuart", name: "Stuart", category: "courier", regions: ["europe"], color: "text-indigo-400", bgColor: "bg-indigo-500/10", borderColor: "border-indigo-500/30", icon: "🚴", connected: false, notificationsToday: 5, earningsToday: 32.00, currency: "EUR" },
  { id: "gogo-xpress", name: "GoGo Xpress", category: "courier", regions: ["sea"], color: "text-orange-400", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/30", icon: "📦", connected: false, notificationsToday: 4, earningsToday: 380, currency: "PHP" },

  // ── Last-Mile Delivery ─────────────────────────────────────────────────────
  { id: "amazon-logistics", name: "Last-Mile Delivery Platform", category: "last-mile", regions: ["north-america", "europe", "india", "oceania"], color: "text-teal-400", bgColor: "bg-teal-500/10", borderColor: "border-teal-500/30", icon: "📮", connected: false, notificationsToday: 8, earningsToday: 55.00, currency: "USD" },
  { id: "flipkart-logistics", name: "Last-Mile Delivery Platform 2", category: "last-mile", regions: ["india"], color: "text-blue-400", bgColor: "bg-blue-500/10", borderColor: "border-blue-500/30", icon: "📦", connected: false, notificationsToday: 10, earningsToday: 680, currency: "INR" },
  { id: "sf-express", name: "Last-Mile Delivery Platform 3", category: "last-mile", regions: ["east-asia"], color: "text-red-400", bgColor: "bg-red-500/10", borderColor: "border-red-500/30", icon: "📮", connected: false, notificationsToday: 12, earningsToday: 320, currency: "CNY" },
  { id: "jne", name: "Last-Mile Delivery Platform 4", category: "last-mile", regions: ["sea"], color: "text-orange-400", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/30", icon: "📬", connected: false, notificationsToday: 6, earningsToday: 85000, currency: "IDR" },
  { id: "aramex", name: "Last-Mile Delivery Platform 5", category: "last-mile", regions: ["mena", "sea"], color: "text-blue-400", bgColor: "bg-blue-500/10", borderColor: "border-blue-500/30", icon: "📦", connected: false, notificationsToday: 5, earningsToday: 95.00, currency: "AED" },

  // ── Medical & Pharmacy ─────────────────────────────────────────────────────
  { id: "capsule", name: "Pharmacy Platform", category: "medical", regions: ["north-america"], color: "text-blue-400", bgColor: "bg-blue-500/10", borderColor: "border-blue-500/30", icon: "💊", connected: false, notificationsToday: 3, earningsToday: 28.00, currency: "USD" },
  { id: "nowrx", name: "Pharmacy Platform 2", category: "medical", regions: ["north-america"], color: "text-emerald-400", bgColor: "bg-emerald-500/10", borderColor: "border-emerald-500/30", icon: "💉", connected: false, notificationsToday: 2, earningsToday: 22.00, currency: "USD" },
  { id: "pharmeasy", name: "Pharmacy Platform 3", category: "medical", regions: ["india"], color: "text-teal-400", bgColor: "bg-teal-500/10", borderColor: "border-teal-500/30", icon: "💊", connected: false, notificationsToday: 5, earningsToday: 380, currency: "INR" },
  { id: "netmeds", name: "Pharmacy Platform 4", category: "medical", regions: ["india"], color: "text-red-400", bgColor: "bg-red-500/10", borderColor: "border-red-500/30", icon: "🏥", connected: false, notificationsToday: 4, earningsToday: 320, currency: "INR" },
  { id: "1mg", name: "Pharmacy Platform 5", category: "medical", regions: ["india"], color: "text-orange-400", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/30", icon: "💊", connected: false, notificationsToday: 3, earningsToday: 290, currency: "INR" },

  // ── Alcohol Delivery ───────────────────────────────────────────────────────
  { id: "drizly", name: "Beverage Platform", category: "alcohol", regions: ["north-america"], color: "text-purple-400", bgColor: "bg-purple-500/10", borderColor: "border-purple-500/30", icon: "🍷", connected: false, notificationsToday: 4, earningsToday: 35.00, currency: "USD" },
  { id: "minibar", name: "Beverage Platform 2", category: "alcohol", regions: ["north-america"], color: "text-amber-400", bgColor: "bg-amber-500/10", borderColor: "border-amber-500/30", icon: "🍸", connected: false, notificationsToday: 3, earningsToday: 28.00, currency: "USD" },
  { id: "saucey", name: "Beverage Platform 3", category: "alcohol", regions: ["north-america"], color: "text-orange-400", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/30", icon: "🍺", connected: false, notificationsToday: 2, earningsToday: 22.00, currency: "USD" },
  { id: "hipbar", name: "Beverage Platform 4", category: "alcohol", regions: ["india"], color: "text-rose-400", bgColor: "bg-rose-500/10", borderColor: "border-rose-500/30", icon: "🥂", connected: false, notificationsToday: 2, earningsToday: 240, currency: "INR" },

  // ── Flower Delivery ────────────────────────────────────────────────────────
  { id: "bloomnation", name: "Flower Platform", category: "flower", regions: ["north-america"], color: "text-pink-400", bgColor: "bg-pink-500/10", borderColor: "border-pink-500/30", icon: "💐", connected: false, notificationsToday: 2, earningsToday: 25.00, currency: "USD" },
  { id: "1800-flowers", name: "Flower Platform 2", category: "flower", regions: ["north-america"], color: "text-pink-400", bgColor: "bg-pink-500/10", borderColor: "border-pink-500/30", icon: "🌸", connected: false, notificationsToday: 3, earningsToday: 30.00, currency: "USD" },
  { id: "interflora", name: "Flower Platform 3", category: "flower", regions: ["europe", "oceania"], color: "text-rose-400", bgColor: "bg-rose-500/10", borderColor: "border-rose-500/30", icon: "🌹", connected: false, notificationsToday: 2, earningsToday: 22.00, currency: "EUR" },
  { id: "ferns-petals", name: "Flower Platform 4", category: "flower", regions: ["india"], color: "text-green-400", bgColor: "bg-green-500/10", borderColor: "border-green-500/30", icon: "🌺", connected: false, notificationsToday: 3, earningsToday: 280, currency: "INR" },

  // ── Laundry & Dry Cleaning ─────────────────────────────────────────────────
  { id: "rinse", name: "Laundry Platform", category: "laundry", regions: ["north-america"], color: "text-cyan-400", bgColor: "bg-cyan-500/10", borderColor: "border-cyan-500/30", icon: "👔", connected: false, notificationsToday: 3, earningsToday: 28.00, currency: "USD" },
  { id: "flycleaners", name: "Laundry Platform 2", category: "laundry", regions: ["north-america"], color: "text-sky-400", bgColor: "bg-sky-500/10", borderColor: "border-sky-500/30", icon: "🧺", connected: false, notificationsToday: 2, earningsToday: 22.00, currency: "USD" },
  { id: "laundrokart", name: "Laundry Platform 3", category: "laundry", regions: ["india"], color: "text-blue-400", bgColor: "bg-blue-500/10", borderColor: "border-blue-500/30", icon: "👕", connected: false, notificationsToday: 3, earningsToday: 180, currency: "INR" },
  { id: "presso", name: "Laundry Platform 4", category: "laundry", regions: ["sea", "mena"], color: "text-indigo-400", bgColor: "bg-indigo-500/10", borderColor: "border-indigo-500/30", icon: "🧺", connected: false, notificationsToday: 2, earningsToday: 45.00, currency: "AED" },

  // ── Pet Supplies ───────────────────────────────────────────────────────────
  { id: "chewy", name: "Pet Supplies Platform", category: "pet-supplies", regions: ["north-america"], color: "text-yellow-400", bgColor: "bg-yellow-500/10", borderColor: "border-yellow-500/30", icon: "🐕", connected: false, notificationsToday: 2, earningsToday: 18.00, currency: "USD" },
  { id: "pets-at-home", name: "Pet Supplies Platform 2", category: "pet-supplies", regions: ["europe"], color: "text-red-400", bgColor: "bg-red-500/10", borderColor: "border-red-500/30", icon: "🐾", connected: false, notificationsToday: 1, earningsToday: 15.00, currency: "GBP" },
  { id: "heads-up-for-tails", name: "Pet Supplies Platform 3", category: "pet-supplies", regions: ["india"], color: "text-amber-400", bgColor: "bg-amber-500/10", borderColor: "border-amber-500/30", icon: "🐱", connected: false, notificationsToday: 2, earningsToday: 220, currency: "INR" },

  // ── Freight & Trucking ─────────────────────────────────────────────────────
  { id: "convoy", name: "Freight Platform", category: "freight", regions: ["north-america"], color: "text-amber-400", bgColor: "bg-amber-500/10", borderColor: "border-amber-500/30", icon: "🚛", connected: false, notificationsToday: 2, earningsToday: 180.00, currency: "USD" },
  { id: "uber-freight", name: "Freight Platform 2", category: "freight", regions: ["north-america", "europe"], color: "text-emerald-400", bgColor: "bg-emerald-500/10", borderColor: "border-emerald-500/30", icon: "🚚", connected: false, notificationsToday: 3, earningsToday: 220.00, currency: "USD" },
  { id: "blackbuck", name: "Freight Platform 3", category: "freight", regions: ["india"], color: "text-stone-400", bgColor: "bg-stone-500/10", borderColor: "border-stone-500/30", icon: "🚛", connected: false, notificationsToday: 2, earningsToday: 3500, currency: "INR" },

  // ── Furniture & Appliance ──────────────────────────────────────────────────
  { id: "wayfair-delivery", name: "Furniture Platform", category: "furniture", regions: ["north-america", "europe"], color: "text-stone-400", bgColor: "bg-stone-500/10", borderColor: "border-stone-500/30", icon: "🛋️", connected: false, notificationsToday: 1, earningsToday: 85.00, currency: "USD" },
  { id: "castlery", name: "Furniture Platform 2", category: "furniture", regions: ["sea", "oceania"], color: "text-amber-400", bgColor: "bg-amber-500/10", borderColor: "border-amber-500/30", icon: "🪑", connected: false, notificationsToday: 1, earningsToday: 65.00, currency: "SGD" },
  { id: "urban-ladder", name: "Furniture Platform 3", category: "furniture", regions: ["india"], color: "text-orange-400", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/30", icon: "🛋️", connected: false, notificationsToday: 1, earningsToday: 850, currency: "INR" },

  // ── Bicycle Courier ────────────────────────────────────────────────────────
  { id: "uber-connect", name: "Bicycle Courier Platform", category: "bicycle-courier", regions: ["north-america", "india", "sea", "latin-america"], color: "text-lime-400", bgColor: "bg-lime-500/10", borderColor: "border-lime-500/30", icon: "🚲", connected: false, notificationsToday: 5, earningsToday: 32.00, currency: "USD" },
  { id: "courier-please", name: "Bicycle Courier Platform 2", category: "bicycle-courier", regions: ["oceania"], color: "text-green-400", bgColor: "bg-green-500/10", borderColor: "border-green-500/30", icon: "🚴", connected: false, notificationsToday: 3, earningsToday: 42.00, currency: "AUD" },

  // ── Ride & Transport ──────────────────────────────────────────────────────
  { id: "uber-driver", name: "Delivery Platform", category: "ride-transport", regions: ["north-america", "europe", "india", "sea", "mena", "latin-america", "oceania"], color: "text-violet-400", bgColor: "bg-violet-500/10", borderColor: "border-violet-500/30", icon: "🚗", connected: false, notificationsToday: 15, earningsToday: 95.00, currency: "USD" },
  { id: "lyft-driver", name: "Delivery Platform 2", category: "ride-transport", regions: ["north-america"], color: "text-pink-400", bgColor: "bg-pink-500/10", borderColor: "border-pink-500/30", icon: "🌸", connected: false, notificationsToday: 10, earningsToday: 72.00, currency: "USD" },
  { id: "ola-driver", name: "Delivery Platform 3", category: "ride-transport", regions: ["india", "oceania"], color: "text-yellow-400", bgColor: "bg-yellow-500/10", borderColor: "border-yellow-500/30", icon: "🟡", connected: false, notificationsToday: 12, earningsToday: 890, currency: "INR" },
  { id: "grab-driver", name: "Delivery Platform 4", category: "ride-transport", regions: ["sea"], color: "text-green-400", bgColor: "bg-green-500/10", borderColor: "border-green-500/30", icon: "🟢", connected: false, notificationsToday: 14, earningsToday: 95.00, currency: "SGD" },
  { id: "careem", name: "Delivery Platform 5", category: "ride-transport", regions: ["mena"], color: "text-green-400", bgColor: "bg-green-500/10", borderColor: "border-green-500/30", icon: "🟢", connected: false, notificationsToday: 8, earningsToday: 110, currency: "AED" },
  { id: "didi", name: "Delivery Platform 6", category: "ride-transport", regions: ["east-asia", "latin-america", "oceania"], color: "text-orange-400", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/30", icon: "🟧", connected: false, notificationsToday: 11, earningsToday: 260, currency: "CNY" },
  { id: "bolt", name: "Delivery Platform 7", category: "ride-transport", regions: ["europe", "mena", "sea"], color: "text-green-400", bgColor: "bg-green-500/10", borderColor: "border-green-500/30", icon: "⚡", connected: false, notificationsToday: 9, earningsToday: 48.00, currency: "EUR" },

  // ── Document Delivery ──────────────────────────────────────────────────────
  { id: "dex", name: "Document Platform", category: "document", regions: ["north-america"], color: "text-slate-400", bgColor: "bg-slate-500/10", borderColor: "border-slate-500/30", icon: "📄", connected: false, notificationsToday: 2, earningsToday: 18.00, currency: "USD" },
  { id: "couriire", name: "Document Platform 2", category: "document", regions: ["india"], color: "text-indigo-400", bgColor: "bg-indigo-500/10", borderColor: "border-indigo-500/30", icon: "📋", connected: false, notificationsToday: 3, earningsToday: 220, currency: "INR" },

  // ── Same-Day Delivery ──────────────────────────────────────────────────────
  { id: "shipt", name: "Same-Day Platform", category: "same-day", regions: ["north-america"], color: "text-green-400", bgColor: "bg-green-500/10", borderColor: "border-green-500/30", icon: "⚡", connected: false, notificationsToday: 5, earningsToday: 38.00, currency: "USD" },
  { id: "cainiao", name: "Same-Day Platform 2", category: "same-day", regions: ["east-asia"], color: "text-red-400", bgColor: "bg-red-500/10", borderColor: "border-red-500/30", icon: "⚡", connected: false, notificationsToday: 8, earningsToday: 180, currency: "CNY" },
  { id: "ninja-van", name: "Same-Day Platform 3", category: "same-day", regions: ["sea"], color: "text-orange-400", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/30", icon: "🥷", connected: false, notificationsToday: 4, earningsToday: 55.00, currency: "SGD" },

  // ── White-Glove ────────────────────────────────────────────────────────────
  { id: "xpo", name: "White-Glove Platform", category: "white-glove", regions: ["north-america", "europe"], color: "text-fuchsia-400", bgColor: "bg-fuchsia-500/10", borderColor: "border-fuchsia-500/30", icon: "🤝", connected: false, notificationsToday: 1, earningsToday: 150.00, currency: "USD" },
  { id: "jd-logistics", name: "White-Glove Platform 2", category: "white-glove", regions: ["east-asia"], color: "text-red-400", bgColor: "bg-red-500/10", borderColor: "border-red-500/30", icon: "🤝", connected: false, notificationsToday: 2, earningsToday: 350, currency: "CNY" },

  // ── Cannabis & CBD ─────────────────────────────────────────────────────────
  { id: "eaze", name: "Delivery Platform 8", category: "cannabis", regions: ["north-america"], color: "text-green-400", bgColor: "bg-green-500/10", borderColor: "border-green-500/30", icon: "🌿", connected: false, notificationsToday: 2, earningsToday: 30.00, currency: "USD" },
  { id: "dutchie", name: "Delivery Platform 9", category: "cannabis", regions: ["north-america"], color: "text-lime-400", bgColor: "bg-lime-500/10", borderColor: "border-lime-500/30", icon: "🍃", connected: false, notificationsToday: 1, earningsToday: 22.00, currency: "USD" },

  // ── QSR & Fast Food ────────────────────────────────────────────────────────
  // Pizza chains
  { id: "dominos-india", name: "Restaurant Platform", category: "qsr", regions: ["india"], color: "text-blue-400", bgColor: "bg-blue-500/10", borderColor: "border-blue-500/30", icon: "🍕", connected: true, notificationsToday: 14, earningsToday: 850, currency: "INR" },
  { id: "dominos-us", name: "Restaurant Platform 2", category: "qsr", regions: ["north-america"], color: "text-blue-400", bgColor: "bg-blue-500/10", borderColor: "border-blue-500/30", icon: "🍕", connected: false, notificationsToday: 9, earningsToday: 58.00, currency: "USD" },
  { id: "pizza-hut-india", name: "Restaurant Platform 3", category: "qsr", regions: ["india"], color: "text-red-400", bgColor: "bg-red-500/10", borderColor: "border-red-500/30", icon: "🍕", connected: true, notificationsToday: 11, earningsToday: 720, currency: "INR" },
  { id: "pizza-hut", name: "Restaurant Platform 4", category: "qsr", regions: ["north-america", "europe", "oceania", "latin-america"], color: "text-red-400", bgColor: "bg-red-500/10", borderColor: "border-red-500/30", icon: "🍕", connected: false, notificationsToday: 8, earningsToday: 52.00, currency: "USD" },
  { id: "papa-johns", name: "Restaurant Platform 5", category: "qsr", regions: ["north-america", "europe"], color: "text-green-400", bgColor: "bg-green-500/10", borderColor: "border-green-500/30", icon: "🍕", connected: false, notificationsToday: 6, earningsToday: 42.00, currency: "USD" },

  // Burger chains
  { id: "mcdelivery-india", name: "Restaurant Platform 6", category: "qsr", regions: ["india"], color: "text-yellow-400", bgColor: "bg-yellow-500/10", borderColor: "border-yellow-500/30", icon: "🍔", connected: true, notificationsToday: 16, earningsToday: 680, currency: "INR" },
  { id: "mcdonalds", name: "Restaurant Platform 7", category: "qsr", regions: ["north-america", "europe", "oceania", "latin-america", "sea"], color: "text-yellow-400", bgColor: "bg-yellow-500/10", borderColor: "border-yellow-500/30", icon: "🍔", connected: false, notificationsToday: 12, earningsToday: 72.00, currency: "USD" },
  { id: "burger-king-india", name: "Restaurant Platform 8", category: "qsr", regions: ["india"], color: "text-red-400", bgColor: "bg-red-500/10", borderColor: "border-red-500/30", icon: "🍔", connected: true, notificationsToday: 10, earningsToday: 520, currency: "INR" },
  { id: "burger-king", name: "Restaurant Platform 9", category: "qsr", regions: ["north-america", "europe", "latin-america"], color: "text-red-400", bgColor: "bg-red-500/10", borderColor: "border-red-500/30", icon: "🍔", connected: false, notificationsToday: 8, earningsToday: 55.00, currency: "USD" },
  { id: "wendys", name: "Restaurant Platform 10", category: "qsr", regions: ["north-america"], color: "text-red-400", bgColor: "bg-red-500/10", borderColor: "border-red-500/30", icon: "🍔", connected: false, notificationsToday: 5, earningsToday: 38.00, currency: "USD" },
  { id: "five-guys", name: "Restaurant Platform 11", category: "qsr", regions: ["north-america", "europe"], color: "text-orange-400", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/30", icon: "🍔", connected: false, notificationsToday: 4, earningsToday: 45.00, currency: "USD" },

  // Chicken chains
  { id: "kfc-india", name: "Restaurant Platform 12", category: "qsr", regions: ["india"], color: "text-red-400", bgColor: "bg-red-500/10", borderColor: "border-red-500/30", icon: "🍗", connected: true, notificationsToday: 13, earningsToday: 640, currency: "INR" },
  { id: "kfc", name: "Restaurant Platform 13", category: "qsr", regions: ["north-america", "europe", "oceania", "sea", "mena", "latin-america"], color: "text-red-400", bgColor: "bg-red-500/10", borderColor: "border-red-500/30", icon: "🍗", connected: false, notificationsToday: 10, earningsToday: 62.00, currency: "USD" },
  { id: "chick-fil-a", name: "Restaurant Platform 14", category: "qsr", regions: ["north-america"], color: "text-red-400", bgColor: "bg-red-500/10", borderColor: "border-red-500/30", icon: "🐔", connected: false, notificationsToday: 9, earningsToday: 48.00, currency: "USD" },
  { id: "popeyes", name: "Restaurant Platform 15", category: "qsr", regions: ["north-america"], color: "text-orange-400", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/30", icon: "🍗", connected: false, notificationsToday: 6, earningsToday: 42.00, currency: "USD" },

  // Mexican / Sandwich / Other
  { id: "chipotle", name: "Restaurant Platform 16", category: "qsr", regions: ["north-america", "europe"], color: "text-amber-400", bgColor: "bg-amber-500/10", borderColor: "border-amber-500/30", icon: "🌯", connected: false, notificationsToday: 8, earningsToday: 52.00, currency: "USD" },
  { id: "taco-bell", name: "Restaurant Platform 17", category: "qsr", regions: ["north-america", "europe", "latin-america"], color: "text-purple-400", bgColor: "bg-purple-500/10", borderColor: "border-purple-500/30", icon: "🌮", connected: false, notificationsToday: 7, earningsToday: 38.00, currency: "USD" },
  { id: "subway", name: "Restaurant Platform 18", category: "qsr", regions: ["north-america", "europe", "india", "oceania", "sea", "latin-america"], color: "text-green-400", bgColor: "bg-green-500/10", borderColor: "border-green-500/30", icon: "🥪", connected: false, notificationsToday: 6, earningsToday: 35.00, currency: "USD" },
  { id: "panera", name: "Restaurant Platform 19", category: "qsr", regions: ["north-america"], color: "text-amber-400", bgColor: "bg-amber-500/10", borderColor: "border-amber-500/30", icon: "🥖", connected: false, notificationsToday: 5, earningsToday: 40.00, currency: "USD" },

  // Coffee / Bakery
  { id: "starbucks", name: "Restaurant Platform 20", category: "qsr", regions: ["north-america", "europe", "mena", "sea", "east-asia", "oceania"], color: "text-green-400", bgColor: "bg-green-500/10", borderColor: "border-green-500/30", icon: "☕", connected: false, notificationsToday: 11, earningsToday: 45.00, currency: "USD" },
  { id: "starbucks-india", name: "Restaurant Platform 21", category: "qsr", regions: ["india"], color: "text-green-400", bgColor: "bg-green-500/10", borderColor: "border-green-500/30", icon: "☕", connected: true, notificationsToday: 9, earningsToday: 480, currency: "INR" },
  { id: "dunkin", name: "Restaurant Platform 22", category: "qsr", regions: ["north-america"], color: "text-orange-400", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/30", icon: "🍩", connected: false, notificationsToday: 6, earningsToday: 28.00, currency: "USD" },
  { id: "tim-hortons", name: "Restaurant Platform 23", category: "qsr", regions: ["north-america"], color: "text-red-400", bgColor: "bg-red-500/10", borderColor: "border-red-500/30", icon: "☕", connected: false, notificationsToday: 7, earningsToday: 32.00, currency: "CAD" },

  // India-specific QSR
  { id: "eatsure", name: "Restaurant Platform 24", category: "qsr", regions: ["india"], color: "text-emerald-400", bgColor: "bg-emerald-500/10", borderColor: "border-emerald-500/30", icon: "🍔", connected: true, notificationsToday: 8, earningsToday: 420, currency: "INR" },
  { id: "box8", name: "Restaurant Platform 25", category: "qsr", regions: ["india"], color: "text-orange-400", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/30", icon: "🍱", connected: false, notificationsToday: 6, earningsToday: 380, currency: "INR" },
  { id: "behrouz", name: "Restaurant Platform 26", category: "qsr", regions: ["india"], color: "text-amber-400", bgColor: "bg-amber-500/10", borderColor: "border-amber-500/30", icon: "🍛", connected: false, notificationsToday: 5, earningsToday: 560, currency: "INR" },
  { id: "chaayos", name: "Restaurant Platform 27", category: "qsr", regions: ["india"], color: "text-orange-400", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/30", icon: "🍵", connected: false, notificationsToday: 4, earningsToday: 220, currency: "INR" },
  { id: "wow-momo", name: "Restaurant Platform 28", category: "qsr", regions: ["india"], color: "text-yellow-400", bgColor: "bg-yellow-500/10", borderColor: "border-yellow-500/30", icon: "🥟", connected: false, notificationsToday: 5, earningsToday: 280, currency: "INR" },
  { id: "faasos", name: "Restaurant Platform 29", category: "qsr", regions: ["india"], color: "text-yellow-400", bgColor: "bg-yellow-500/10", borderColor: "border-yellow-500/30", icon: "🌯", connected: false, notificationsToday: 7, earningsToday: 340, currency: "INR" },
  { id: "oven-story", name: "Restaurant Platform 30", category: "qsr", regions: ["india"], color: "text-orange-400", bgColor: "bg-orange-500/10", borderColor: "border-orange-500/30", icon: "🍕", connected: false, notificationsToday: 3, earningsToday: 410, currency: "INR" },
  { id: "mandarin-fox", name: "Restaurant Platform 31", category: "qsr", regions: ["india"], color: "text-red-400", bgColor: "bg-red-500/10", borderColor: "border-red-500/30", icon: "🍜", connected: false, notificationsToday: 3, earningsToday: 360, currency: "INR" },
  { id: "the-bowl-company", name: "Restaurant Platform 32", category: "qsr", regions: ["india"], color: "text-blue-400", bgColor: "bg-blue-500/10", borderColor: "border-blue-500/30", icon: "🥣", connected: false, notificationsToday: 4, earningsToday: 320, currency: "INR" },
  { id: "lenotre-dessert", name: "Restaurant Platform 33", category: "qsr", regions: ["mena"], color: "text-amber-400", bgColor: "bg-amber-500/10", borderColor: "border-amber-500/30", icon: "🍰", connected: false, notificationsToday: 2, earningsToday: 65.00, currency: "AED" },
];

// ─── Order ───────────────────────────────────────────────────────────────────

export interface DeliveryOrder {
  id: string;
  platform: string;
  category: string;
  value: number;
  currency: string;
  pickup: string;
  dropoff: string;
  distance: number;
  distanceUnit: "mi" | "km";
  timeRemaining: number; // seconds
  accepted: boolean | null; // null = pending
  timestamp: Date;
}

// ─── Earnings ────────────────────────────────────────────────────────────────

export interface EarningsData {
  day: string;
  [platformId: string]: string | number; // dynamic platform keys
}

// ─── Global Pickup/Dropoff Locations ─────────────────────────────────────────

export const PICKUP_LOCATIONS: Record<string, string[]> = {
  "north-america": [
    "McDonald's - Main St", "Chipotle - Oak Ave", "Starbucks - Center Blvd",
    "Whole Foods Market", "Chick-fil-A - Highway 9", "Panera Bread - Mall Rd",
    "Taco Bell - Pine St", "Wendy's - Elm Dr", "Target - Shopping Ctr",
    "Costco - Warehouse Blvd", "CVS Pharmacy - 5th Ave", "Walgreens - Broadway",
    "Apple Store - Downtown", "Best Buy - Tech Park", "Home Depot - Industrial Blvd",
  ],
  "europe": [
    "Pret A Manger - High St", "Costa Coffee - Oxford St", "Tesco Express - King's Rd",
    "Carrefour - Rue de Rivoli", "Lidl - Berliner Str", "Aldi - Muenchner Freiheit",
    "El Corte Inglés - Gran Vía", "Conad - Via Roma", "Albert Heijn - Kalverstraat",
    "Waitrose - Marylebone", "Sainsbury's - Camden", "Monoprix - Blvd Haussmann",
  ],
  "india": [
    "Swiggy Kitchen - Koramangala", "Zomato Hyperpure - HSR Layout", "DMart - Whitefield",
    "BigBasket Hub - Electronic City", "Apollo Pharmacy - MG Road", "MedPlus - Jubilee Hills",
    "Reliance Fresh - Bandra", "More Supermarket - Powai", "Nature's Basket - Worli",
    "FabIndia - Khan Market", "Haldiram's - Connaught Place", "Chai Point - Indiranagar",
  ],
  "east-asia": [
    "7-Eleven - Shibuya", "FamilyMart - Shinjuku", "Lawson - Ikebukuro",
    "Ele.me Hub - Jing'an", "Meituan Station - Pudong", "Hema Fresh - Xuhui",
    "CU - Gangnam", "GS25 - Hongdae", "Emart - Jamsil",
    "SF Express Depot - Futian", "JD Station - Chaoyang",
  ],
  "sea": [
    "7-Eleven - Sukhumvit", "Lotus's - Rama 3", "Big C - Ratchada",
    "FairPrice - Orchard", "Cold Storage - Bukit Timah", "Sheng Siong - Woodlands",
    "Indomaret - Sudirman", "Alfamart - Thamrin", "GrabMart Hub - BGC",
    "SM Supermarket - Makati", "Mercury Drug - Quezon City",
  ],
  "mena": [
    "Carrefour - Dubai Mall", "Spinneys - JBR", "Lulu Hypermarket - Al Barsha",
    "Talabat Kitchen - Doha", "Waitrose - Abu Dhabi", "Tamimi Markets - Riyadh",
    "Panda Supermarket - Jeddah", "Shoprite - Sandton", "Checkers - Claremont",
    "Jumia Hub - Yaba", "Carrefour - Cairo Festival City",
  ],
  "latin-america": [
    "iFood Kitchen - Pinheiros", "Carrefour - Paulista", "Pão de Açúcar - Itaim",
    "Rappi Hub - Chapinero", "Éxito - Poblado", "D1 - Laureles",
    "Mercado Libre Depot - Palermo", "Cencosud - Las Condes", "Wong - San Isidro",
    "Chedraui - Polanco", "Soriana - Del Valle",
  ],
  "oceania": [
    "Woolworths - George St", "Coles - Bourke St", "Aldi - Pitt St",
    "IGA - Chapel St", "Bunnings - Moorabbin", "Chemist Warehouse - Sydney CBD",
    "Menulog Kitchen - Surry Hills", "Countdown - Queen St", "New World - Victoria St",
  ],
};

export const DROPOFF_LOCATIONS: Record<string, string[]> = {
  "north-america": [
    "123 Oak Street, Apt 4B", "456 Maple Drive", "789 Pine Avenue",
    "321 Elm Court", "654 Cedar Lane", "987 Birch Road",
    "147 Willow Way", "258 Spruce Circle", "369 Aspen Blvd",
    "741 Magnolia St", "852 Hickory Dr", "963 Poplar Ave",
  ],
  "europe": [
    "14 Baker Street, Flat 2", "67 Kensington Gardens", "23 Rue de la Paix",
    "89 Friedrichstrasse, Apt 3", "45 Calle de Alcalá", "12 Via Veneto",
    "56 Herengracht", "78 Prinsengracht", "34 Kings Road, Suite 5",
  ],
  "india": [
    "42, HSR Layout, Sector 2", "15, Koramangala 4th Block", "88, Indiranagar 2nd Stage",
    "23, Whitefield Main Rd", "56, Jubilee Hills Rd No 10", "79, Bandra West, Hill Rd",
    "31, Connaught Place", "67, MG Road, Block A", "44, Powai Lake Rd",
  ],
  "east-asia": [
    "2-14-5 Shibuya, Apt 301", "1-8-3 Shinjuku, Room 502", "静安区南京西路1088号",
    "浦东新区陆家嘴环路958号", "강남구 테헤란로 123", "홍대입구 45번길 8",
    "福田区深南大道1001号", "朝阳区建国门外大街甲6号",
  ],
  "sea": [
    "123 Sukhumvit Soi 11", "456 Rama 9 Rd", "78 Ratchadaphisek Rd",
    "12 Orchard Road, #05-34", "34 Bukit Timah Rd, #02-12", "56 Woodlands Ave 6",
    "Jl. Sudirman No. 45", "Jl. Thamrin No. 78", "BGC, 28th Street, Unit 12",
  ],
  "mena": [
    "Dubai Marina, Tower A, Apt 1204", "JBR, Sadaf Tower, Flat 302",
    "Downtown Dubai, Boulevard Point", "Al Barsha 1, Street 23",
    "Riyadh, King Fahd Rd, Tower 5", "Jeddah, Tahlia St, Villa 12",
    "Sandton, Rivonia Rd, Office Park", "Cairo, Zamalek, 26 July St",
  ],
  "latin-america": [
    "Rua Oscar Freire, 456, Apt 12", "Av. Paulista, 1578, Sala 34",
    "Cra 7 #72-41, Apto 302", "Calle 10 #35-28, Oficina 501",
    "Av. Libertador 4521, Piso 8", "Huérfanos 1124, Depto 15",
    "Av. Insurgentes Sur 1234", "Col. Del Valle, Calle 23 #56",
  ],
  "oceania": [
    "42 George St, Unit 3", "158 Bourke St, Apt 12", "23 Pitt St, Level 5",
    "67 Chapel St, Shop 4", "89 Queen St, Flat 6", "34 Victoria St, Suite 2",
  ],
};

// ─── Weekly Earnings (Dynamic) ──────────────────────────────────────────────

export function generateWeeklyEarnings(platformIds: string[]): EarningsData[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const ranges: Record<string, [number, number]> = {
    "uber-eats": [35, 90], "doordash": [28, 75], "instacart": [22, 55],
    "grubhub": [12, 35], "amazon-flex": [18, 55], "deliveroo": [20, 50],
    "just-eat": [15, 42], "swiggy": [800, 1500], "zomato": [600, 1200],
    "ifood": [45, 95], "gopuff": [22, 40], "uber-driver": [50, 120],
    "lyft-driver": [35, 85], "ola-driver": [500, 1100], "grab-driver": [55, 105],
  };

  return days.map((day) => {
    const entry: EarningsData = { day };
    platformIds.forEach((pid) => {
      const range = ranges[pid] || [8, 45];
      entry[pid] = Math.floor(Math.random() * (range[1] - range[0]) + range[0]);
    });
    return entry;
  });
}

// ─── Order Generators ────────────────────────────────────────────────────────

let orderCounter = 0;

const INITIAL_ORDER_CONFIGS = [
  { platform: "uber-eats", category: "food", value: 12.50, distance: 3.2, timeRemaining: 25, region: "north-america" },
  { platform: "doordash", category: "food", value: 8.75, distance: 1.8, timeRemaining: 18, region: "north-america" },
  { platform: "instacart", category: "grocery", value: 22.30, distance: 5.6, timeRemaining: 30, region: "north-america" },
  { platform: "swiggy", category: "food", value: 180, distance: 4.5, timeRemaining: 22, region: "india" },
  { platform: "amazon-flex", category: "package", value: 9.99, distance: 4.1, timeRemaining: 28, region: "north-america" },
  { platform: "deliveroo", category: "food", value: 14.80, distance: 2.9, timeRemaining: 20, region: "europe" },
  { platform: "uber-driver", category: "ride-transport", value: 18.50, distance: 6.2, timeRemaining: 15, region: "north-america" },
];

export function generateInitialOrders(): DeliveryOrder[] {
  return INITIAL_ORDER_CONFIGS.map((o, i) => {
    const platform = PLATFORMS.find((p) => p.id === o.platform);
    const region = REGIONS.find((r) => r.id === o.region);
    const pickups = PICKUP_LOCATIONS[o.region] || PICKUP_LOCATIONS["north-america"];
    const dropoffs = DROPOFF_LOCATIONS[o.region] || DROPOFF_LOCATIONS["north-america"];

    return {
      id: `order-init-${i}`,
      platform: o.platform,
      category: o.category,
      value: o.value,
      currency: platform?.currency || "USD",
      pickup: pickups[i % pickups.length],
      dropoff: dropoffs[i % dropoffs.length],
      distance: o.distance,
      distanceUnit: region?.distanceUnit || "mi",
      timeRemaining: o.timeRemaining,
      accepted: null,
      timestamp: new Date(),
    };
  });
}

export function generateOrder(): DeliveryOrder {
  const platformIndex = Math.floor(Math.random() * PLATFORMS.length);
  const platform = PLATFORMS[platformIndex];
  const regionId = platform.regions[Math.floor(Math.random() * platform.regions.length)];
  const region = REGIONS.find((r) => r.id === regionId) || REGIONS[0];
  const pickups = PICKUP_LOCATIONS[regionId] || PICKUP_LOCATIONS["north-america"];
  const dropoffs = DROPOFF_LOCATIONS[regionId] || DROPOFF_LOCATIONS["north-america"];
  const category = DELIVERY_CATEGORIES.find((c) => c.id === platform.category);

  orderCounter++;

  // Value ranges vary by category and currency
  let value: number;
  if (platform.currency === "INR") {
    value = +(Math.random() * 300 + 80).toFixed(0);
  } else if (platform.currency === "JPY") {
    value = +(Math.random() * 3000 + 800).toFixed(0);
  } else if (platform.currency === "CNY") {
    value = +(Math.random() * 150 + 40).toFixed(0);
  } else if (platform.currency === "IDR") {
    value = +(Math.random() * 80000 + 20000).toFixed(0);
  } else if (platform.currency === "KRW") {
    value = +(Math.random() * 30000 + 5000).toFixed(0);
  } else if (platform.currency === "PHP") {
    value = +(Math.random() * 400 + 80).toFixed(0);
  } else if (category?.id === "freight" || category?.id === "white-glove") {
    value = +(Math.random() * 200 + 50).toFixed(2);
  } else if (category?.id === "furniture") {
    value = +(Math.random() * 80 + 25).toFixed(2);
  } else if (category?.id === "ride-transport") {
    value = +(Math.random() * 30 + 8).toFixed(2);
  } else {
    value = +(Math.random() * 25 + 5).toFixed(2);
  }

  const distance = region.distanceUnit === "km"
    ? +(Math.random() * 12 + 1).toFixed(1)
    : +(Math.random() * 8 + 0.5).toFixed(1);
  const timeRemaining = Math.floor(Math.random() * 30 + 15);

  return {
    id: `order-${Date.now()}-${orderCounter}`,
    platform: platform.id,
    category: platform.category,
    value,
    currency: platform.currency,
    pickup: pickups[Math.floor(Math.random() * pickups.length)],
    dropoff: dropoffs[Math.floor(Math.random() * dropoffs.length)],
    distance,
    distanceUnit: region.distanceUnit,
    timeRemaining,
    accepted: null,
    timestamp: new Date(),
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

export function getPlatformById(id: string): Platform | undefined {
  return PLATFORMS.find((p) => p.id === id);
}

export function getCategoryById(id: string): DeliveryCategory | undefined {
  return DELIVERY_CATEGORIES.find((c) => c.id === id);
}

export function getCurrencySymbol(code: string): string {
  return CURRENCIES[code]?.symbol ?? "$";
}

export function formatCurrency(value: number, currencyCode: string): string {
  const symbol = getCurrencySymbol(currencyCode);
  // For currencies with large denominations (JPY, KRW, IDR), no decimals
  if (["JPY", "KRW", "IDR"].includes(currencyCode)) {
    return `${symbol}${Math.round(value).toLocaleString()}`;
  }
  // For INR and other currencies with whole-number pricing, skip decimals
  if (value === Math.floor(value)) {
    return `${symbol}${value.toLocaleString()}`;
  }
  return `${symbol}${value.toFixed(2)}`;
}

export function getPlatformsByCategory(categoryId: string): Platform[] {
  return PLATFORMS.filter((p) => p.category === categoryId);
}

export function getPlatformsByRegion(regionId: string): Platform[] {
  return PLATFORMS.filter((p) => p.regions.includes(regionId));
}

export function getConnectedPlatforms(): Platform[] {
  return PLATFORMS.filter((p) => p.connected);
}

// ─── Navigation ──────────────────────────────────────────────────────────────

export const NAV_ITEMS = [
  { id: "hero", label: "Home" },
  { id: "how-it-works", label: "How It Works" },
  { id: "dashboard", label: "Dashboard" },
  { id: "earnings", label: "Earnings" },
  { id: "platforms", label: "Platforms" },
  { id: "settings", label: "Settings" },
];

// ─── Free Preview Period ─────────────────────────────────────────────────────
// NotiFetch is in its 6-month Free Preview — no payment collection, no tiers.
// After the preview, a free tier remains and a premium tier launches with
// the full platform catalog. Pricing will be added here when that happens.

export const FREE_PREVIEW = {
  active: true,
  durationMonths: 6,
  startDate: "2026-03-04",
  endDate: "2026-09-04",
  tagline: "All features free for 6 months. No card on file.",
};

