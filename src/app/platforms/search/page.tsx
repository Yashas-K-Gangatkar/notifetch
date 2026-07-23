"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Smartphone, ArrowLeft, Copy, Check } from "lucide-react";
import { BackButton } from "@/components/back-button";

interface PlatformMapping {
  [brandName: string]: {
    number: string;
    package: string;
    index: number;
  };
}

export default function PlatformSearchPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mapping, setMapping] = useState<PlatformMapping>({});
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetch("/platform-mapping.json")
      .then((res) => res.json())
      .then((data) => setMapping(data))
      .catch(() => {});
  }, []);

  const results = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();
    return Object.entries(mapping)
      .filter(([brand, info]) => brand.toLowerCase().includes(query))
      .slice(0, 20);
  }, [searchQuery, mapping]);

  const handleCopy = (platformNumber: string) => {
    navigator.clipboard.writeText(platformNumber);
    setCopied(platformNumber);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <BackButton fallback="/" />
            <h1 className="text-lg font-bold">Find Your Platform Number</h1>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-3">Platform Search</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Search for your delivery platform below. Remember the platform number, then open the NotiFetch app and select that number to connect.
          </p>
        </div>

        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Type your platform name (e.g., Swiggy, Zomato, Uber)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
              autoFocus
            />
          </div>
        </div>

        {results.length > 0 && (
          <div className="space-y-3">
            {results.map(([brand, info]) => (
              <Card key={info.package} className="hover:border-amber-500/30 transition-colors">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-lg">{brand}</p>
                      <p className="text-xs text-muted-foreground font-mono">{info.package}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-base px-4 py-2">
                        {info.number}
                      </Badge>
                      <button
                        onClick={() => handleCopy(info.number)}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                        aria-label="Copy platform number"
                      >
                        {copied === info.number ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {searchQuery.trim() && results.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              No platforms found for &quot;{searchQuery}&quot;. Try a different search term.
            </p>
          </div>
        )}

        {!searchQuery.trim() && (
          <Card className="border-amber-500/20 bg-amber-500/5">
            <CardContent className="py-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-amber-500" />
                How to connect your platform
              </h3>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li><strong>1.</strong> Search for your delivery platform above (e.g., type &quot;Swiggy&quot;)</li>
                <li><strong>2.</strong> Note the platform number shown (e.g., &quot;Platform 136&quot;)</li>
                <li><strong>3.</strong> Open the NotiFetch app on your phone</li>
                <li><strong>4.</strong> Go to Settings → Platform Names</li>
                <li><strong>5.</strong> Find the platform number and rename it to whatever you want</li>
              </ol>
              <p className="text-xs text-muted-foreground mt-4">
                NotiFetch uses platform numbers instead of brand names to protect your privacy and comply with trademark regulations. You can rename any platform to whatever you prefer in the app.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
