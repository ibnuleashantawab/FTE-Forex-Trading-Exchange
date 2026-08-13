import React from 'react';

interface FteLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const FteLogo: React.FC<FteLogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const dimensions = {
    sm: { width: 32, height: 32, textClass: 'text-sm' },
    md: { width: 44, height: 44, textClass: 'text-lg' },
    lg: { width: 60, height: 60, textClass: 'text-2xl' },
    xl: { width: 90, height: 90, textClass: 'text-3xl' },
  }[size];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Metallic Gold & Silver SVG Monogram Logo */}
      <svg
        width={dimensions.width}
        height={dimensions.height}
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-[0_0_12px_rgba(212,175,55,0.4)]"
      >
        <defs>
          <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F3E5AB" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#85600E" />
          </linearGradient>
          <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#C0C0C0" />
            <stop offset="100%" stopColor="#707070" />
          </linearGradient>
          <linearGradient id="glowGold" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FFD700" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Outer Circular Ring (Gold & Silver Dual Arc) */}
        <circle cx="100" cy="100" r="90" stroke="url(#goldGrad)" strokeWidth="6" opacity="0.9" fill="none" />
        <path
          d="M 20 100 A 80 80 0 0 1 170 40"
          stroke="url(#silverGrad)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />

        {/* Candlestick Bar Chart Graphic */}
        {/* Candle 1 */}
        <line x1="65" y1="125" x2="65" y2="145" stroke="url(#goldGrad)" strokeWidth="2" />
        <rect x="62" y="130" width="6" height="10" fill="url(#goldGrad)" rx="1" />

        {/* Candle 2 */}
        <line x1="77" y1="115" x2="77" y2="140" stroke="url(#goldGrad)" strokeWidth="2" />
        <rect x="74" y="120" width="6" height="15" fill="url(#goldGrad)" rx="1" />

        {/* Candle 3 */}
        <line x1="89" y1="105" x2="89" y2="135" stroke="url(#goldGrad)" strokeWidth="2" />
        <rect x="86" y="110" width="6" height="20" fill="url(#goldGrad)" rx="1" />

        {/* Growth Volume Bar Graphic (Silver Columns) */}
        <rect x="105" y="140" width="7" height="15" fill="url(#silverGrad)" rx="1" />
        <rect x="117" y="130" width="7" height="25" fill="url(#silverGrad)" rx="1" />
        <rect x="129" y="118" width="7" height="37" fill="url(#silverGrad)" rx="1" />
        <rect x="141" y="105" width="7" height="50" fill="url(#silverGrad)" rx="1" />

        {/* FTE Monogram Overlay */}
        {/* Letter 'F' (Gold) */}
        <path
          d="M 50 65 L 80 65 M 50 65 L 50 120 M 50 90 L 75 90"
          stroke="url(#goldGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Letter 'T' (Silver Center Peak) */}
        <path
          d="M 75 55 L 130 55 M 102 55 L 102 145"
          stroke="url(#silverGrad)"
          strokeWidth="11"
          strokeLinecap="round"
        />

        {/* Letter 'E' (Gold Right) */}
        <path
          d="M 125 70 L 155 70 M 125 70 L 125 125 M 125 97 L 150 97 M 125 125 L 155 125"
          stroke="url(#goldGrad)"
          strokeWidth="9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Upward Bullish Forex Growth Arrow */}
        <path
          d="M 55 145 C 90 125, 130 95, 175 55"
          stroke="url(#goldGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        <polygon points="175,55 160,60 168,73" fill="url(#goldGrad)" />
      </svg>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-1.5">
            <span className={`font-extrabold tracking-wider bg-gradient-to-r from-gold-300 via-gold-500 to-gold-600 bg-clip-text text-transparent ${dimensions.textClass}`}>
              FTE
            </span>
            <span className="h-1 w-1 rounded-full bg-gold-400"></span>
          </div>
          <span className="text-[10px] font-semibold tracking-widest text-silver-400 uppercase">
            Forex Trading Exchange
          </span>
        </div>
      )}
    </div>
  );
};
