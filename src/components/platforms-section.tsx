"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  WifiOff,
  Bell,
  RefreshCw,
  Search,
  Globe,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
} from "lucide-react";
import {
  PLATFORMS,
  DELIVERY_CATEGORIES,
  REGIONS,
  formatCurrency,
  getPlatformsByCategory,
  getPlatformsByRegion,
  type Platform,
} from "@/lib/data";

export function PlatformsSection() {
  const [platforms, setPlatforms] = useState<Platform[]>(
    PLATFORMS.map((p) => ({ ...p }))
  );
  const [connecting, setConnecting] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeRegion, setActiveRegion] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(["food", "grocery", "package"])
  );
  const [showAllCategories, setShowAllCategories] = useState(false);

  const toggleConnection = (platformId: string) => {
    setConnecting(platformId);
    setTimeout(() => {
      setPlatforms((prev) =>
        prev.map((p) =>
          p.id === platformId ? { ...p, connected: !p.connected } : p
        )
      );
      setConnecting(null);
    }, 1500);
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) next.delete(categoryId);
      else next.add(categoryId);
      return next;
    });
  };

  // Filter platforms
  const filteredPlatforms = useMemo(() => {
    let result = platforms;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    if (activeRegion) {
      result = result.filter((p) => p.regions.includes(activeRegion));
    }
    if (activeCategory) {
      result = result.filter((p) => p.category === activeCategory);
    }
    return result;
  }, [platforms, searchQuery, activeRegion, activeCategory]);

  // Group filtered platforms by category
  const groupedPlatforms = useMemo(() => {
    const groups: Record<string, Platform[]> = {};
    filteredPlatforms.forEach((p) => {
      if (!groups[p.category]) groups[p.category] = [];
      groups[p.category].push(p);
    });
    return groups;
  }, [filteredPlatforms]);

  // Sort categories: connected first, then by platform count
  const sortedCategories = useMemo(() => {
    return DELIVERY_CATEGORIES
      .filter((c) => groupedPlatforms[c.id])
      .sort((a, b) => {
        const aConnected = (groupedPlatforms[a.id] || []).filter((p) => p.connected).length;
        const bConnected = (groupedPlatforms[b.id] || []).filter((p) => p.connected).length;
        if (bConnected !== aConnected) return bConnected - aConnected;
        return (groupedPlatforms[b.id]?.length || 0) - (groupedPlatforms[a.id]?.length || 0);
      });
  }, [groupedPlatforms]);

  const visibleCategories = showAllCategories
    ? sortedCategories
    : sortedCategories.slice(0, 6);

  const connectedCount = platforms.filter((p) => p.connected).length;
  const totalEarnings = platforms
    .filter((p) => p.connected)
    .reduce((sum, p) => sum + p.earningsToday, 0);
  const totalNotifications = platforms
    .filter((p) => p.connected)
    .reduce((sum, p) => sum + p.notificationsToday, 0);

  return (
    <section id="platforms" className="py-16 sm:py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Global{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
              Platforms
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            {PLATFORMS.length} real delivery platforms across {DELIVERY_CATEGORIES.length} categories worldwide
          </p>
        </div>

        {/* Summary — real counts only, demo data explicitly labeled */}
        <div className="flex items-center justify-center gap-6 mb-2 flex-wrap">
          <div className="text-center">
            <p className="text-3xl font-bold text-amber-500">{PLATFORMS.length}</p>
            <p className="text-sm text-muted-foreground">Real Platforms</p>
          </div>
          <Separator orientation="vertical" className="h-10" />
          <div className="text-center">
            <p className="text-3xl font-bold">{DELIVERY_CATEGORIES.length}</p>
            <p className="text-sm text-muted-foreground">Categories</p>
          </div>
          <Separator orientation="vertical" className="h-10" />
          <div className="text-center">
            <p className="text-3xl font-bold">{REGIONS.length}</p>
            <p className="text-sm text-muted-foreground">Global Regions</p>
          </div>
          <Separator orientation="vertical" className="h-10" />
          <div className="text-center">
            <p className="text-3xl font-bold text-green-500">{connectedCount}</p>
            <p className="text-sm text-muted-foreground">Sample Preview</p>
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground/70 mb-8">
          <span className="inline-block bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-semibold tracking-wide">DEMO</span>
          {" "}Sample notifications shown below are illustrative. Real notifications appear after you install the NotiFetch app and grant notification access.
        </p>

        {/* Search & Filters */}
        <div className="space-y-4 mb-6">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search platforms by name, category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-card border-border"
            />
          </div>

          {/* Region filter pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
            <button
              onClick={() => setActiveRegion(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                !activeRegion
                  ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                  : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
              }`}
            >
              All Regions
            </button>
            {REGIONS.map((r) => (
              <button
                key={r.id}
                onClick={() => setActiveRegion(activeRegion === r.id ? null : r.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  activeRegion === r.id
                    ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                    : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
                }`}
              >
                {r.flag} {r.name}
              </button>
            ))}
          </div>

          {/* Category filter pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <LayoutGrid className="w-4 h-4 text-muted-foreground shrink-0" />
            <button
              onClick={() => setActiveCategory(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                !activeCategory
                  ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                  : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
              }`}
            >
              All Categories
            </button>
            {DELIVERY_CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(activeCategory === c.id ? null : c.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  activeCategory === c.id
                    ? `${c.bgColor} ${c.color} ${c.borderColor}`
                    : "bg-muted text-muted-foreground border-transparent hover:bg-muted/80"
                }`}
              >
                {c.icon} {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Category Groups */}
        <div className="space-y-4">
          {visibleCategories.map((category) => {
            const categoryPlatforms = groupedPlatforms[category.id] || [];
            const connectedInCategory = categoryPlatforms.filter((p) => p.connected).length;
            const isExpanded = expandedCategories.has(category.id);

            return (
              <Card
                key={category.id}
                className={`bg-card border transition-all duration-300 ${
                  connectedInCategory > 0
                    ? category.borderColor
                    : "border-border"
                }`}
              >
                {/* Category Header - clickable to expand/collapse */}
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors rounded-t-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{category.icon}</span>
                    <div className="text-left">
                      <h3 className={`font-semibold ${category.color}`}>
                        {category.name}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {category.description} · {categoryPlatforms.length} platform{categoryPlatforms.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {connectedInCategory > 0 && (
                      <Badge className={`${category.bgColor} ${category.color}`}>
                        {connectedInCategory} listening
                      </Badge>
                    )}
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                </button>

                {/* Platform Cards (expanded) */}
                {isExpanded && (
                  <CardContent className="px-4 pb-4 pt-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {categoryPlatforms.map((platform) => (
                        <div
                          key={platform.id}
                          className={`rounded-lg border p-3 transition-all ${
                            platform.connected
                              ? `${platform.borderColor} ${platform.bgColor}`
                              : "border-border opacity-60 hover:opacity-80"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-lg">{platform.icon}</span>
                              <div>
                                <h4 className="text-sm font-semibold">{platform.name}</h4>
                                <div className="flex items-center gap-1">
                                  {platform.connected ? (
                                    <>
                                      <Bell className="w-3 h-3 text-emerald-500" />
                                      <span className="text-[10px] text-emerald-500 font-medium">
                                        Listening
                                      </span>
                                    </>
                                  ) : (
                                    <>
                                      <WifiOff className="w-3 h-3 text-muted-foreground" />
                                      <span className="text-[10px] text-muted-foreground">
                                        Available
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {connecting === platform.id && (
                                <RefreshCw className="w-3 h-3 animate-spin text-amber-500" />
                              )}
                              <Switch
                                checked={platform.connected}
                                onCheckedChange={() => toggleConnection(platform.id)}
                                disabled={connecting === platform.id}
                                className="scale-75"
                              />
                            </div>
                          </div>

                          {/* Region badges */}
                          <div className="flex flex-wrap gap-1 mb-2">
                            {platform.regions.slice(0, 3).map((rId) => {
                              const r = REGIONS.find((reg) => reg.id === rId);
                              return r ? (
                                <span
                                  key={rId}
                                  className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                                >
                                  {r.flag} {r.name}
                                </span>
                              ) : null;
                            })}
                            {platform.regions.length > 3 && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
                                +{platform.regions.length - 3} more
                              </span>
                            )}
                          </div>

                          {platform.connected && (
                            <div className="grid grid-cols-2 gap-2">
                              <div className="bg-muted/50 rounded p-1.5">
                                <div className="flex items-center gap-1 mb-0.5">
                                  <Bell className="w-2.5 h-2.5 text-muted-foreground" />
                                  <span className="text-[9px] text-muted-foreground">
                                    Notifs
                                  </span>
                                </div>
                                <p className="text-sm font-bold">
                                  {platform.notificationsToday}
                                </p>
                              </div>
                              <div className="bg-muted/50 rounded p-1.5">
                                <div className="flex items-center gap-1 mb-0.5">
                                  <span className="text-[9px] text-muted-foreground">
                                    Earned
                                  </span>
                                </div>
                                <p className="text-sm font-bold">
                                  {formatCurrency(platform.earningsToday, platform.currency)}
                                </p>
                              </div>
                            </div>
                          )}

                          {!platform.connected && (
                            <Button
                              onClick={() => toggleConnection(platform.id)}
                              variant="outline"
                              size="sm"
                              className="w-full mt-1 border-dashed h-7 text-xs"
                              disabled={connecting === platform.id}
                            >
                              {connecting === platform.id ? (
                                <>
                                  <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                                  Enabling...
                                </>
                              ) : (
                                <>
                                  <Bell className="w-3 h-3 mr-1" />
                                  Listen
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}

          {/* Show more categories button */}
          {sortedCategories.length > 6 && (
            <div className="text-center pt-2">
              <Button
                variant="outline"
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="border-dashed"
              >
                {showAllCategories ? (
                  "Show Less"
                ) : (
                  `Show ${sortedCategories.length - 6} More Categories`
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
