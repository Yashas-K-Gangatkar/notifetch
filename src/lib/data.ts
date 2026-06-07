export interface Platform {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  connected: boolean;
  notificationsToday: number;
  earningsToday: number;
}

export interface DeliveryOrder {
  id: string;
  platform: string;
  value: number;
  pickup: string;
  dropoff: string;
  distance: number;
  timeRemaining: number; // seconds
  accepted: boolean | null; // null = pending
  timestamp: Date;
}

export interface EarningsData {
  day: string;
  uberEats: number;
  doorDash: number;
  instacart: number;
  grubhub: number;
  amazonFlex: number;
}

export const PLATFORMS: Platform[] = [
  {
    id: "uber-eats",
    name: "Uber Eats",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    icon: "🟢",
    connected: true,
    notificationsToday: 24,
    earningsToday: 87.50,
  },
  {
    id: "doordash",
    name: "DoorDash",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    icon: "🔴",
    connected: true,
    notificationsToday: 18,
    earningsToday: 62.30,
  },
  {
    id: "instacart",
    name: "Instacart",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    icon: "🟠",
    connected: true,
    notificationsToday: 12,
    earningsToday: 45.80,
  },
  {
    id: "grubhub",
    name: "Grubhub",
    color: "text-yellow-400",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    icon: "🟡",
    connected: false,
    notificationsToday: 8,
    earningsToday: 31.20,
  },
  {
    id: "amazon-flex",
    name: "Amazon Flex",
    color: "text-teal-400",
    bgColor: "bg-teal-500/10",
    borderColor: "border-teal-500/30",
    icon: "🔵",
    connected: true,
    notificationsToday: 6,
    earningsToday: 52.40,
  },
];

export const PICKUP_LOCATIONS = [
  "McDonald's - Main St",
  "Chipotle - Oak Ave",
  "Starbucks - Center Blvd",
  "Whole Foods Market",
  "Chick-fil-A - Highway 9",
  "Panera Bread - Mall Rd",
  "Taco Bell - Pine St",
  "Wendy's - Elm Dr",
  "Target - Shopping Ctr",
  "Costco - Warehouse Blvd",
  "Pizza Hut - Valley Rd",
  "Subway - Station Ave",
];

export const DROPOFF_LOCATIONS = [
  "123 Oak Street, Apt 4B",
  "456 Maple Drive",
  "789 Pine Avenue",
  "321 Elm Court",
  "654 Cedar Lane",
  "987 Birch Road",
  "147 Willow Way",
  "258 Spruce Circle",
  "369 Aspen Blvd",
  "741 Magnolia St",
  "852 Hickory Dr",
  "963 Poplar Ave",
];

export const WEEKLY_EARNINGS: EarningsData[] = [
  { day: "Mon", uberEats: 45, doorDash: 32, instacart: 28, grubhub: 15, amazonFlex: 22 },
  { day: "Tue", uberEats: 52, doorDash: 41, instacart: 35, grubhub: 18, amazonFlex: 30 },
  { day: "Wed", uberEats: 38, doorDash: 28, instacart: 42, grubhub: 12, amazonFlex: 25 },
  { day: "Thu", uberEats: 61, doorDash: 55, instacart: 30, grubhub: 22, amazonFlex: 38 },
  { day: "Fri", uberEats: 72, doorDash: 63, instacart: 48, grubhub: 28, amazonFlex: 45 },
  { day: "Sat", uberEats: 88, doorDash: 75, instacart: 55, grubhub: 35, amazonFlex: 52 },
  { day: "Sun", uberEats: 65, doorDash: 50, instacart: 40, grubhub: 20, amazonFlex: 35 },
];

export const LAST_WEEK_EARNINGS: EarningsData[] = [
  { day: "Mon", uberEats: 40, doorDash: 28, instacart: 22, grubhub: 12, amazonFlex: 18 },
  { day: "Tue", uberEats: 48, doorDash: 35, instacart: 30, grubhub: 15, amazonFlex: 25 },
  { day: "Wed", uberEats: 35, doorDash: 25, instacart: 38, grubhub: 10, amazonFlex: 20 },
  { day: "Thu", uberEats: 55, doorDash: 48, instacart: 25, grubhub: 18, amazonFlex: 32 },
  { day: "Fri", uberEats: 65, doorDash: 55, instacart: 42, grubhub: 24, amazonFlex: 38 },
  { day: "Sat", uberEats: 80, doorDash: 68, instacart: 48, grubhub: 30, amazonFlex: 45 },
  { day: "Sun", uberEats: 58, doorDash: 42, instacart: 35, grubhub: 16, amazonFlex: 28 },
];

let orderCounter = 0;

export function generateOrder(): DeliveryOrder {
  const platformIndex = Math.floor(Math.random() * PLATFORMS.length);
  const platform = PLATFORMS[platformIndex];
  orderCounter++;

  const value = +(Math.random() * 25 + 5).toFixed(2);
  const distance = +(Math.random() * 8 + 0.5).toFixed(1);
  const timeRemaining = Math.floor(Math.random() * 30 + 15);

  return {
    id: `order-${Date.now()}-${orderCounter}`,
    platform: platform.id,
    value,
    pickup: PICKUP_LOCATIONS[Math.floor(Math.random() * PICKUP_LOCATIONS.length)],
    dropoff: DROPOFF_LOCATIONS[Math.floor(Math.random() * DROPOFF_LOCATIONS.length)],
    distance,
    timeRemaining,
    accepted: null,
    timestamp: new Date(),
  };
}

export function getPlatformById(id: string): Platform | undefined {
  return PLATFORMS.find((p) => p.id === id);
}

export const NAV_ITEMS = [
  { id: "hero", label: "Home" },
  { id: "dashboard", label: "Dashboard" },
  { id: "earnings", label: "Earnings" },
  { id: "pricing", label: "Pricing" },
  { id: "settings", label: "Settings" },
];
