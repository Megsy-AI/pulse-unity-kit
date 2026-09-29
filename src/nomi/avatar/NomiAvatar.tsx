import { memo, useId, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import type { NomiCompanion, NomiPose } from "../types";
import { useLipSync } from "./useLipSync";

interface NomiAvatarProps {
  companion: Pick<NomiCompanion, "shape" | "baseColor" | "accentColor">;
  pose?: NomiPose;
  speaking?: boolean;
  getLevel?: () => number;
  size?: number;
  floating?: boolean;
  className?: string;
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
  const mouthLevel = useLipSync(speaking, getLevel);
  const uid = useId().replace(/:/g, "");
  const style = {
    width: size,
    height: size,
    "--nomi-body": companion.baseColor,
    "--nomi-detail": companion.accentColor,
    "--nomi-mouth-open": speaking ? Math.max(0.12, mouthLevel) : 0,
  } as CSSProperties;
  const thinking = ["think", "search", "write", "calendar", "reminder"].includes(pose);

  return (
    <span
      className={cn(
        "relative inline-grid shrink-0 place-items-center",
        floating && "nomi-avatar-float",
        speaking && "nomi-speaking",
        `nomi-pose-${pose}`,
        className,
      )}
      style={style}
    >
      <span className="nomi-avatar-aura absolute inset-[12%] rounded-full" aria-hidden="true" />
      <svg className="nomi-character relative z-[1] size-full overflow-visible" viewBox="0 0 240 240" role="img" aria-label={`${companion.name}, your animated companion`}>
        <defs>
          <radialGradient id={`${uid}-body`} cx="34%" cy="24%" r="82%">
            <stop offset="0" stopColor="color-mix(in oklab, var(--nomi-body) 24%, white)" />
            <stop offset="0.7" stopColor="color-mix(in oklab, var(--nomi-body) 13%, white)" />
            <stop offset="1" stopColor="color-mix(in oklab, var(--nomi-body) 38%, white)" />
          </radialGradient>
          <radialGradient id={`${uid}-eye`} cx="36%" cy="28%" r="70%">
            <stop offset="0" stopColor="var(--primary-glow)" />
            <stop offset="0.42" stopColor="var(--primary)" />
            <stop offset="1" stopColor="var(--foreground)" />
          </radialGradient>
          <filter id={`${uid}-shadow`} x="-40%" y="-30%" width="180%" height="190%">
            <feDropShadow dx="0" dy="10" stdDeviation="8" floodColor="var(--foreground)" floodOpacity=".16" />
          </filter>
        </defs>
        <ellipse className="nomi-ground" cx="120" cy="216" rx="58" ry="9" />
        <g className="nomi-body" filter={`url(#${uid}-shadow)`}>
          <path d="M121 18C92 48 60 83 52 126c-10 54 18 88 68 88s79-34 69-88c-8-43-40-78-68-108Z" fill={`url(#${uid}-body)`} />
          <path className="nomi-crescent" d="M145 55c-9 3-14 12-11 21 3 10 14 15 24 11-5 8-16 12-26 8-12-5-18-19-13-31 5-11 16-17 26-15Z" />
          <g className="nomi-face">
            <g className="nomi-eye nomi-eye-left"><ellipse cx="91" cy="116" rx="18" ry="24" fill={`url(#${uid}-eye)`} /><ellipse className="nomi-eye-shine" cx="85" cy="108" rx="6" ry="8" /></g>
            <g className="nomi-eye nomi-eye-right"><ellipse cx="148" cy="116" rx="18" ry="24" fill={`url(#${uid}-eye)`} /><ellipse className="nomi-eye-shine" cx="142" cy="108" rx="6" ry="8" /></g>
            <ellipse className="nomi-cheek" cx="68" cy="146" rx="15" ry="8" /><ellipse className="nomi-cheek" cx="172" cy="146" rx="15" ry="8" />
            <g className="nomi-mouth" transform="translate(120 145)"><path d="M-10 0Q0 11 10 0Q8 18 0 18Q-8 18-10 0Z" /><ellipse className="nomi-tongue" cx="0" cy="12" rx="5" ry="3" /></g>
          </g>
          <g className="nomi-arm nomi-arm-left"><path d="M57 132C39 129 26 139 29 152c3 12 19 15 33 5" fill={`url(#${uid}-body)`} /></g>
          <g className="nomi-arm nomi-arm-right"><path d="M183 132c18-3 31 7 28 20-3 12-19 15-33 5" fill={`url(#${uid}-body)`} /></g>
          {pose === "shopping" ? <g className="nomi-prop nomi-shopping-bag"><path d="M142 160h43l-4 42h-35Z" /><path d="M151 164c0-18 23-18 23 0" fill="none" stroke="var(--primary-foreground)" strokeWidth="5" strokeLinecap="round" /></g> : null}
          {pose === "call" ? <g className="nomi-prop nomi-phone"><rect x="169" y="93" width="22" height="48" rx="9" /><circle cx="180" cy="132" r="2" fill="var(--primary-foreground)" /></g> : null}
          {thinking ? <g className="nomi-prop nomi-thoughts"><circle cx="183" cy="68" r="5" /><circle cx="199" cy="51" r="8" /><circle cx="218" cy="31" r="11" /></g> : null}
          {pose === "celebrate" ? <g className="nomi-prop nomi-sparkles"><path d="m33 74 4 9 9 4-9 4-4 9-4-9-9-4 9-4Z" /><path d="m202 88 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z" /></g> : null}
        </g>
      </svg>
    </span>
  );
}

export const NomiAvatar = memo(NomiAvatarBase);