"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  DollarSign,
  TrendingUp,
  Clock,
  Award,
  ArrowUpRight,
  Globe,
  LayoutGrid,
} from "lucide-react";
import {
  PLATFORMS,
  DELIVERY_CATEGORIES,
  REGIONS,
  generateWeeklyEarnings,
  formatCurrency,
  getCurrencySymbol,
  type DeliveryOrder,
} from "@/lib/data";

interface EarningsProps {
  acceptedOrders: DeliveryOrder[];
}

// Color palette for dynamic platform bars
const BAR_COLORS = [
  "#34d399", "#f87171", "#fb923c", "#facc15", "#2dd4bf",
  "#a78bfa", "#f472b6", "#38bdf8", "#818cf8", "#fb7185",
  "#4ade80", "#fbbf24", "#c084fc", "#22d3ee", "#f97316",
];

export function EarningsSection({ acceptedOrders }: EarningsProps) {
  // Get connected platforms for chart — these are static constants
  const connectedPlatforms = PLATFORMS.filter((p) => p.connected);
  const connectedIds = connectedPlatforms.map((p) => p.id);

  // Generate weekly earnings (based on static platform data, no deps needed)
  const thisWeekEarnings = generateWeeklyEarnings(connectedIds);
  const lastWeekEarnings = generateWeeklyEarnings(connectedIds);

  // Dynamic chart config based on connected platforms
  const chartConfig: ChartConfig = (() => {
    const config: ChartConfig = {};
    connectedPlatforms.forEach((p, i) => {
      config[p.id] = {
        label: p.name,
        color: BAR_COLORS[i % BAR_COLORS.length],
      };
    });
    return config;
  })();

  const totalThisWeek = thisWeekEarnings.reduce(
    (sum, d) => connectedIds.reduce((s, id) => s + (Number(d[id]) || 0), 0) + sum,
    0
  );
  const totalLastWeek = lastWeekEarnings.reduce(
    (sum, d) => connectedIds.reduce((s, id) => s + (Number(d[id]) || 0), 0) + sum,
    0
  );
  const weekChange = totalLastWeek > 0
    ? +(((totalThisWeek - totalLastWeek) / totalLastWeek) * 100).toFixed(1)
    : 0;

  const todayEarned = acceptedOrders.reduce((sum, o) => sum + o.value, 0);
  const completedOrders = acceptedOrders.length;
  const avgPerOrder = completedOrders > 0 ? todayEarned / completedOrders : 0;

  // Best hour (simulated)
  const bestHour = "6 PM - 7 PM";

  // Platform breakdown
  const platformBreakdown = connectedPlatforms.map((p, i) => ({
    ...p,
    weekEarnings: thisWeekEarnings.reduce((sum, d) => sum + (Number(d[p.id]) || 0), 0),
    barColor: BAR_COLORS[i % BAR_COLORS.length],
  })).sort((a, b) => b.weekEarnings - a.weekEarnings);

  // Category breakdown from accepted orders
  const categoryBreakdown = DELIVERY_CATEGORIES
    .map((c) => ({
      ...c,
      count: acceptedOrders.filter((o) => o.category === c.id).length,
    }))
    .filter((c) => c.count > 0)
    .sort((a, b) => b.count - a.count);

  return (
    <section id="earnings" className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Earnings{" "}
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Tracker
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Track earnings across all platforms and categories worldwide
          </p>
          <p className="text-xs text-muted-foreground/70 mt-3 max-w-2xl mx-auto">
            <span className="inline-block bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-semibold tracking-wide">DEMO</span>
            {" "}Sample earnings shown below are illustrative. Your real earnings come from completing deliveries in each platform&apos;s partner app — NotiFetch just aggregates them into one view.
          </p>
        </div>

        {/* Today stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-amber-500" />
                <span className="text-sm text-muted-foreground">
                  Today&apos;s Earnings
                </span>
              </div>
              <p className="text-2xl font-bold">${todayEarned.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-500" />
                <span className="text-sm text-muted-foreground">
                  Orders Completed
                </span>
              </div>
              <p className="text-2xl font-bold">{completedOrders}</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-muted-foreground">
                  Avg Per Order
                </span>
              </div>
              <p className="text-2xl font-bold">${avgPerOrder.toFixed(2)}</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-teal-500" />
                <span className="text-sm text-muted-foreground">Best Hour</span>
              </div>
              <p className="text-2xl font-bold">{bestHour}</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-violet-500" />
                <span className="text-sm text-muted-foreground">Regions</span>
              </div>
              <p className="text-2xl font-bold">
                {new Set(acceptedOrders.flatMap((o) => {
                  const p = PLATFORMS.find((pl) => pl.id === o.platform);
                  return p?.regions || [];
                })).size || REGIONS.length} active
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <Card className="lg:col-span-2 bg-card border-border">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Weekly Earnings</CardTitle>
                <Badge
                  variant="secondary"
                  className={`${
                    weekChange >= 0
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-red-500/10 text-red-500"
                  }`}
                >
                  {weekChange >= 0 ? (
                    <ArrowUpRight className="w-3 h-3 mr-1" />
                  ) : null}
                  {weekChange >= 0 ? "+" : ""}
                  {weekChange}% vs last week
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart data={thisWeekEarnings} accessibilityLayer>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  {connectedPlatforms.map((p, i) => (
                    <Bar
                      key={p.id}
                      dataKey={p.id}
                      stackId="a"
                      fill={BAR_COLORS[i % BAR_COLORS.length]}
                      radius={i === connectedPlatforms.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]}
                    />
                  ))}
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Platform breakdown */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">By Platform</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {platformBreakdown.map((p) => (
                <div key={p.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span>{p.icon}</span>
                      <span className="text-sm font-medium">{p.name}</span>
                    </div>
                    <span className="text-sm font-bold">
                      ${p.weekEarnings.toFixed(0)}
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${totalThisWeek > 0 ? (p.weekEarnings / totalThisWeek) * 100 : 0}%`,
                        backgroundColor: p.barColor,
                      }}
                    />
                  </div>
                </div>
              ))}

              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">This Week Total</span>
                  <span className="text-lg font-bold text-amber-500">
                    ${totalThisWeek.toFixed(0)}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm text-muted-foreground">
                    Last Week
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ${totalLastWeek.toFixed(0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        {categoryBreakdown.length > 0 && (
          <Card className="mt-6 bg-card border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-amber-500" />
                By Delivery Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {DELIVERY_CATEGORIES.map((c) => {
                  const count = acceptedOrders.filter((o) => o.category === c.id).length;
                  if (count === 0) return null;
                  return (
                    <div
                      key={c.id}
                      className={`rounded-lg border p-3 text-center ${c.bgColor} ${c.borderColor}`}
                    >
                      <span className="text-2xl">{c.icon}</span>
                      <p className={`text-sm font-medium mt-1 ${c.color}`}>{count}</p>
                      <p className="text-[10px] text-muted-foreground">{c.name}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
