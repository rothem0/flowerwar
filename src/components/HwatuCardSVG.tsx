import React from 'react';
import { HwatuCard } from '../types/game';

interface Props {
  card: HwatuCard;
  isModified: boolean;
  activeDifferenceIds: string[]; // which differences are active for the current difficulty
  foundDiffIds: string[];
  hintDiffId?: string | null;
  revealedDiffIds?: string[];
  onCardClick?: (svgX: number, svgY: number) => void;
  label: string;
}

export const HwatuCardSVG: React.FC<Props> = ({
  card,
  isModified,
  activeDifferenceIds,
  foundDiffIds,
  hintDiffId,
  revealedDiffIds = [],
  onCardClick,
  label,
}) => {
  const svgRef = React.useRef<SVGSVGElement>(null);

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!onCardClick || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;

    // Convert screen coordinates to SVG viewBox coordinates (0..300, 0..480)
    const scaleX = 300 / rect.width;
    const scaleY = 480 / rect.height;
    const svgX = (clientX - rect.left) * scaleX;
    const svgY = (clientY - rect.top) * scaleY;

    onCardClick(svgX, svgY);
  };

  // Helper to check if a specific diff is modified & active
  const hasDiff = (diffId: string) => {
    return isModified && activeDifferenceIds.includes(diffId);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Label Badge */}
      <div className="mb-2 px-4 py-1 rounded-full text-base sm:text-lg font-bold shadow-sm transition-all duration-300 bg-amber-100 text-amber-950 border-2 border-amber-300">
        {label}
      </div>

      {/* Card Container */}
      <div className="relative group cursor-pointer transition-transform duration-200 active:scale-[0.99] touch-manipulation">
        <svg
          ref={svgRef}
          viewBox="0 0 300 480"
          className="w-[240px] sm:w-[280px] md:w-[320px] lg:w-[350px] aspect-[5/8] rounded-[22px] shadow-2xl select-none"
          onClick={handleClick}
          role="button"
          aria-label={`${label} - ${card.title}`}
          tabIndex={0}
        >
          <defs>
            {/* Card Shadows & Gradients */}
            <filter id="card-shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000000" floodOpacity="0.25" />
            </filter>
            <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFF176" stopOpacity="0.9" />
              <stop offset="70%" stopColor="#FFA000" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FF5722" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="curtain-red" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#B71C1C" />
              <stop offset="50%" stopColor="#E53935" />
              <stop offset="100%" stopColor="#8E0000" />
            </linearGradient>
            <linearGradient id="gold-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFE082" />
              <stop offset="50%" stopColor="#FFB300" />
              <stop offset="100%" stopColor="#FF8F00" />
            </linearGradient>
            <linearGradient id="pine-green" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2E7D32" />
              <stop offset="100%" stopColor="#1B5E20" />
            </linearGradient>
          </defs>

          {/* Card Outer Traditional Red Rim (화투 붉은 테두리) */}
          <rect
            x="3"
            y="3"
            width="294"
            height="474"
            rx="20"
            fill="#A71D2A"
            stroke="#630A14"
            strokeWidth="5"
          />

          {/* Card Inner Canvas / Mat Border */}
          <rect
            x="14"
            y="14"
            width="272"
            height="452"
            rx="12"
            fill="#FAF7EE"
          />

          {/* INNER CARD ARTWORK */}
          <g clipPath="url(#card-clip)">
            <clipPath id="card-clip">
              <rect x="14" y="14" width="272" height="452" rx="12" />
            </clipPath>

            {/* Render Specific Card Artwork */}
            {card.id === 'month-01-songhak' && renderSonghak(hasDiff)}
            {card.id === 'month-08-palgwang' && renderPalgwang(hasDiff)}
            {card.id === 'month-03-sakura' && renderSakura(hasDiff)}
            {card.id === 'month-10-danpung' && renderDanpung(hasDiff)}
            {card.id === 'month-12-bigwang' && renderBigwang(hasDiff)}
            {card.id === 'month-11-odong' && renderOdong(hasDiff)}

            {/* Traditional Gwang "光" Stamp in Golden Badge (화투 광 마크) */}
            <g transform="translate(36, 420)">
              <circle cx="16" cy="16" r="15" fill="#C92A2A" stroke="#FFD700" strokeWidth="2.5" />
              <circle cx="16" cy="16" r="12" fill="#D32F2F" />
              <text
                x="16"
                y="21"
                textAnchor="middle"
                fontSize="14"
                fontWeight="900"
                fill="#FFECB3"
                fontFamily="sans-serif"
              >
                光
              </text>
            </g>
          </g>

          {/* FOUND DIFFERENCE MARKERS */}
          {card.differences.map((diff) => {
            const isFound = foundDiffIds.includes(diff.id);
            const isRevealed = revealedDiffIds.includes(diff.id);
            const isHinted = hintDiffId === diff.id;

            if (isFound || isRevealed) {
              return (
                <g key={diff.id} transform={`translate(${diff.x}, ${diff.y})`}>
                  {/* Outer glowing pulsing ring */}
                  <circle
                    cx="0"
                    cy="0"
                    r={diff.radius + 6}
                    fill="none"
                    stroke="#FFD700"
                    strokeWidth="4"
                    strokeDasharray="6,4"
                    opacity="0.9"
                  />
                  {/* Highlight circle */}
                  <circle
                    cx="0"
                    cy="0"
                    r={diff.radius - 2}
                    fill="#FF1744"
                    fillOpacity="0.18"
                    stroke="#FF1744"
                    strokeWidth="4"
                  />
                  {/* Traditional Korean Plum Blossom Stamp (매화 도장) */}
                  <g transform="translate(-16, -16) scale(0.8)">
                    <circle cx="20" cy="20" r="16" fill="#D50000" stroke="#FFF" strokeWidth="2" />
                    <text
                      x="20"
                      y="26"
                      textAnchor="middle"
                      fill="#FFF"
                      fontSize="18"
                      fontWeight="bold"
                    >
                      ✓
                    </text>
                  </g>
                </g>
              );
            }

            if (isHinted) {
              return (
                <g key={`hint-${diff.id}`} transform={`translate(${diff.x}, ${diff.y})`}>
                  {/* Animated pulsating Hint target */}
                  <circle
                    cx="0"
                    cy="0"
                    r={diff.radius + 8}
                    fill="#FFD54F"
                    fillOpacity="0.25"
                    stroke="#FF8F00"
                    strokeWidth="5"
                    strokeDasharray="8 4"
                    className="animate-gentle-pulse"
                  />
                  <circle
                    cx="0"
                    cy="0"
                    r="8"
                    fill="#FF6F00"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                  />
                </g>
              );
            }

            return null;
          })}
        </svg>

        {/* Floating guide message for seniors */}
        <div className="mt-2 text-center text-stone-600 font-semibold text-sm">
          화투패의 다른 곳을 손가락이나 마우스로 눌러보세요
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 1. 송학 (1월) - 소나무, 붉은 태양, 학
// -------------------------------------------------------------
function renderSonghak(hasDiff: (id: string) => boolean) {
  const isSunDiff = hasDiff('diff-01-sun');
  const isCrownDiff = hasDiff('diff-01-crown');
  const isPineDiff = hasDiff('diff-01-pine');

  return (
    <g>
      {/* Background Soft Sky */}
      <rect x="14" y="14" width="272" height="452" fill="#FCF9EE" />

      {/* Red Sun in upper center */}
      {isSunDiff ? (
        <g>
          {/* Enhanced Glowing Sun with Golden Halo Rays */}
          <circle cx="150" cy="110" r="62" fill="url(#sun-glow)" />
          <circle cx="150" cy="110" r="54" fill="#E53935" stroke="#FFD54F" strokeWidth="4" />
          {/* Golden sunbeams */}
          {[-45, -15, 15, 45, 75, 105, 135, 165, 195, 225].map((angle, i) => (
            <line
              key={i}
              x1={150 + 58 * Math.cos((angle * Math.PI) / 180)}
              y1={110 + 58 * Math.sin((angle * Math.PI) / 180)}
              x2={150 + 68 * Math.cos((angle * Math.PI) / 180)}
              y2={110 + 68 * Math.sin((angle * Math.PI) / 180)}
              stroke="#FFA000"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          ))}
        </g>
      ) : (
        <circle cx="150" cy="110" r="48" fill="#D32F2F" />
      )}

      {/* Black Mount Hill at bottom */}
      <path
        d="M 14 360 Q 90 320, 160 365 T 286 350 L 286 466 L 14 466 Z"
        fill="#1C1917"
      />

      {/* Pine Tree Trunk (소나무 둥치) */}
      <path
        d="M 286 440 C 250 400, 240 330, 210 270 C 195 240, 185 200, 190 160 L 205 162 C 198 200, 212 235, 228 265 C 255 315, 268 375, 286 420 Z"
        fill="#3E2723"
        stroke="#1A0D00"
        strokeWidth="2"
      />

      {/* Pine Needles (솔잎 부채꼴) Left Branch */}
      <g transform="translate(190, 160)">
        <ellipse cx="-15" cy="-8" rx="28" ry="16" fill="url(#pine-green)" />
        <ellipse cx="-20" cy="12" rx="24" ry="14" fill="#1B5E20" />
      </g>
      <g transform="translate(180, 220)">
        <ellipse cx="-25" cy="0" rx="32" ry="18" fill="url(#pine-green)" />
      </g>

      {/* Pine Needles Right Branch (Difference Zone) */}
      <g transform="translate(235, 300)">
        <ellipse cx="0" cy="0" rx="30" ry="16" fill="url(#pine-green)" />
        <ellipse cx="20" cy="15" rx="25" ry="14" fill="#2E7D32" />
        {isPineDiff ? (
          // Extra vibrant golden-tipped pine clusters!
          <>
            <ellipse cx="-15" cy="18" rx="28" ry="15" fill="#388E3C" stroke="#FFD54F" strokeWidth="2.5" />
            <ellipse cx="10" cy="-18" rx="22" ry="12" fill="#4CAF50" stroke="#FFD54F" strokeWidth="2" />
            <circle cx="5" cy="2" r="6" fill="#FFC107" />
          </>
        ) : null}
      </g>

      {/* The Crane (학 / 두루미) standing gracefully */}
      <g id="crane">
        {/* Crane Legs */}
        <line x1="145" y1="355" x2="140" y2="445" stroke="#1C1917" strokeWidth="4.5" strokeLinecap="round" />
        <line x1="160" y1="355" x2="165" y2="440" stroke="#1C1917" strokeWidth="4.5" strokeLinecap="round" />
        {/* Foot claws */}
        <line x1="140" y1="445" x2="128" y2="452" stroke="#1C1917" strokeWidth="3.5" />
        <line x1="165" y1="440" x2="178" y2="448" stroke="#1C1917" strokeWidth="3.5" />

        {/* Crane Body (Pure White Plumes) */}
        <path
          d="M 120 310 C 120 270, 145 260, 165 270 C 185 280, 190 320, 175 350 C 160 370, 130 365, 120 310 Z"
          fill="#FFFFFF"
          stroke="#424242"
          strokeWidth="3"
        />

        {/* Black Wing Tips (학의 검은 날개 깃털) */}
        <path
          d="M 140 330 C 150 330, 185 325, 195 345 C 185 365, 155 365, 140 330 Z"
          fill="#111827"
        />

        {/* Crane Neck */}
        <path
          d="M 142 275 C 138 250, 145 230, 152 215 L 160 217 C 152 235, 148 255, 150 275 Z"
          fill="#FFFFFF"
          stroke="#424242"
          strokeWidth="2"
        />
        {/* Black stripe along neck */}
        <path
          d="M 142 265 C 141 250, 146 235, 151 222 L 155 224 C 150 236, 146 250, 147 265 Z"
          fill="#1C1917"
        />

        {/* Crane Head */}
        <ellipse cx="155" cy="214" rx="10" ry="8" fill="#FFFFFF" stroke="#424242" strokeWidth="2" />
        {/* Eye */}
        <circle cx="157" cy="213" r="2" fill="#1C1917" />
        {/* Beak */}
        <polygon points="164,213 182,216 164,219" fill="#FBC02D" stroke="#E65100" strokeWidth="1" />

        {/* Red Crown on Head (Difference Zone) */}
        {isCrownDiff ? (
          // Bright golden-jeweled crown
          <g>
            <ellipse cx="155" cy="207" rx="8" ry="6" fill="#FFB300" stroke="#FF6F00" strokeWidth="2" />
            <circle cx="155" cy="205" r="3" fill="#D50000" />
            <polygon points="152,201 155,195 158,201" fill="#FFD54F" />
          </g>
        ) : (
          <ellipse cx="155" cy="207" rx="6" ry="4" fill="#D50000" />
        )}
      </g>
    </g>
  );
}

// -------------------------------------------------------------
// 2. 팔광 (8월) - 붉은 하늘, 보름달, 기러기, 민둥산
// -------------------------------------------------------------
function renderPalgwang(hasDiff: (id: string) => boolean) {
  const isGeeseDiff = hasDiff('diff-08-geese');
  const isRabbitDiff = hasDiff('diff-08-rabbit');
  const isReedsDiff = hasDiff('diff-08-reeds');

  return (
    <g>
      {/* Saturated Deep Crimson Red Sky (팔광 특유의 붉은 하늘) */}
      <rect x="14" y="14" width="272" height="452" fill="#C62828" />

      {/* Golden Glowing Giant Moon */}
      <circle cx="150" cy="115" r="64" fill="#FFFDE7" stroke="#FFE082" strokeWidth="3" />

      {/* Moon Rabbit difference (옥토끼) */}
      {isRabbitDiff ? (
        <g transform="translate(136, 92) scale(0.9)">
          {/* Jade Rabbit Silhouette pounding rice cake (옥토끼 실루엣) */}
          <ellipse cx="14" cy="22" rx="10" ry="14" fill="#B71C1C" opacity="0.65" />
          <circle cx="14" cy="10" r="7" fill="#B71C1C" opacity="0.65" />
          {/* Rabbit Ears */}
          <ellipse cx="10" cy="0" rx="3" ry="8" transform="rotate(-15 10 0)" fill="#B71C1C" opacity="0.65" />
          <ellipse cx="17" cy="1" rx="3" ry="8" transform="rotate(10 17 1)" fill="#B71C1C" opacity="0.65" />
          {/* Mortar & pestle */}
          <path d="M 26 22 L 36 22 L 34 32 L 28 32 Z" fill="#B71C1C" opacity="0.65" />
          <line x1="22" y1="12" x2="32" y2="24" stroke="#B71C1C" strokeWidth="3" opacity="0.65" />
        </g>
      ) : (
        // Gentle soft moon shading
        <circle cx="170" cy="130" r="25" fill="#FFF9C4" opacity="0.5" />
      )}

      {/* Flying Geese Formation */}
      <g>
        {/* Goose 1 */}
        <path d="M 60 110 Q 72 104 80 112 Q 88 104 100 110" fill="none" stroke="#111827" strokeWidth="4.5" strokeLinecap="round" />
        {/* Goose 2 */}
        <path d="M 75 135 Q 87 129 95 137 Q 103 129 115 135" fill="none" stroke="#111827" strokeWidth="4.5" strokeLinecap="round" />
        {/* Goose 3 */}
        <path d="M 90 160 Q 102 154 110 162 Q 118 154 130 160" fill="none" stroke="#111827" strokeWidth="4.5" strokeLinecap="round" />

        {/* 4th baby goose difference! */}
        {isGeeseDiff && (
          <g>
            <path d="M 45 140 Q 53 135 60 142 Q 67 135 75 140" fill="none" stroke="#FFD54F" strokeWidth="5" strokeLinecap="round" />
            <path d="M 45 140 Q 53 135 60 142 Q 67 135 75 140" fill="none" stroke="#111827" strokeWidth="3.5" strokeLinecap="round" />
          </g>
        )}
      </g>

      {/* Bald Jet-Black Mountain Hill (공산 민둥산) */}
      <path
        d="M 14 260 Q 150 180, 286 260 L 286 466 L 14 466 Z"
        fill="#111827"
      />

      {/* Mountain Reeds difference */}
      {isReedsDiff ? (
        <g transform="translate(230, 310)">
          {/* Silver/Gold Tall Reeds */}
          <line x1="0" y1="40" x2="-8" y2="0" stroke="#FFE082" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="-10" cy="-2" rx="4" ry="12" fill="#FFD54F" transform="rotate(-15 -10 -2)" />

          <line x1="12" y1="45" x2="6" y2="-10" stroke="#FFE082" strokeWidth="3.5" strokeLinecap="round" />
          <ellipse cx="6" cy="-12" rx="5" ry="14" fill="#FFF176" transform="rotate(5 6 -12)" />

          <line x1="24" y1="42" x2="28" y2="5" stroke="#FFE082" strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="29" cy="4" rx="4" ry="10" fill="#FFD54F" transform="rotate(20 29 4)" />
        </g>
      ) : null}
    </g>
  );
}

// -------------------------------------------------------------
// 3. 벚꽃 (3월) - 만개한 벚꽃과 장막
// -------------------------------------------------------------
function renderSakura(hasDiff: (id: string) => boolean) {
  const isKnotDiff = hasDiff('diff-03-curtain-knot');
  const isTopFlowerDiff = hasDiff('diff-03-top-flower');
  const isStripeDiff = hasDiff('diff-03-stripe');

  return (
    <g>
      {/* Background Soft Pink Tint */}
      <rect x="14" y="14" width="272" height="452" fill="#FFF5F5" />

      {/* Sky Blue top corner */}
      <path d="M 14 14 L 140 14 L 14 100 Z" fill="#E3F2FD" />

      {/* Brown Cherry Tree Branches */}
      <path
        d="M 286 60 Q 200 70, 160 120 T 14 150"
        fill="none"
        stroke="#4E342E"
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M 210 80 Q 190 40, 150 30"
        fill="none"
        stroke="#4E342E"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Cherry Blossom Flowers on Branches */}
      <g>
        {/* Flower Left */}
        <circle cx="80" cy="135" r="14" fill="#FF80AB" />
        <circle cx="80" cy="135" r="5" fill="#D81B60" />

        {/* Flower Mid */}
        <circle cx="160" cy="115" r="16" fill="#FF4081" />
        <circle cx="160" cy="115" r="6" fill="#880E4F" />

        {/* Flower Right */}
        <circle cx="230" cy="95" r="15" fill="#FF80AB" />
        <circle cx="230" cy="95" r="5" fill="#C2185B" />

        {/* Top Flower Difference */}
        {isTopFlowerDiff ? (
          <g transform="translate(242, 85)">
            <circle cx="0" cy="0" r="18" fill="#FFD54F" stroke="#FF6F00" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="8" fill="#D50000" />
            {[0, 72, 144, 216, 288].map((deg) => (
              <circle
                key={deg}
                cx={14 * Math.cos((deg * Math.PI) / 180)}
                cy={14 * Math.sin((deg * Math.PI) / 180)}
                r="7"
                fill="#FFA000"
              />
            ))}
          </g>
        ) : null}
      </g>

      {/* Traditional Festival Curtain (장막 / 만막) */}
      <g>
        {/* Top hanging rope */}
        <line x1="14" y1="180" x2="286" y2="180" stroke="#212121" strokeWidth="4" />

        {/* Curtain folds (Red, Purple, Black, White panels) */}
        <path
          d="M 14 180 C 60 190, 80 250, 60 380 L 14 400 Z"
          fill="url(#curtain-red)"
        />
        <path
          d="M 60 180 C 110 200, 130 270, 110 420 L 60 380 Z"
          fill="#4A148C"
        />
        <path
          d="M 110 180 C 160 210, 180 270, 160 410 L 110 420 Z"
          fill="#E53935"
        />
        <path
          d="M 160 180 C 210 200, 240 270, 220 390 L 160 410 Z"
          fill="#1C1917"
        />
        <path
          d="M 220 180 C 260 190, 286 230, 286 360 L 220 390 Z"
          fill="#FAF7EE"
        />

        {/* Lower Curtain Stripes / Wave Difference */}
        {isStripeDiff && (
          <g transform="translate(95, 360)">
            <path
              d="M -30 0 Q 0 -15, 30 0 T 90 0"
              fill="none"
              stroke="#FFD54F"
              strokeWidth="5"
            />
            <path
              d="M -30 12 Q 0 -3, 30 12 T 90 12"
              fill="none"
              stroke="#FFA000"
              strokeWidth="3.5"
            />
          </g>
        )}

        {/* Center Curtain Knot (Difference Zone) */}
        {isKnotDiff ? (
          <g transform="translate(150, 260)">
            {/* Golden Chrysanthemum Rosette Knot */}
            <circle cx="0" cy="0" r="20" fill="url(#gold-grad)" stroke="#E65100" strokeWidth="3" />
            <circle cx="0" cy="0" r="9" fill="#B71C1C" />
            {/* Golden flowing ribbon tails */}
            <path d="M -8 18 Q -16 38, -22 55" stroke="#FFA000" strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M 8 18 Q 16 38, 22 55" stroke="#FFA000" strokeWidth="6" fill="none" strokeLinecap="round" />
          </g>
        ) : (
          <g transform="translate(150, 260)">
            {/* Traditional Violet Ribbon Knot */}
            <circle cx="0" cy="0" r="14" fill="#311B92" stroke="#FFFFFF" strokeWidth="2" />
            <path d="M -6 12 Q -12 28, -16 42" stroke="#311B92" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M 6 12 Q 12 28, 16 42" stroke="#311B92" strokeWidth="5" fill="none" strokeLinecap="round" />
          </g>
        )}
      </g>
    </g>
  );
}

// -------------------------------------------------------------
// 4. 단풍과 사슴 (10월) - 사슴과 붉은 단풍
// -------------------------------------------------------------
function renderDanpung(hasDiff: (id: string) => boolean) {
  const isAntlerDiff = hasDiff('diff-10-antlers');
  const isLeafDiff = hasDiff('diff-10-ginkgo-leaf');
  const isSpotsDiff = hasDiff('diff-10-spots');

  return (
    <g>
      {/* Background Autumn Cream */}
      <rect x="14" y="14" width="272" height="452" fill="#FFF8E1" />

      {/* Autumn Blue Ridge at bottom */}
      <path d="M 14 380 Q 120 340, 286 380 L 286 466 L 14 466 Z" fill="#1565C0" />

      {/* Maple Leaves Cascading */}
      <g>
        {/* Leaf top-left */}
        <polygon points="50,45 65,30 65,48 85,55 65,65 70,85 50,70 30,85 35,65 15,55 35,48 35,30" fill="#D32F2F" />
        {/* Leaf mid-left */}
        <polygon points="90,110 105,95 105,113 125,120 105,130 110,150 90,135 70,150 75,130 55,120 75,113 75,95" fill="#C2185B" />

        {/* Leaf top-right (Difference Zone) */}
        {isLeafDiff ? (
          // Bright Golden Leaf!
          <polygon
            points="230,110 245,95 245,113 265,120 245,130 250,150 230,135 210,150 215,130 195,120 215,113 215,95"
            fill="#FFB300"
            stroke="#E65100"
            strokeWidth="2.5"
          />
        ) : (
          <polygon
            points="230,110 245,95 245,113 265,120 245,130 250,150 230,135 210,150 215,130 195,120 215,113 215,95"
            fill="#D32F2F"
          />
        )}
      </g>

      {/* Deer (사슴) looking backwards */}
      <g id="deer">
        {/* Deer Legs */}
        <line x1="150" y1="380" x2="145" y2="445" stroke="#5D4037" strokeWidth="5" strokeLinecap="round" />
        <line x1="165" y1="380" x2="168" y2="440" stroke="#5D4037" strokeWidth="5" strokeLinecap="round" />
        <line x1="195" y1="375" x2="198" y2="445" stroke="#5D4037" strokeWidth="5" strokeLinecap="round" />
        <line x1="215" y1="370" x2="220" y2="440" stroke="#5D4037" strokeWidth="5" strokeLinecap="round" />

        {/* Deer Body */}
        <ellipse cx="185" cy="355" rx="42" ry="32" fill="#8D6E63" stroke="#4E342E" strokeWidth="2.5" />

        {/* White Spots on Deer (Difference Zone) */}
        {isSpotsDiff ? (
          <g>
            <circle cx="165" cy="345" r="4.5" fill="#FFFFFF" stroke="#FFE082" strokeWidth="1.5" />
            <circle cx="180" cy="340" r="4.5" fill="#FFFFFF" stroke="#FFE082" strokeWidth="1.5" />
            <circle cx="195" cy="348" r="4.5" fill="#FFFFFF" stroke="#FFE082" strokeWidth="1.5" />
            <circle cx="172" cy="360" r="4" fill="#FFFFFF" stroke="#FFE082" strokeWidth="1.5" />
            <circle cx="188" cy="362" r="4" fill="#FFFFFF" stroke="#FFE082" strokeWidth="1.5" />
            <circle cx="205" cy="358" r="4" fill="#FFFFFF" stroke="#FFE082" strokeWidth="1.5" />
          </g>
        ) : (
          <g>
            <circle cx="170" cy="345" r="3.5" fill="#FFFFFF" />
            <circle cx="185" cy="342" r="3.5" fill="#FFFFFF" />
            <circle cx="200" cy="350" r="3.5" fill="#FFFFFF" />
          </g>
        )}

        {/* Deer Neck and Head (turning back gracefully) */}
        <path d="M 155 345 C 145 320, 135 285, 142 260 L 158 262 C 154 285, 162 315, 170 340 Z" fill="#8D6E63" />
        <ellipse cx="140" cy="255" rx="14" ry="10" fill="#8D6E63" stroke="#4E342E" strokeWidth="2" />
        {/* Deer Ear */}
        <ellipse cx="152" cy="245" rx="5" ry="10" fill="#A1887F" transform="rotate(25 152 245)" />
        {/* Deer Eye & Muzzle */}
        <circle cx="135" cy="254" r="2.5" fill="#212121" />
        <ellipse cx="127" cy="258" rx="4" ry="3" fill="#3E2723" />

        {/* Antlers (Difference Zone) */}
        {isAntlerDiff ? (
          // Magnificent Golden Multi-Tine Antlers!
          <g stroke="#FFB300" strokeWidth="4.5" strokeLinecap="round">
            {/* Main beam */}
            <path d="M 144 246 Q 138 220, 130 200" fill="none" />
            {/* Tines */}
            <line x1="140" y1="232" x2="120" y2="225" />
            <line x1="135" y1="216" x2="116" y2="204" />
            <line x1="130" y1="200" x2="124" y2="185" />
            <line x1="130" y1="200" x2="142" y2="190" />
          </g>
        ) : (
          // Standard Antlers
          <g stroke="#4E342E" strokeWidth="3.5" strokeLinecap="round">
            <path d="M 144 246 Q 140 230, 135 215" fill="none" />
            <line x1="141" y1="235" x2="128" y2="228" />
            <line x1="135" y1="215" x2="126" y2="205" />
          </g>
        )}
      </g>
    </g>
  );
}

// -------------------------------------------------------------
// 5. 비광 (12월) - 우산 쓴 선비와 개구리
// -------------------------------------------------------------
function renderBigwang(hasDiff: (id: string) => boolean) {
  const isFrogDiff = hasDiff('diff-12-frog');
  const isUmbrellaDiff = hasDiff('diff-12-umbrella');
  const isWillowDiff = hasDiff('diff-12-willow');

  return (
    <g>
      {/* Background Soft Pale Mint Grey */}
      <rect x="14" y="14" width="272" height="452" fill="#ECEFF1" />

      {/* Stream Bank (냇가 언덕) */}
      <path d="M 14 390 Q 100 370, 150 420 T 286 430 L 286 466 L 14 466 Z" fill="#37474F" />
      <path d="M 14 420 Q 90 400, 180 440 L 14 466 Z" fill="#00838F" />

      {/* Rain Streaks falling down */}
      {[
        [40, 40, 20, 90],
        [80, 20, 60, 70],
        [120, 50, 100, 110],
        [200, 30, 180, 80],
        [250, 60, 230, 120],
        [50, 200, 30, 260],
      ].map(([x1, y1, x2, y2], i) => (
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#90A4AE"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="15 8"
        />
      ))}

      {/* Weeping Willow Tree (수양버들) */}
      <g>
        <path d="M 286 30 Q 230 40, 210 100 T 240 220" fill="none" stroke="#2E7D32" strokeWidth="6" strokeLinecap="round" />
        <path d="M 250 50 Q 190 90, 190 170" fill="none" stroke="#388E3C" strokeWidth="4" />

        {/* Willow tips difference */}
        {isWillowDiff ? (
          <g transform="translate(240, 120)">
            <ellipse cx="0" cy="0" rx="8" ry="16" fill="#FFD54F" stroke="#E65100" strokeWidth="2" />
            <ellipse cx="14" cy="18" rx="7" ry="14" fill="#FFF176" stroke="#F57F17" strokeWidth="2" />
          </g>
        ) : (
          <g transform="translate(240, 120)">
            <ellipse cx="0" cy="0" rx="6" ry="14" fill="#4CAF50" />
          </g>
        )}
      </g>

      {/* The Scholar with Umbrella (우산 쓴 선비) */}
      <g id="scholar">
        {/* Robe and Body */}
        <path d="M 155 240 L 195 240 L 210 370 L 145 370 Z" fill="#212121" />
        {/* Red Belt / Sash */}
        <rect x="150" y="290" width="55" height="12" fill="#D32F2F" />
        {/* Legs / Geta clogs */}
        <line x1="165" y1="370" x2="165" y2="400" stroke="#FFF" strokeWidth="5" />
        <line x1="190" y1="370" x2="190" y2="400" stroke="#FFF" strokeWidth="5" />
        <rect x="158" y="398" width="16" height="8" fill="#5D4037" />
        <rect x="183" y="398" width="16" height="8" fill="#5D4037" />

        {/* Big Traditional Umbrella */}
        <path
          d="M 115 210 Q 175 140, 235 210 Z"
          fill="#D32F2F"
          stroke="#B71C1C"
          strokeWidth="3"
        />
        <line x1="175" y1="175" x2="175" y2="280" stroke="#4E342E" strokeWidth="4.5" />

        {/* Umbrella Cap difference */}
        {isUmbrellaDiff ? (
          <g transform="translate(175, 175)">
            <circle cx="0" cy="-6" r="9" fill="#FFD54F" stroke="#FF6F00" strokeWidth="2.5" />
            <line x1="0" y1="0" x2="0" y2="14" stroke="#D50000" strokeWidth="4" />
          </g>
        ) : (
          <circle cx="175" cy="172" r="5" fill="#3E2723" />
        )}
      </g>

      {/* The Frog (개구리) at bottom stream */}
      <g transform="translate(85, 385)">
        {/* Frog body */}
        <ellipse cx="0" cy="0" rx="14" ry="10" fill="#43A047" stroke="#1B5E20" strokeWidth="1.5" />
        {/* Frog eyes */}
        <circle cx="-6" cy="-8" r="4.5" fill="#FFF" />
        <circle cx="-6" cy="-8" r="2" fill="#000" />
        <circle cx="6" cy="-8" r="4.5" fill="#FFF" />
        <circle cx="6" cy="-8" r="2" fill="#000" />
        {/* Frog legs */}
        <path d="M -12 2 Q -22 8, -16 16" fill="none" stroke="#2E7D32" strokeWidth="3" />
        <path d="M 12 2 Q 22 8, 16 16" fill="none" stroke="#2E7D32" strokeWidth="3" />

        {/* Frog holding Lotus Leaf difference */}
        {isFrogDiff && (
          <g transform="translate(12, -18)">
            <line x1="-4" y1="14" x2="6" y2="-2" stroke="#2E7D32" strokeWidth="2.5" />
            <ellipse cx="8" cy="-6" rx="14" ry="8" fill="#00E676" stroke="#1B5E20" strokeWidth="2" />
            <circle cx="8" cy="-6" r="2" fill="#FFF" />
          </g>
        )}
      </g>
    </g>
  );
}

// -------------------------------------------------------------
// 6. 오동 / 똥광 (11월) - 거대한 오동잎과 신비한 봉황
// -------------------------------------------------------------
function renderOdong(hasDiff: (id: string) => boolean) {
  const isCrestDiff = hasDiff('diff-11-crest');
  const isSeedsDiff = hasDiff('diff-11-seeds');
  const isTailDiff = hasDiff('diff-11-tail');

  return (
    <g>
      {/* Background Pure White Hanji */}
      <rect x="14" y="14" width="272" height="452" fill="#FAFAFA" />

      {/* Top Red Sun */}
      <circle cx="150" cy="70" r="38" fill="#D32F2F" />

      {/* Giant Black/Midnight Paulownia Leaf (오동잎) */}
      <path
        d="M 150 180 C 70 200, 30 320, 90 420 C 130 450, 170 450, 210 420 C 270 320, 230 200, 150 180 Z"
        fill="#1A237E"
      />
      <path
        d="M 150 180 C 100 220, 60 310, 110 390 C 140 420, 160 420, 190 390 C 240 310, 200 220, 150 180 Z"
        fill="#0D47A1"
      />

      {/* Paulownia Seeds / Blossoms (오동 열매) */}
      <g transform="translate(220, 260)">
        <circle cx="-10" cy="0" r="8" fill="#FBC02D" stroke="#F57F17" strokeWidth="2" />
        <circle cx="10" cy="0" r="8" fill="#FBC02D" stroke="#F57F17" strokeWidth="2" />
        <circle cx="0" cy="-14" r="8" fill="#FBC02D" stroke="#F57F17" strokeWidth="2" />

        {/* Extra Golden Blossom Seeds difference */}
        {isSeedsDiff && (
          <g>
            <circle cx="-16" cy="-18" r="7" fill="#FFD54F" stroke="#E65100" strokeWidth="2" />
            <circle cx="16" cy="-18" r="7" fill="#FFD54F" stroke="#E65100" strokeWidth="2" />
          </g>
        )}
      </g>

      {/* Phoenix (봉황) Standing majestically */}
      <g id="phoenix">
        {/* Phoenix Body */}
        <ellipse cx="150" cy="170" rx="20" ry="28" fill="#FFD600" stroke="#FF6F00" strokeWidth="2" />

        {/* Phoenix Head and Beak */}
        <circle cx="150" cy="125" r="14" fill="#FFAB00" stroke="#E65100" strokeWidth="2" />
        <polygon points="158,122 178,126 158,130" fill="#D50000" />
        <circle cx="154" cy="122" r="2.5" fill="#000" />

        {/* Phoenix Head Crest (Difference Zone) */}
        {isCrestDiff ? (
          // Radiant Triple Crown Plumage
          <g transform="translate(150, 115)">
            <path d="M -8 -4 Q -16 -22, -22 -30" stroke="#FF1744" strokeWidth="4.5" fill="none" strokeLinecap="round" />
            <path d="M 0 -8 Q 0 -28, 0 -38" stroke="#FFD600" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M 8 -4 Q 16 -22, 22 -30" stroke="#00E676" strokeWidth="4.5" fill="none" strokeLinecap="round" />
            <circle cx="0" cy="-38" r="4" fill="#FF1744" />
          </g>
        ) : (
          <g transform="translate(150, 115)">
            <path d="M 0 -4 Q -2 -18, -4 -25" stroke="#D50000" strokeWidth="4" fill="none" strokeLinecap="round" />
          </g>
        )}

        {/* Long Phoenix Tail Feathers (Difference Zone) */}
        {isTailDiff ? (
          <g transform="translate(85, 330)">
            {/* Glowing Ruby Curled Tail */}
            <path d="M 50 -100 Q 10 -40, -10 10 Q -20 40, -5 60" fill="none" stroke="#FF1744" strokeWidth="7" strokeLinecap="round" />
            <circle cx="-5" cy="60" r="8" fill="#FFD700" stroke="#D50000" strokeWidth="2" />
          </g>
        ) : (
          <g transform="translate(85, 330)">
            <path d="M 50 -100 Q 20 -40, 10 10 Q 0 40, 10 50" fill="none" stroke="#2E7D32" strokeWidth="5" strokeLinecap="round" />
          </g>
        )}
      </g>
    </g>
  );
}
