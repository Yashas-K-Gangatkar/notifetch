/**
 * NotiFetch Logo — the N|F brand mark.
 *
 * v2.9.39: Replaced the previous Zap (lightning bolt) icon with the actual
 * NotiFetch logo (navy N block | brown F block). Used in navbar, page-load
 * animation, hero section, anywhere the brand mark appears.
 *
 * Rendered as inline SVG so it scales crisply at any size.
 *   - Left block: navy (#1a2238) bg, white "N"
 *   - Right block: taupe/brown (#b08968) bg, navy "F"
 */

interface NFLogoProps {
  className?: string;
  showWordmark?: boolean;
}

export function NFLogo({ className = "w-8 h-8", showWordmark = false }: NFLogoProps) {
  return (
    <div className={`flex items-center gap-2 ${showWordmark ? "" : "inline-flex"}`}>
      <svg
        viewBox="0 0 100 50"
        className={className}
        role="img"
        aria-label="NotiFetch logo"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left block: navy bg, white N */}
        <rect x="2" y="2" width="46" height="46" rx="6" fill="#1a2238" stroke="#ffffff" strokeWidth="1.5" />
        <text x="25" y="34" textAnchor="middle" fill="#ffffff" fontFamily="Arial, sans-serif" fontSize="26" fontWeight="900">N</text>
        {/* Right block: taupe bg, navy F */}
        <rect x="52" y="2" width="46" height="46" rx="6" fill="#b08968" stroke="#8b6f4e" strokeWidth="1.5" />
        <text x="75" y="34" textAnchor="middle" fill="#1a2238" fontFamily="Arial, sans-serif" fontSize="26" fontWeight="900">F</text>
      </svg>
      {showWordmark && (
        <span className="text-lg font-bold text-foreground">NotiFetch</span>
      )}
    </div>
  );
}
