/*
  Survey illustrations — one scene per page/question, drawn as SVG in the site palette.
  Canvas: 320 × 240. Key content sits inside the band y ≈ 60–180 so the phone banner
  (which crops to a wide strip with preserveAspectRatio="slice") never cuts it off.
  Colours come from CSS variables, so the set follows the design tokens.
*/
import type { ReactNode } from "react";

const C = {
  ink: "var(--fg)",
  pink: "var(--primary)",
  pinkDeep: "var(--primary-strong)",
  pinkSoft: "var(--secondary)",
  blush: "#fce7f3",
  lav: "var(--accent)",
  lavSoft: "var(--accent-soft)",
  white: "var(--card)",
};
const S = { stroke: C.ink, strokeWidth: 2.5, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

/** Tibeb diamond sparkle (the site's recurring motif). */
function Diamond({ x, y, r = 6, fill = C.lav, float = false }: { x: number; y: number; r?: number; fill?: string; float?: boolean }) {
  return (
    <path
      className={float ? "il-float" : undefined}
      d={`M${x} ${y - r} L${x + r} ${y} L${x} ${y + r} L${x - r} ${y} Z`}
      fill={fill}
    />
  );
}

function Backdrop({ children }: { children?: ReactNode }) {
  return (
    <>
      <circle cx="226" cy="112" r="86" fill={C.lavSoft} />
      <circle cx="96" cy="136" r="62" fill={C.blush} />
      <ellipse cx="160" cy="184" rx="118" ry="8" fill={C.ink} opacity="0.08" />
      <Diamond x={44} y={78} r={5} fill={C.pinkSoft} float />
      <Diamond x={286} y={62} r={6} fill={C.lav} float />
      <Diamond x={272} y={176} r={4} fill={C.pink} float />
      {children}
    </>
  );
}

/* ---------- small reusable objects ---------- */

function PumpBottle({ x, y, h = 92, fill = C.pink }: { x: number; y: number; h?: number; fill?: string }) {
  // x,y = bottom-left of body
  return (
    <g>
      <rect x={x + 12} y={y - h - 26} width="16" height="10" rx="2" fill={C.white} {...S} />
      <path d={`M${x + 20} ${y - h - 26} v-8 h18`} fill="none" {...S} />
      <rect x={x + 8} y={y - h - 16} width="24" height="16" rx="3" fill={C.white} {...S} />
      <rect x={x} y={y - h} width="40" height={h} rx="10" fill={fill} {...S} />
      <rect x={x + 8} y={y - h * 0.62} width="24" height={h * 0.34} rx="4" fill={C.white} opacity="0.9" />
    </g>
  );
}

function Jar({ x, y, w = 58, fill = C.lav }: { x: number; y: number; w?: number; fill?: string }) {
  return (
    <g>
      <rect x={x - 2} y={y - 54} width={w + 4} height="14" rx="5" fill={C.white} {...S} />
      <rect x={x} y={y - 42} width={w} height="42" rx="12" fill={fill} {...S} />
      <path d={`M${x + 12} ${y - 22} h${w - 24}`} {...S} stroke={C.white} strokeWidth="4" />
    </g>
  );
}

function Dropper({ x, y, fill = C.pinkSoft }: { x: number; y: number; fill?: string }) {
  return (
    <g>
      <path d={`M${x + 12} ${y - 82} q0 -14 8 -14 q8 0 8 14 z`} fill={C.lav} {...S} />
      <rect x={x + 8} y={y - 82} width="24" height="14" rx="3" fill={C.white} {...S} />
      <rect x={x} y={y - 68} width="40" height="68" rx="12" fill={fill} {...S} />
      <circle cx={x + 20} cy={y - 32} r="9" fill={C.white} opacity="0.9" />
    </g>
  );
}

function Leaf({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) {
  const s = flip ? -1 : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${s} 1)`}>
      <path d="M0 0 C 6 -30, 30 -44, 44 -46 C 42 -28, 26 -6, 0 0 Z" fill={C.pinkSoft} {...S} />
      <path d="M0 0 C 14 -16, 26 -28, 40 -42" fill="none" {...S} strokeWidth={1.8} />
    </g>
  );
}

function Check({ x, y, size = 10, color = C.pinkDeep }: { x: number; y: number; size?: number; color?: string }) {
  return <path d={`M${x} ${y} l${size * 0.4} ${size * 0.4} l${size * 0.8} -${size * 0.9}`} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />;
}

/* ---------- scenes ---------- */

const scenes: Record<string, ReactNode> = {
  welcome: (
    <Backdrop>
      {/* clipboard with checklist */}
      <rect x="54" y="62" width="92" height="118" rx="10" fill={C.white} {...S} />
      <rect x="80" y="54" width="40" height="16" rx="5" fill={C.pink} {...S} />
      {[90, 116, 142].map((y, i) => (
        <g key={y}>
          <rect x="68" y={y} width="14" height="14" rx="3" fill={i < 2 ? C.lavSoft : C.white} {...S} strokeWidth={2} />
          {i < 2 && <Check x={70} y={y + 7} size={10} />}
          <path d={`M90 ${y + 7} h${i === 1 ? 34 : 44}`} {...S} strokeWidth={2.5} opacity="0.55" />
        </g>
      ))}
      <PumpBottle x={168} y={180} h={86} fill={C.pink} />
      <Jar x={214} y={180} w={56} fill={C.lav} />
      <Dropper x={252} y={180} />
      <Leaf x={160} y={180} flip />
    </Backdrop>
  ),

  q1_age: (
    <Backdrop>
      {/* calendar */}
      <rect x="70" y="62" width="130" height="112" rx="12" fill={C.white} {...S} />
      <path d="M70 92 h130" {...S} />
      <path d="M70 74 a12 12 0 0 1 12 -12 h106 a12 12 0 0 1 12 12 v18 h-130 z" fill={C.pink} {...S} />
      <path d="M98 54 v16 M172 54 v16" {...S} strokeWidth={4} />
      {[0, 1, 2, 3, 4].map((c) =>
        [0, 1, 2].map((r) => {
          const cx = 90 + c * 22;
          const cy = 112 + r * 22;
          const hl = c === 2 && r === 1;
          return hl ? (
            <circle key={`${c}${r}`} cx={cx} cy={cy} r="10" fill={C.lav} {...S} strokeWidth={2} />
          ) : (
            <circle key={`${c}${r}`} cx={cx} cy={cy} r="3.5" fill={C.ink} opacity="0.35" />
          );
        }),
      )}
      {/* hourglass */}
      <g transform="translate(222 82)">
        <path d="M0 0 h44 M0 92 h44" {...S} strokeWidth={4} />
        <path d="M6 0 C 6 30, 38 34, 38 46 C 38 58, 6 62, 6 92 M38 0 C 38 30, 6 34, 6 46 C 6 58, 38 62, 38 92" fill={C.white} {...S} />
        <path d="M12 18 C 18 32, 26 32, 32 18 Z" fill={C.pinkSoft} />
        <path d="M10 88 C 14 70, 30 70, 34 88 Z" fill={C.pink} />
      </g>
    </Backdrop>
  ),

  q2_interest: (
    <Backdrop>
      <path
        d="M160 176 C 98 138, 70 112, 70 86 C 70 64, 88 52, 106 52 C 124 52, 138 62, 160 82 C 182 62, 196 52, 214 52 C 232 52, 250 64, 250 86 C 250 112, 222 138, 160 176 Z"
        fill={C.pinkSoft}
        {...S}
      />
      <PumpBottle x={140} y={170} h={76} fill={C.pink} />
      <Diamond x={98} y={88} r={7} fill={C.white} float />
      <Diamond x={226} y={96} r={5} fill={C.white} float />
      <Leaf x={196} y={172} />
    </Backdrop>
  ),

  q3_difficulty_freq: (
    <Backdrop>
      <PumpBottle x={90} y={180} h={80} fill={C.pink} />
      <Jar x={190} y={180} w={60} fill={C.lav} />
      {/* thought bubble with question mark */}
      <circle cx="160" cy="84" r="34" fill={C.white} {...S} />
      <circle cx="140" cy="128" r="6" fill={C.white} {...S} strokeWidth={2} />
      <circle cx="150" cy="142" r="3.5" fill={C.white} {...S} strokeWidth={2} />
      <path d="M148 76 q0 -14 12 -14 q12 0 12 12 q0 9 -12 13 v8" fill="none" stroke={C.pinkDeep} strokeWidth="5" strokeLinecap="round" />
      <circle cx="160" cy="108" r="3.5" fill={C.pinkDeep} />
      {/* arrows between products */}
      <path d="M140 160 h40 M140 160 l8 -6 M140 160 l8 6 M180 160 l-8 -6 M180 160 l-8 6" {...S} strokeWidth={2.5} opacity="0.6" />
    </Backdrop>
  ),

  q4_difficulties: (
    <Backdrop>
      {/* winding path with obstacles leading to a product */}
      <path d="M40 168 C 86 168, 70 118, 112 118 S 146 160, 178 150 S 204 122, 228 148" fill="none" stroke={C.ink} strokeWidth="3" strokeDasharray="2 9" strokeLinecap="round" />
      <circle cx="40" cy="168" r="9" fill={C.lav} {...S} />
      {[
        { x: 88, y: 138, t: "?" },
        { x: 146, y: 140, t: "€" },
        { x: 196, y: 120, t: "?" },
      ].map((o) => (
        <g key={`${o.x}`}>
          <circle cx={o.x} cy={o.y} r="15" fill={C.white} {...S} strokeWidth={2} />
          <text x={o.x} y={o.y + 6} textAnchor="middle" fontSize="17" fontWeight="700" fill={C.pinkDeep} fontFamily="var(--font-sans)">
            {o.t}
          </text>
        </g>
      ))}
      <Dropper x={234} y={180} fill={C.pink} />
      <Diamond x={262} y={34} r={7} fill={C.pinkSoft} float />
    </Backdrop>
  ),

  q5_sources: (
    <Backdrop>
      {/* phone with video */}
      <rect x="64" y="52" width="76" height="132" rx="14" fill={C.white} {...S} />
      <rect x="74" y="70" width="56" height="70" rx="6" fill={C.pinkSoft} />
      <path d="M96 92 v26 l22 -13 z" fill={C.white} {...S} strokeWidth={2} />
      <path d="M90 156 h24" {...S} />
      {/* speech bubbles: friends / web */}
      <path d="M160 64 h86 a12 12 0 0 1 12 12 v30 a12 12 0 0 1 -12 12 h-58 l-14 12 v-12 h-14 a12 12 0 0 1 -12 -12 v-30 a12 12 0 0 1 12 -12 z" fill={C.lav} {...S} />
      <path d="M176 84 h60 M176 98 h40" stroke={C.white} strokeWidth="4" strokeLinecap="round" />
      {/* people */}
      {[184, 214, 244].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy={148} r="11" fill={i === 1 ? C.pink : C.pinkSoft} {...S} strokeWidth={2} />
          <path d={`M${x - 16} 182 a16 16 0 0 1 32 0`} fill={i === 1 ? C.pink : C.pinkSoft} {...S} strokeWidth={2} />
        </g>
      ))}
    </Backdrop>
  ),

  q6_label_confidence: (
    <Backdrop>
      {/* product with ingredient label */}
      <rect x="78" y="58" width="104" height="124" rx="16" fill={C.pink} {...S} />
      <rect x="92" y="78" width="76" height="86" rx="6" fill={C.white} {...S} strokeWidth={2} />
      {[92, 104, 116, 128, 140, 152].map((y, i) => (
        <path key={y} d={`M100 ${y} h${[58, 44, 52, 36, 50, 30][i]}`} stroke={C.ink} strokeWidth="3" strokeLinecap="round" opacity="0.45" />
      ))}
      {/* magnifier */}
      <circle cx="198" cy="112" r="36" fill={C.lavSoft} fillOpacity="0.85" {...S} strokeWidth={4} />
      <path d="M180 108 h28 M180 120 h20" stroke={C.ink} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M224 138 l30 30" {...S} strokeWidth={10} stroke={C.ink} />
      <path d="M224 138 l30 30" stroke={C.lav} strokeWidth="5" strokeLinecap="round" />
    </Backdrop>
  ),

  q7_language: (
    <Backdrop>
      <path d="M66 66 h82 a14 14 0 0 1 14 14 v44 a14 14 0 0 1 -14 14 h-46 l-18 16 v-16 h-18 a14 14 0 0 1 -14 -14 v-44 a14 14 0 0 1 14 -14 z" fill={C.pink} {...S} />
      <text x="107" y="118" textAnchor="middle" fontSize="44" fill={C.white} fontFamily="var(--font-display)">
        ሀ
      </text>
      <path d="M254 92 h-82 a14 14 0 0 0 -14 14 v44 a14 14 0 0 0 14 14 h46 l18 16 v-16 h18 a14 14 0 0 0 14 -14 v-44 a14 14 0 0 0 -14 -14 z" fill={C.lav} {...S} />
      <text x="213" y="144" textAnchor="middle" fontSize="40" fontWeight="700" fill={C.white} fontFamily="var(--font-display)">
        A
      </text>
    </Backdrop>
  ),

  q8_purchase_drivers: (
    <Backdrop>
      {/* shopping bag */}
      <path d="M96 88 a24 24 0 0 1 48 0" fill="none" {...S} strokeWidth={4} />
      <path d="M74 86 h92 l10 96 h-112 z" fill={C.pink} {...S} />
      <Jar x={92} y={150} w={44} fill={C.white} />
      {/* price tag */}
      <g transform="rotate(-14 214 86)">
        <path d="M188 70 h48 a8 8 0 0 1 8 8 v24 a8 8 0 0 1 -8 8 h-48 l-14 -20 z" fill={C.white} {...S} />
        <circle cx="190" cy="90" r="4" fill={C.ink} />
        <text x="218" y="97" textAnchor="middle" fontSize="18" fontWeight="700" fill={C.pinkDeep} fontFamily="var(--font-sans)">
          €
        </text>
      </g>
      {/* rating stars */}
      {[196, 222, 248].map((x, i) => (
        <path
          key={x}
          d={`M${x} 136 l5 10 l11 1.5 l-8 7.5 l2 11 l-10 -5.5 l-10 5.5 l2 -11 l-8 -7.5 l11 -1.5 z`}
          fill={i < 2 ? C.lav : C.white}
          {...S}
          strokeWidth={2}
        />
      ))}
    </Backdrop>
  ),

  q9_usefulness: (
    <Backdrop>
      {/* laptop showing a personalised report */}
      <rect x="70" y="60" width="180" height="106" rx="10" fill={C.white} {...S} />
      <path d="M48 166 h224 l-10 16 h-204 z" fill={C.pinkSoft} {...S} />
      <rect x="84" y="74" width="56" height="78" rx="6" fill={C.lavSoft} />
      <Jar x={92} y={140} w={40} fill={C.lav} />
      {[86, 108, 130].map((y) => (
        <g key={y}>
          <Check x={152} y={y} size={12} />
          <path d={`M172 ${y} h${y === 108 ? 44 : 60}`} stroke={C.ink} strokeWidth="3.5" strokeLinecap="round" opacity="0.45" />
        </g>
      ))}
      <Diamond x={252} y={52} r={9} fill={C.pink} float />
    </Backdrop>
  ),

  q10_features: (
    <Backdrop>
      {/* three feature cards: science, routine, comparison */}
      <g transform="rotate(-8 92 118)">
        <rect x="56" y="70" width="72" height="96" rx="12" fill={C.white} {...S} />
        <path d="M84 88 v18 l-14 26 a6 6 0 0 0 5 9 h34 a6 6 0 0 0 5 -9 l-14 -26 v-18" fill={C.lavSoft} {...S} strokeWidth={2} />
        <path d="M80 88 h24" {...S} strokeWidth={2} />
        <path d="M76 128 h32" stroke={C.lav} strokeWidth="5" strokeLinecap="round" />
      </g>
      <rect x="124" y="58" width="72" height="104" rx="12" fill={C.pink} {...S} />
      {[82, 110, 138].map((y, i) => (
        <g key={y}>
          <circle cx="146" cy={y} r="9" fill={C.white} {...S} strokeWidth={2} />
          <text x="146" y={y + 4.5} textAnchor="middle" fontSize="12" fontWeight="700" fill={C.pinkDeep} fontFamily="var(--font-sans)">
            {i + 1}
          </text>
          <path d={`M162 ${y} h20`} stroke={C.white} strokeWidth="4" strokeLinecap="round" />
        </g>
      ))}
      <g transform="rotate(8 228 118)">
        <rect x="192" y="70" width="72" height="96" rx="12" fill={C.white} {...S} />
        <rect x="206" y="104" width="14" height="44" rx="3" fill={C.pinkSoft} {...S} strokeWidth={2} />
        <rect x="236" y="88" width="14" height="60" rx="3" fill={C.lav} {...S} strokeWidth={2} />
      </g>
    </Backdrop>
  ),

  thanks: (
    <Backdrop>
      {/* envelope with heart */}
      <rect x="86" y="82" width="148" height="98" rx="10" fill={C.white} {...S} />
      <path d="M86 92 l74 52 l74 -52" fill="none" {...S} />
      <path
        d="M160 120 C 132 102, 124 88, 124 76 C 124 64, 134 56, 144 56 C 152 56, 157 60, 160 66 C 163 60, 168 56, 176 56 C 186 56, 196 64, 196 76 C 196 88, 188 102, 160 120 Z"
        fill={C.pink}
        {...S}
      />
      <Diamond x={70} y={64} r={8} fill={C.lav} float />
      <Diamond x={252} y={74} r={6} fill={C.pinkSoft} float />
      <Leaf x={232} y={180} />
      <Leaf x={88} y={180} flip />
    </Backdrop>
  ),

  privacy: (
    <Backdrop>
      <path d="M160 52 l64 22 v40 c0 38, -28 60, -64 72 c-36 -12, -64 -34, -64 -72 v-40 z" fill={C.lav} {...S} />
      <rect x="136" y="104" width="48" height="40" rx="8" fill={C.white} {...S} />
      <path d="M144 104 v-10 a16 16 0 0 1 32 0 v10" fill="none" {...S} strokeWidth={4} />
      <circle cx="160" cy="122" r="5" fill={C.pinkDeep} />
      <path d="M160 126 v8" stroke={C.pinkDeep} strokeWidth="4" strokeLinecap="round" />
    </Backdrop>
  ),
};

export type SceneName = keyof typeof scenes | string;

export function sceneContent(name: SceneName): ReactNode {
  return scenes[name] ?? scenes.welcome;
}
