"use client";

import { useState } from "react";
import { PLATFORMS, DELIVERY_CATEGORIES } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function PlatformsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredPlatforms = selectedCategory === "all"
    ? PLATFORMS
    : PLATFORMS.filter(p => p.category === selectedCategory);

  const categories = [
    { id: "all", name: "All" },
    ...DELIVERY_CATEGORIES.filter(c => PLATFORMS.some(p => p.category === c.id)).map(c => ({ id: c.id, name: c.name }))
  ];

  return (
    <section id="platforms" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Supported Platforms</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            NotiFetch works with {PLATFORMS.length}+ delivery partner apps across all categories.
            No API keys needed — just enable notification access on your phone.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === cat.id
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Platform grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filteredPlatforms.map(platform => (
            <Card key={platform.id} className="bg-card/50 hover:bg-card/80 transition-colors border-border/50">
              <CardContent className="p-4 text-center">
                <span className="text-2xl mb-2 block">{platform.icon}</span>
                <p className="font-medium text-sm mb-1">{platform.name}</p>
                <Badge variant="secondary" className="text-xs">
                  {DELIVERY_CATEGORIES.find(c => c.id === platform.category)?.name || platform.category}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
