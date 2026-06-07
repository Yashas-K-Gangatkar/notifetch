"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Vibrate,
  Mic,
  Shield,
  Volume2,
  MapPin,
  DollarSign,
  Moon,
  Sun,
  Save,
  Car,
} from "lucide-react";
import { useTheme } from "next-themes";

interface Settings {
  soundAlerts: boolean;
  vibration: boolean;
  voiceAlerts: boolean;
  autoAccept: boolean;
  minValue: number;
  maxDistance: number;
  preferredPlatforms: Set<string>;
  rideSafeMode: boolean;
}

export function SettingsSection() {
  const { setTheme } = useTheme();
  const [settings, setSettings] = useState<Settings>({
    soundAlerts: true,
    vibration: true,
    voiceAlerts: false,
    autoAccept: false,
    minValue: 8,
    maxDistance: 6,
    preferredPlatforms: new Set(["uber-eats", "doordash"]),
    rideSafeMode: false,
  });
  const [saved, setSaved] = useState(false);

  const updateSetting = <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const togglePreferredPlatform = (platformId: string) => {
    setSettings((prev) => {
      const next = new Set(prev.preferredPlatforms);
      if (next.has(platformId)) {
        next.delete(platformId);
      } else {
        next.add(platformId);
      }
      return { ...prev, preferredPlatforms: next };
    });
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const platformOptions = [
    { id: "uber-eats", name: "Uber Eats", color: "text-emerald-400" },
    { id: "doordash", name: "DoorDash", color: "text-red-400" },
    { id: "instacart", name: "Instacart", color: "text-orange-400" },
    { id: "grubhub", name: "Grubhub", color: "text-yellow-400" },
    { id: "amazon-flex", name: "Amazon Flex", color: "text-teal-400" },
  ];

  return (
    <section id="settings" className="py-16 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            App{" "}
            <span className="bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
              Settings
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Customize your DeliveryBoost experience
          </p>
        </div>

        <div className="space-y-6">
          {/* Notification preferences */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <Label className="font-medium">Sound Alerts</Label>
                    <p className="text-xs text-muted-foreground">
                      Play a sound when new orders arrive
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.soundAlerts}
                  onCheckedChange={(v) => updateSetting("soundAlerts", v)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Vibrate className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <Label className="font-medium">Vibration</Label>
                    <p className="text-xs text-muted-foreground">
                      Vibrate on new notifications
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.vibration}
                  onCheckedChange={(v) => updateSetting("vibration", v)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mic className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <Label className="font-medium">Voice Alerts</Label>
                    <p className="text-xs text-muted-foreground">
                      Announce order details aloud
                    </p>
                  </div>
                </div>
                <Switch
                  checked={settings.voiceAlerts}
                  onCheckedChange={(v) => updateSetting("voiceAlerts", v)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Auto-accept rules */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-500" />
                Auto-Accept Rules
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Enable Auto-Accept</Label>
                  <p className="text-xs text-muted-foreground">
                    Automatically accept orders matching your rules
                  </p>
                </div>
                <Switch
                  checked={settings.autoAccept}
                  onCheckedChange={(v) => updateSetting("autoAccept", v)}
                />
              </div>

              {settings.autoAccept && (
                <>
                  <Separator />
                  <div className="space-y-4 animate-float-up">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="font-medium flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-amber-500" />
                          Minimum Order Value
                        </Label>
                        <Badge className="bg-amber-500/10 text-amber-500">
                          ${settings.minValue.toFixed(2)}
                        </Badge>
                      </div>
                      <Slider
                        value={[settings.minValue]}
                        onValueChange={([v]) => updateSetting("minValue", v)}
                        min={3}
                        max={30}
                        step={0.5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>$3.00</span>
                        <span>$30.00</span>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label className="font-medium flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-amber-500" />
                          Maximum Distance
                        </Label>
                        <Badge className="bg-amber-500/10 text-amber-500">
                          {settings.maxDistance} mi
                        </Badge>
                      </div>
                      <Slider
                        value={[settings.maxDistance]}
                        onValueChange={([v]) => updateSetting("maxDistance", v)}
                        min={1}
                        max={15}
                        step={0.5}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>1 mi</span>
                        <span>15 mi</span>
                      </div>
                    </div>

                    <div>
                      <Label className="font-medium mb-2 block">
                        Preferred Platforms
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {platformOptions.map((p) => (
                          <button
                            key={p.id}
                            onClick={() => togglePreferredPlatform(p.id)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                              settings.preferredPlatforms.has(p.id)
                                ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                                : "bg-muted text-muted-foreground border-transparent"
                            }`}
                          >
                            {p.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Ride-safe mode */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Car className="w-5 h-5 text-amber-500" />
                Safety Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Ride-Safe Mode</Label>
                  <p className="text-xs text-muted-foreground">
                    Only show notifications when vehicle is parked. Reduces
                    distraction while driving.
                  </p>
                </div>
                <Switch
                  checked={settings.rideSafeMode}
                  onCheckedChange={(v) => updateSetting("rideSafeMode", v)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Theme */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 relative">
                <Sun className="w-5 h-5 text-amber-500 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="w-5 h-5 text-amber-500 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 absolute top-1/2 -translate-y-1/2" />
                <span className="ml-1">Appearance</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label className="font-medium">Dark Mode</Label>
                  <p className="text-xs text-muted-foreground">
                    Easier on the eyes during night deliveries
                  </p>
                </div>
                <Switch
                  defaultChecked
                  onCheckedChange={(v) => setTheme(v ? "dark" : "light")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save button */}
          <Button
            onClick={handleSave}
            className="w-full h-12 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold shadow-lg shadow-amber-500/25"
          >
            <Save className="w-4 h-4 mr-2" />
            {saved ? "Settings Saved!" : "Save Settings"}
          </Button>
        </div>
      </div>
    </section>
  );
}
