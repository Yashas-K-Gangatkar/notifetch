"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  Volume2,
  Moon,
  Globe,
  Languages,
  Save,
  CheckCircle2,
} from "lucide-react";
import { useTheme } from "next-themes";
import {
  REGIONS,
  CURRENCIES,
  PLATFORMS,
  type Region,
} from "@/lib/data";

interface Settings {
  region: string;
  currency: string;
  distanceUnit: "mi" | "km";
  language: string;
  darkMode: boolean;
  soundAlerts: boolean;
  vibration: boolean;
  voiceAlerts: boolean;
}

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिन्दी (Hindi)" },
  { code: "es", name: "Español" },
  { code: "pt", name: "Português" },
  { code: "fr", name: "Français" },
];

export function SettingsSection() {
  const { data: session, status } = useSession();
  const { theme, setTheme } = useTheme();
  const [settings, setSettings] = useState<Settings>({
    region: "north-america",
    currency: "USD",
    distanceUnit: "mi",
    language: "en",
    darkMode: true,
    soundAlerts: true,
    vibration: true,
    voiceAlerts: false,
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load settings from server when user is logged in
  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetch("/api/user")
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setSettings({
              region: data.user.region || "north-america",
              currency: data.user.currency || "USD",
              distanceUnit: data.user.distanceUnit || "mi",
              language: data.user.language || "en",
              darkMode: data.user.darkMode ?? true,
              soundAlerts: data.user.soundAlerts ?? true,
              vibration: data.user.vibration ?? true,
              voiceAlerts: data.user.voiceAlerts ?? false,
            });
            // Sync theme with user preference
            if (data.user.darkMode !== undefined) {
              setTheme(data.user.darkMode ? "dark" : "light");
            }
          }
        })
        .catch(() => {});
    }
  }, [status, session, setTheme]);

  const updateSetting = <K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);

    // If dark mode is toggled, immediately apply it
    if (key === "darkMode") {
      setTheme(value ? "dark" : "light");
    }
  };

  const handleSave = async () => {
    setLoading(true);

    // If user is logged in, save to server
    if (status === "authenticated" && session?.user?.id) {
      try {
        await fetch("/api/user", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            region: settings.region,
            currency: settings.currency,
            language: settings.language,
            distanceUnit: settings.distanceUnit,
            darkMode: settings.darkMode,
            soundAlerts: settings.soundAlerts,
            vibration: settings.vibration,
            voiceAlerts: settings.voiceAlerts,
          }),
        });
      } catch {
        // Fallback to localStorage
      }
    }

    // Always save to localStorage as fallback
    try {
      localStorage.setItem("notifetch_settings", JSON.stringify(settings));
    } catch {}

    setSaved(true);
    setLoading(false);
    setTimeout(() => setSaved(false), 3000);
  };

  const selectedRegion = REGIONS.find((r) => r.id === settings.region);

  return (
    <section id="settings" className="py-16 sm:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">
            App{" "}
            <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
              Settings
            </span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Customize your NotiFetch experience
          </p>
        </div>

        <Card className="border-border/50 shadow-lg">
          <CardContent className="p-6 space-y-8">
            {/* Region & Language */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Globe className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold">Region & Language</h3>
              </div>

              {/* Region selector */}
              <div className="space-y-2">
                <Label>Region</Label>
                <Select
                  value={settings.region}
                  onValueChange={(v) => updateSetting("region", v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {REGIONS.map((r: Region) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.flag} {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedRegion && (
                  <p className="text-xs text-muted-foreground">
                    {PLATFORMS.filter((p) => p.regions.includes(selectedRegion.id)).length} platforms available in this region
                  </p>
                )}
              </div>

              {/* Language selector */}
              <div className="space-y-2">
                <Label>Language</Label>
                <Select
                  value={settings.language}
                  onValueChange={(v) => updateSetting("language", v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((l) => (
                      <SelectItem key={l.code} value={l.code}>
                        {l.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Currency selector */}
              <div className="space-y-2">
                <Label>Currency</Label>
                <Select
                  value={settings.currency}
                  onValueChange={(v) => updateSetting("currency", v)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(CURRENCIES).map(([code, c]) => (
                      <SelectItem key={code} value={code}>
                        {c.symbol} {c.name} ({code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Distance unit */}
              <div className="space-y-2">
                <Label>Distance Unit</Label>
                <Select
                  value={settings.distanceUnit}
                  onValueChange={(v) => updateSetting("distanceUnit", v as "mi" | "km")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mi">Miles (mi)</SelectItem>
                    <SelectItem value="km">Kilometers (km)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Bell className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold">Notification Preferences</h3>
              </div>

              {/* Sound alerts */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4" />
                    Play a sound when new orders arrive
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Get an audio alert for new delivery orders
                  </p>
                </div>
                <Switch
                  checked={settings.soundAlerts}
                  onCheckedChange={(v) => updateSetting("soundAlerts", v)}
                />
              </div>

              {/* Vibration */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Vibrate on new notifications
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Phone vibrates when a new order arrives
                  </p>
                </div>
                <Switch
                  checked={settings.vibration}
                  onCheckedChange={(v) => updateSetting("vibration", v)}
                />
              </div>

              {/* Voice alerts */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="flex items-center gap-2">
                    <Languages className="w-4 h-4" />
                    Announce order details aloud
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Text-to-speech reads out order value and location
                  </p>
                </div>
                <Switch
                  checked={settings.voiceAlerts}
                  onCheckedChange={(v) => updateSetting("voiceAlerts", v)}
                />
              </div>
            </div>

            {/* Appearance */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Moon className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold">Appearance</h3>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Dark Mode</Label>
                  <p className="text-xs text-muted-foreground">
                    Easier on the eyes during night deliveries
                  </p>
                </div>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={(v) => updateSetting("darkMode", v)}
                />
              </div>
            </div>

            {/* Save button */}
            <div className="pt-4">
              <Button
                onClick={handleSave}
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold shadow-lg shadow-amber-500/25"
              >
                {saved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Settings Saved!
                  </>
                ) : loading ? (
                  "Saving..."
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </>
                )}
              </Button>
              {status !== "authenticated" && (
                <p className="text-xs text-muted-foreground text-center mt-2">
                  Sign in to sync settings across devices
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
