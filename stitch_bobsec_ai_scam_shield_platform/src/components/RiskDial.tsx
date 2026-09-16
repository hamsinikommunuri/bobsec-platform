import React from 'react';

interface RiskDialProps {
  score: number;
  confidence: number;
  level: string;
}

export const RiskDial: React.FC<RiskDialProps> = ({ score, confidence, level }) => {
  // Radius of the main indicator arc
  const radius = 92;
  const circumference = 2 * Math.PI * radius; // ~578.05
  const clampedScore = Math.max(0, Math.min(100, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  let strokeColor = '#35c88a'; // Emerald (Low Risk)
  let glowColor = 'rgba(53, 200, 138, 0.5)';
  if (clampedScore >= 70) {
    strokeColor = '#f06063'; // Vermilion (High Risk)
    glowColor = 'rgba(240, 96, 99, 0.6)';
  } else if (clampedScore >= 45) {
    strokeColor = '#e8aa42'; // Amber (Suspicious)
    glowColor = 'rgba(232, 170, 66, 0.5)';
  } else if (clampedScore >= 20) {
    strokeColor = '#74d4e8'; // Cyan (Caution)
    glowColor = 'rgba(116, 212, 232, 0.5)';
  }

  return (
    <div className="flex flex-col items-center justify-center relative py-4">
      {/* Soft localized optical backlight */}
      <div
        className="absolute w-56 h-56 rounded-full blur-[64px] pointer-events-none transition-all duration-700"
        style={{ backgroundColor: glowColor, opacity: 0.25 }}
      />

      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Outer Calibrated Complication Dial (Inline SVG, Horological markers) */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 240 240">
          {/* Dial base track with micro ticks */}
          <circle
            className="text-surface-variant/40"
            cx="120"
            cy="120"
            fill="none"
            r="102"
            stroke="currentColor"
            strokeDasharray="2 6"
            strokeWidth="1.5"
          />
          {/* Inner secondary track */}
          <circle
            className="text-surface-variant/30"
            cx="120"
            cy="120"
            fill="none"
            r="92"
            stroke="currentColor"
            strokeWidth="1"
          />
          {/* Dynamic Risk Arc */}
          <circle
            className="transition-all duration-1000 ease-out"
            cx="120"
            cy="120"
            fill="none"
            r="92"
            stroke={strokeColor}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            strokeWidth="3.5"
            style={{
              filter: `drop-shadow(0 0 8px ${glowColor})`
            }}
          />
          {/* Calibrated Cardinal Indices */}
          <circle cx="120" cy="18" fill="#e3e2e3" r="2" />
          <circle cx="222" cy="120" fill="#879395" r="2" />
          <circle cx="120" cy="222" fill="#879395" r="2" />
          <circle cx="18" cy="120" fill="#879395" r="2" />
        </svg>

        {/* Core Dial Assembly */}
        <div className="relative z-10 flex flex-col items-center justify-center text-center select-none">
          <span className="font-label-instrument text-label-instrument uppercase tracking-widest text-outline">
            THREAT MAGNITUDE
          </span>
          <div className="flex items-baseline justify-center mt-1">
            <span className="font-monumental-numeral text-monumental-numeral text-on-surface leading-none tracking-tighter">
              {clampedScore}
            </span>
            <span className="font-title-lg text-title-lg text-outline-variant ml-1 font-light">/ 100</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full bg-surface-container-high/80 border border-white/[0.05]">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: strokeColor, boxShadow: `0 0 6px ${strokeColor}` }}
            />
            <span className="font-label-tabular text-label-tabular text-on-surface-variant font-mono">
              {confidence}% CONFIDENCE
            </span>
          </div>
        </div>

        {/* Micro Reticle Crosshairs */}
        <div className="absolute top-2 w-px h-2 bg-outline/30" />
        <div className="absolute bottom-2 w-px h-2 bg-outline/30" />
        <div className="absolute left-2 w-2 h-px bg-outline/30" />
        <div className="absolute right-2 w-2 h-px bg-outline/30" />
      </div>

      <span className="mt-3 font-label-tabular text-label-tabular text-outline uppercase tracking-wider font-mono">
        DETERMINISTIC CALIBRATION · {level.toUpperCase()}
      </span>
    </div>
  );
};
