"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Wifi,
  WifiOff,
  DollarSign,
  Bell,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { PLATFORMS, type Platform } from "@/lib/data";

export function PlatformsSection() {
  const [platforms, setPlatforms] = useState<Platform[]>(
    PLATFORMS.map((p) => ({ ...p }))
  );
  const [connecting, setConnecting] = useState<string | null>(null);

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

  return (
    <section id="platforms" className="py-16 sm:py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            Connected{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
              Platforms
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Manage your delivery platform connections
          </p>
        </div>

        {/* Summary */}
        <div className="flex items-center justify-center gap-6 mb-8">
          <div className="text-center">
            <p className="text-3xl font-bold text-amber-500">
              {platforms.filter((p) => p.connected).length}
            </p>
            <p className="text-sm text-muted-foreground">Connected</p>
          </div>
          <Separator orientation="vertical" className="h-10" />
          <div className="text-center">
            <p className="text-3xl font-bold">
              {platforms.reduce((sum, p) => sum + p.earningsToday, 0).toFixed(2)}
            </p>
            <p className="text-sm text-muted-foreground">Total Today</p>
          </div>
          <Separator orientation="vertical" className="h-10" />
          <div className="text-center">
            <p className="text-3xl font-bold">
              {platforms.reduce((sum, p) => sum + p.notificationsToday, 0)}
            </p>
            <p className="text-sm text-muted-foreground">Notifications</p>
          </div>
        </div>

        {/* Platform cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {platforms.map((platform) => (
            <Card
              key={platform.id}
              className={`bg-card border transition-all duration-300 ${
                platform.connected
                  ? platform.borderColor
                  : "border-border opacity-60"
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{platform.icon}</span>
                    <div>
                      <h3 className="font-semibold">{platform.name}</h3>
                      <div className="flex items-center gap-1.5">
                        {platform.connected ? (
                          <>
                            <Wifi className="w-3 h-3 text-emerald-500" />
                            <span className="text-xs text-emerald-500 font-medium">
                              Connected
                            </span>
                          </>
                        ) : (
                          <>
                            <WifiOff className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              Disconnected
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {connecting === platform.id && (
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
                    )}
                    <Switch
                      checked={platform.connected}
                      onCheckedChange={() => toggleConnection(platform.id)}
                      disabled={connecting === platform.id}
                    />
                  </div>
                </div>

                {platform.connected && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/50 rounded-lg p-2.5">
                      <div className="flex items-center gap-1 mb-1">
                        <Bell className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Notifications
                        </span>
                      </div>
                      <p className="text-lg font-bold">
                        {platform.notificationsToday}
                      </p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-2.5">
                      <div className="flex items-center gap-1 mb-1">
                        <DollarSign className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Earned Today
                        </span>
                      </div>
                      <p className="text-lg font-bold">
                        ${platform.earningsToday.toFixed(2)}
                      </p>
                    </div>
                  </div>
                )}

                {!platform.connected && (
                  <Button
                    onClick={() => toggleConnection(platform.id)}
                    variant="outline"
                    className="w-full mt-2 border-dashed"
                    disabled={connecting === platform.id}
                  >
                    {connecting === platform.id ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Wifi className="w-4 h-4 mr-2" />
                        Connect {platform.name}
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
