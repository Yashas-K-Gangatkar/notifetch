/**
 * NotiFetch Logo — the N|F brand mark.
 *
 * v2.9.41: Updated to match the new Canva-designed logo.
 *   - Left block: navy (#102F4B) bg, white "N"
 *   - Right block: coral (#EE9C81) bg, navy "F"
 *
 * v2.9.39: Original version used taupe right block — replaced with coral
 * to match the user's Canva redesign (June 2026).
 *
 * Rendered as inline SVG so it scales crisply at any size.
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
        <rect x="2" y="2" width="46" height="46" rx="6" fill="#102F4B" stroke="#ffffff" strokeWidth="1.5" />
        <text x="25" y="34" textAnchor="middle" fill="#ffffff" fontFamily="Arial, sans-serif" fontSize="26" fontWeight="900">N</text>
        {/* Right block: coral bg, navy F */}
        <rect x="52" y="2" width="46" height="46" rx="6" fill="#EE9C81" stroke="#102F4B" strokeWidth="1.5" />
        <text x="75" y="34" textAnchor="middle" fill="#102F4B" fontFamily="Arial, sans-serif" fontSize="26" fontWeight="900">F</text>
      </svg>
      {showWordmark && (
        <span className="text-lg font-bold text-foreground">NotiFetch</span>
      )}
    </div>
  );
}
