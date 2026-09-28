import { memo } from "react";
import { cn } from "@/lib/utils";
import type { NomiCompanion, NomiPose, NomiShape } from "../types";
import { useLipSync } from "./useLipSync";

interface NomiAvatarProps {
  companion: Pick<NomiCompanion, "shape" | "baseColor" | "accentColor">;
  pose?: NomiPose;
  speaking?: boolean;
  /** Live mouth level 0→1 (microphone / speech). Falls back to a natural rhythm. */
  getLevel?: () => number;
  size?: number;
  floating?: boolean;
  className?: string;
}

const light = (c: string, amount = 28) => `color-mix(in oklab, ${c} ${100 - amount}%, white)`;
const dark = (c: string, amount = 22) => `color-mix(in oklab, ${c} ${100 - amount}%, black)`;

function Ears({ shape, base, accent }: { shape: NomiShape; base: string; accent: string }) {
  if (shape === "cat")
    return (
      <g>
        <path d="M64 58 L58 18 L96 40 Z" fill={base} />
        <path d="M156 58 L162 18 L124 40 Z" fill={base} />
        <path d="M70 52 L67 31 L88 43 Z" fill={accent} opacity={0.85} />
        <path d="M150 52 L153 31 L132 43 Z" fill={accent} opacity={0.85} />
      </g>
    );
  if (shape === "bear")
    return (
      <g>
        <circle cx="62" cy="48" r="22" fill={base} />
        <circle cx="158" cy="48" r="22" fill={base} />
        <circle cx="62" cy="48" r="11" fill={accent} opacity={0.85} />
        <circle cx="158" cy="48" r="11" fill={accent} opacity={0.85} />
      </g>
    );
  if (shape === "star")
    return (
      <g opacity={0.9}>
        <path
          d="M110 8 L122 44 L160 44 L130 66 L141 102 L110 80 L79 102 L90 66 L60 44 L98 44 Z"
          fill={accent}
          opacity={0.35}
        />
      </g>
    );
  if (shape === "robot")
    return (
      <g>
        <rect x="106" y="10" width="8" height="26" rx="4" fill={dark(base)} />
        <circle cx="110" cy="10" r="9" fill={accent} />
        <rect x="40" y="92" width="14" height="34" rx="7" fill={dark(base)} />
        <rect x="166" y="92" width="14" height="34" rx="7" fill={dark(base)} />
      </g>
    );
  return (
    <g>
      <rect x="107" y="14" width="6" height="22" rx="3" fill={dark(base)} />
      <circle cx="110" cy="13" r="8" fill={accent} />
    </g>
  );
}

function Prop({ pose, accent, base }: { pose: NomiPose; accent: string; base: string }) {
  const stroke = dark(base, 35);
  switch (pose) {
    case "shopping":
      return (
        <g className="animate-nomi-float">
          <path d="M168 138 h44 l-5 44 h-34 Z" fill={accent} />
          <path d="M178 138 c0 -12 6 -18 12 -18 s12 6 12 18" fill="none" stroke={stroke} strokeWidth="4" />
          <circle cx="190" cy="160" r="6" fill={light(base, 55)} opacity={0.7} />
        </g>
      );
    case "reminder":
      return (
        <g className="animate-nomi-float">
          <circle cx="190" cy="156" r="22" fill={light(accent, 15)} stroke={stroke} strokeWidth="4" />
          <path d="M190 144 v13 l9 6" fill="none" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
          <path d="M176 134 l-8 -7 M204 134 l8 -7" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
        </g>
      );
    case "calendar":
      return (
        <g className="animate-nomi-float">
          <rect x="166" y="134" width="48" height="44" rx="8" fill={light(accent, 12)} stroke={stroke} strokeWidth="4" />
          <path d="M166 148 h48" stroke={stroke} strokeWidth="4" />
          <circle cx="180" cy="162" r="4" fill={stroke} />
          <circle cx="196" cy="162" r="4" fill={stroke} opacity={0.4} />
        </g>
      );
    case "search":
      return (
        <g className="animate-nomi-float">
          <circle cx="188" cy="150" r="18" fill="none" stroke={stroke} strokeWidth="5" />
          <circle cx="188" cy="150" r="13" fill={accent} opacity={0.35} />
          <path d="M200 163 l14 14" stroke={stroke} strokeWidth="6" strokeLinecap="round" />
        </g>
      );
    case "write":
      return (
        <g className="animate-nomi-float">
          <rect x="164" y="136" width="40" height="46" rx="6" fill={light(accent, 10)} stroke={stroke} strokeWidth="4" />
          <path d="M172 150 h22 M172 160 h22 M172 170 h14" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
          <path d="M206 128 l12 12 l-26 26 l-14 2 l2 -14 Z" fill={accent} stroke={stroke} strokeWidth="3" />
        </g>
      );
    case "email":
      return (
        <g className="animate-nomi-float">
          <rect x="164" y="138" width="52" height="38" rx="7" fill={light(accent, 10)} stroke={stroke} strokeWidth="4" />
          <path d="M164 144 l26 20 l26 -20" fill="none" stroke={stroke} strokeWidth="4" strokeLinecap="round" />
        </g>
      );
    case "call":
      return (
        <g className="animate-nomi-float">
          <rect x="170" y="130" width="34" height="54" rx="10" fill={light(accent, 8)} stroke={stroke} strokeWidth="4" />
          <rect x="180" y="140" width="14" height="4" rx="2" fill={stroke} />
          <circle cx="187" cy="174" r="4" fill={stroke} />
        </g>
      );
    case "travel":
      return (
        <g className="animate-nomi-float">
          <path d="M162 162 l52 -24 l-8 20 l10 16 l-10 4 l-14 -12 l-14 6 l-4 12 l-8 -4 l2 -14 Z" fill={accent} stroke={stroke} strokeWidth="3" strokeLinejoin="round" />
        </g>
      );
    case "celebrate":
      return (
        <g className="animate-nomi-float">
          <path d="M176 176 l34 -34" stroke={accent} strokeWidth="6" strokeLinecap="round" />
          <circle cx="212" cy="132" r="6" fill={accent} />
          <circle cx="196" cy="128" r="4" fill={light(base, 40)} />
          <circle cx="220" cy="152" r="4" fill={light(base, 40)} />
        </g>
      );
    default:
      return null;
  }
}

function NomiAvatarBase({
  companion,
  pose = "idle",
  speaking = false,
  getLevel,
  size = 220,
  floating = true,
  className,
}: NomiAvatarProps) {
  const open = useLipSync(speaking, getLevel);
  const base = companion.baseColor;
  const accent = companion.accentColor;
  const headY = pose === "think" ? 96 : 100;
  const happy = pose === "celebrate" || pose === "wave";
  const eyeShift = pose === "think" ? -5 : pose === "search" ? 4 : 0;

  return (
    <svg
      viewBox="0 0 240 230"
      width={size}
      height={(size * 230) / 240}
      className={cn(floating && "animate-nomi-float", className)}
      role="img"
      aria-label="Nomi companion"
    >
      <defs>
        <linearGradient id="nomi-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={light(base, 22)} />
          <stop offset="100%" stopColor={base} />
        </linearGradient>
        <radialGradient id="nomi-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={base} stopOpacity="0.35" />
          <stop offset="100%" stopColor={base} stopOpacity="0" />
        </radialGradient>
      </defs>

      <circle cx="110" cy={headY + 4} r="96" fill="url(#nomi-glow)" />
      <ellipse cx="110" cy="214" rx="54" ry="9" fill={dark(base, 10)} opacity="0.14" />

      <Ears shape={companion.shape} base={base} accent={accent} />

      {/* shoulders */}
      <path d="M60 200 c0 -34 22 -54 50 -54 s50 20 50 54 Z" fill={accent} opacity="0.92" />

      {/* head */}
      {companion.shape === "robot" ? (
        <rect x="42" y={headY - 62} width="136" height="124" rx="40" fill="url(#nomi-body)" />
      ) : (
        <circle cx="110" cy={headY} r="66" fill="url(#nomi-body)" />
      )}

      {/* cheeks */}
      <ellipse cx="74" cy={headY + 20} rx="13" ry="8" fill={accent} opacity="0.5" />
      <ellipse cx="146" cy={headY + 20} rx="13" ry="8" fill={accent} opacity="0.5" />

      {/* eyes */}
      <g className="animate-nomi-blink" style={{ transformOrigin: `110px ${headY - 6}px` }}>
        {happy ? (
          <g fill="none" stroke={dark(base, 62)} strokeWidth="6" strokeLinecap="round">
            <path d={`M74 ${headY - 4} q12 -14 24 0`} />
            <path d={`M122 ${headY - 4} q12 -14 24 0`} />
          </g>
        ) : (
          <>
            <ellipse cx="86" cy={headY - 6} rx="13" ry="16" fill="white" />
            <ellipse cx="134" cy={headY - 6} rx="13" ry="16" fill="white" />
            <circle cx={86 + eyeShift} cy={headY - 4} r="7" fill={dark(base, 70)} />
            <circle cx={134 + eyeShift} cy={headY - 4} r="7" fill={dark(base, 70)} />
            <circle cx={89 + eyeShift} cy={headY - 9} r="2.6" fill="white" />
            <circle cx={137 + eyeShift} cy={headY - 9} r="2.6" fill="white" />
          </>
        )}
      </g>

      {/* mouth — lip sync */}
      {open > 0.06 ? (
        <g>
          <ellipse
            cx="110"
            cy={headY + 32}
            rx={15 - open * 4}
            ry={3 + open * 13}
            fill={dark(base, 72)}
          />
          <ellipse
            cx="110"
            cy={headY + 36 + open * 6}
            rx={8 - open * 2}
            ry={3 + open * 4}
            fill={accent}
            opacity="0.75"
          />
        </g>
      ) : (
        <path
          d={`M96 ${headY + 28} q14 ${happy ? 18 : 12} 28 0`}
          fill="none"
          stroke={dark(base, 72)}
          strokeWidth="5"
          strokeLinecap="round"
        />
      )}

      {/* arms */}
      <circle cx="52" cy="176" r="13" fill={light(base, 10)} />
      <circle cx="168" cy={pose === "idle" ? 176 : 164} r="13" fill={light(base, 10)} />

      <Prop pose={pose} accent={accent} base={base} />
    </svg>
  );
}

export const NomiAvatar = memo(NomiAvatarBase);
