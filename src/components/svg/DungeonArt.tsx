import React from 'react';

interface SVGProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

/**
 * Handcrafted vector artwork for Couple Quest (Dungeon Roguelite)
 * Styled with clean lines, dark fantasy woodcut/engraving influences,
 * and subdued, eye-friendly palettes.
 */

// Monster: The Overthinking Phantom
export const OverthinkingPhantomSVG: React.FC<SVGProps> = ({ size = 120, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {/* Ambient shadow wisp */}
    <ellipse cx="60" cy="108" rx="36" ry="7" fill="#000000" fillOpacity="0.45" />

    {/* Ethereal shroud cloak */}
    <path
      d="M60 22C42 22 32 36 31 56C30 68 24 82 20 95C24 94 30 92 35 94C41 96 46 92 51 94C56 96 62 92 68 94C74 96 79 92 84 94C89 96 95 94 99 95C95 82 89 68 88 56C87 36 78 22 60 22Z"
      fill="#1c202d"
      stroke="#3b4256"
      strokeWidth="2"
      strokeLinejoin="round"
    />

    {/* Cowl hood folds */}
    <path
      d="M44 48C46 38 52 32 60 32C68 32 74 38 76 48C70 54 50 54 44 48Z"
      fill="#121520"
      stroke="#4b5563"
      strokeWidth="1.5"
    />

    {/* Spectral void face */}
    <ellipse cx="60" cy="46" rx="14" ry="11" fill="#090a10" />

    {/* Haunting glowing eyes */}
    <circle cx="54" cy="46" r="2.2" fill="#93c5fd" />
    <circle cx="66" cy="46" r="2.2" fill="#93c5fd" />

    {/* Overthinking psychic wisp rings (floating thoughts) */}
    <path
      d="M42 24C48 16 72 16 78 24"
      stroke="#60a5fa"
      strokeWidth="1.75"
      strokeDasharray="3 3"
      strokeLinecap="round"
      opacity="0.8"
    />
    <path
      d="M36 18C46 8 74 8 84 18"
      stroke="#818cf8"
      strokeWidth="1.2"
      strokeDasharray="2 3"
      strokeLinecap="round"
      opacity="0.5"
    />

    {/* Chains of Doubt draped over mantle */}
    <path
      d="M38 64C48 74 72 74 82 64"
      stroke="#64748b"
      strokeWidth="1.5"
      strokeDasharray="4 2"
      fill="none"
    />
    <path
      d="M42 74C50 82 70 82 78 74"
      stroke="#475569"
      strokeWidth="1.5"
      strokeDasharray="4 2"
      fill="none"
    />
  </svg>
);

// Monster: The "Terserah" Slime
export const TerserahSlimeSVG: React.FC<SVGProps> = ({ size = 120, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <ellipse cx="60" cy="106" rx="38" ry="8" fill="#000000" fillOpacity="0.5" />
    <path
      d="M25 94C20 80 24 64 36 56C42 52 46 44 48 38C52 42 56 46 64 42C72 38 78 44 80 50C92 56 98 70 95 90C92 98 84 100 60 100C36 100 28 98 25 94Z"
      fill="#1a2524"
      stroke="#334d49"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Indecisive Question Wisp */}
    <path
      d="M58 26C58 20 66 18 67 24C68 28 62 30 62 33"
      stroke="#5eead4"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="62" cy="37" r="1.2" fill="#5eead4" />
    {/* Expressionless Slime Eyes */}
    <line x1="44" y1="70" x2="52" y2="70" stroke="#99f6e4" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="68" y1="70" x2="76" y2="70" stroke="#99f6e4" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

// Rune: Pillar of Empathy (Intertwined Heart & Shield)
export const EmpathyRuneSVG: React.FC<SVGProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 7V17M8.5 10.5H15.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      opacity="0.85"
    />
  </svg>
);

// Rune: Blade of Courage (Crossed Daggers & Crest)
export const CourageBladeSVG: React.FC<SVGProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {/* Blade 1 */}
    <path d="M5 19L19 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M15 5L19 5L19 9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M7 15L9 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="5" cy="19" r="1.5" fill="currentColor" />

    {/* Blade 2 */}
    <path d="M19 19L5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M9 5L5 5L5 9" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M17 15L15 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="19" cy="19" r="1.5" fill="currentColor" />
  </svg>
);

// Dungeon Hearth / Torch
export const DungeonTorchSVG: React.FC<SVGProps> = ({ size = 24, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {/* Sconce bracket */}
    <path d="M10 14H14V21H10V14Z" fill="#2d3139" stroke="#4a505e" strokeWidth="1.5" />
    <path d="M9 14L12 9L15 14H9Z" fill="#1e2128" stroke="#4a505e" strokeWidth="1.5" />
    {/* Flame */}
    <path
      d="M12 2C10 5 8 7 8 9C8 11.2 9.8 13 12 13C14.2 13 16 11.2 16 9C16 7 13.5 4.5 12 2Z"
      fill="#b45309"
      stroke="#f59e0b"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="9.5" r="1.5" fill="#fef08a" />
  </svg>
);

// Iron Shield Crest
export const IronShieldSVG: React.FC<SVGProps> = ({ size = 20, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <path
      d="M10 2L3 5V9.5C3 14 6 17.5 10 18.5C14 17.5 17 14 17 9.5V5L10 2Z"
      fill="#1c202a"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path d="M10 5V15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
    <path d="M6 9H14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
  </svg>
);

// Energy Soul Crystal / Orb
export const EnergyOrbSVG: React.FC<SVGProps> = ({ size = 18, className = '', ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    <polygon
      points="9,1 16,5 16,13 9,17 2,13 2,5"
      fill="#1a1c24"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <polygon points="9,4 13,7 13,11 9,14 5,11 5,7" fill="currentColor" fillOpacity="0.8" />
  </svg>
);
