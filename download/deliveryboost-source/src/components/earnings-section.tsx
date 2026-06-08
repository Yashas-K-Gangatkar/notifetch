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
  ArrowDownRight,
} from "lucide-react";
import {
  PLATFORMS,
  WEEKLY_EARNINGS,
  LAST_WEEK_EARNINGS,
  type DeliveryOrder,
} from "@/lib/data";

interface EarningsProps {
  acceptedOrders: DeliveryOrder[];
}

const chartConfig: ChartConfig = {
  uberEats: { label: "Uber Eats", color: "#34d399" },
  doorDash: { label: "DoorDash", color: "#f87171" },
  instacart: { label: "Instacart", color: "#fb923c" },
  grubhub: { label: "Grubhub", color: "#facc15" },
  amazonFlex: { label: "Amazon Flex", color: "#2dd4bf" },
};

export function EarningsSection({ acceptedOrders }: EarningsProps) {
  const totalThisWeek = WEEKLY_EARNINGS.reduce(
    (sum, d) =>
      sum + d.uberEats + d.doorDash + d.instacart + d.grubhub + d.amazonFlex,
    0
  );
  const totalLastWeek = LAST_WEEK_EARNINGS.reduce(
    (sum, d) =>
      sum + d.uberEats + d.doorDash + d.instacart + d.grubhub + d.amazonFlex,
    0
  );
  const weekChange = +(
    ((totalThisWeek - totalLastWeek) / totalLastWeek) *
    100
  ).toFixed(1);

  const todayEarned = acceptedOrders.reduce((sum, o) => sum + o.value, 0);
  const completedOrders = acceptedOrders.length;
  const avgPerOrder = completedOrders > 0 ? todayEarned / completedOrders : 0;

  // Find best hour (simulated)
  const bestHour = "6 PM - 7 PM";

  // Platform breakdown
  const platformBreakdown = PLATFORMS.map((p) => ({
    ...p,
    weekEarnings: WEEKLY_EARNINGS.reduce((sum, d) => {
      const key = p.id
        .replace(/-([a-z])/g, (_, c) => c.toUpperCase()) as keyof typeof d;
      return sum + (d[key] || 0);
    }, 0),
  })).sort((a, b) => b.weekEarnings - a.weekEarnings);

  return (
    <section id="earnings" className="py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Earnings{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
              Tracker
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Track your earnings across all platforms in one place
          </p>
        </div>

        {/* Today stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
                  ) : (
                    <ArrowDownRight className="w-3 h-3 mr-1" />
                  )}
                  {weekChange >= 0 ? "+" : ""}
                  {weekChange}% vs last week
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <BarChart data={WEEKLY_EARNINGS} accessibilityLayer>
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
                  <Bar
                    dataKey="uberEats"
                    stackId="a"
                    fill="var(--color-uberEats)"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="doorDash"
                    stackId="a"
                    fill="var(--color-doorDash)"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="instacart"
                    stackId="a"
                    fill="var(--color-instacart)"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="grubhub"
                    stackId="a"
                    fill="var(--color-grubhub)"
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="amazonFlex"
                    stackId="a"
                    fill="var(--color-amazonFlex)"
                    radius={[4, 4, 0, 0]}
                  />
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
                      className={`h-full rounded-full ${
                        p.id === "uber-eats"
                          ? "bg-emerald-400"
                          : p.id === "doordash"
                          ? "bg-red-400"
                          : p.id === "instacart"
                          ? "bg-orange-400"
                          : p.id === "grubhub"
                          ? "bg-yellow-400"
                          : "bg-teal-400"
                      }`}
                      style={{
                        width: `${(p.weekEarnings / totalThisWeek) * 100}%`,
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
      </div>
    </section>
  );
}
