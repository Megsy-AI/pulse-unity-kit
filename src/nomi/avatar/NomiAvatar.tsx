import { memo } from "react";
import { cn } from "@/lib/utils";
import type { NomiCompanion, NomiPose } from "../types";
import lavender from "@/assets/nomi-look-lavender.png";
import mint from "@/assets/nomi-look-mint.png";
import peach from "@/assets/nomi-look-peach.png";
import ivory from "@/assets/nomi-look-ivory.png";

interface NomiAvatarProps {
  companion: Pick<NomiCompanion, "name" | "shape" | "baseColor" | "accentColor" | "glasses" | "outfit">;
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
  getLevel: _getLevel,
  size = 220,
  floating = true,
  className,
}: NomiAvatarProps) {
  const source = companion.shape === "robot" ? mint : companion.shape === "star" ? peach : companion.shape === "bear" ? ivory : lavender;

  return (
    <span
      className={cn(
        "relative inline-grid shrink-0 place-items-center",
        floating && "nomi-image-float",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <img src={source} alt={`${companion.name}, your companion`} width={1024} height={1024} loading="lazy" className={cn("size-full object-contain", speaking && "opacity-95")} data-pose={pose} data-glasses={companion.glasses} data-outfit={companion.outfit} />
    </span>
  );
}

export const NomiAvatar = memo(NomiAvatarBase);