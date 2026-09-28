import { memo } from "react";
import { cn } from "@/lib/utils";
import nomiIdle from "@/assets/nomi-companion.png";
import nomiThinking from "@/assets/nomi-companion-thinking.png";
import nomiShopping from "@/assets/nomi-companion-shopping.png";
import nomiCalling from "@/assets/nomi-companion-call.png";
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

const POSE_IMAGE: Partial<Record<NomiPose, string>> = {
  think: nomiThinking,
  search: nomiThinking,
  write: nomiThinking,
  calendar: nomiThinking,
  reminder: nomiThinking,
  shopping: nomiShopping,
  call: nomiCalling,
};

function NomiAvatarBase({
  companion: _companion,
  pose = "idle",
  speaking = false,
  getLevel,
  size = 220,
  floating = true,
  className,
}: NomiAvatarProps) {
  const mouthLevel = useLipSync(speaking, getLevel);
  const poseImage = POSE_IMAGE[pose] ?? nomiIdle;
  const image = speaking && mouthLevel > 0.18 ? nomiCalling : poseImage;

  return (
    <span
      className={cn(
        "relative inline-grid shrink-0 place-items-center",
        floating && "animate-nomi-float",
        speaking && "nomi-speaking",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <span className="nomi-avatar-aura absolute inset-[12%] rounded-full" aria-hidden="true" />
      <img
        src={image}
        alt="Nomi companion"
        className="relative z-[1] size-full object-contain drop-shadow-[var(--shadow-character)]"
        draggable={false}
      />
    </span>
  );
}

export const NomiAvatar = memo(NomiAvatarBase);