import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

type Props = {
  durationInFrames: number;
  fadeIn?: number;
  fadeOut?: number;
  children: React.ReactNode;
};

/**
 * Wraps a scene (inside a <Sequence>) and gives it a soft cinematic
 * entrance and exit: opacity + slight blur + slight zoom.
 */
export const SceneTransition: React.FC<Props> = ({
  durationInFrames,
  fadeIn = 12,
  fadeOut = 12,
  children,
}) => {
  const frame = useCurrentFrame();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const inP = fadeIn > 0 ? interpolate(frame, [0, fadeIn], [0, 1], clamp) : 1;
  const outP =
    fadeOut > 0
      ? interpolate(frame, [durationInFrames - fadeOut, durationInFrames], [1, 0], clamp)
      : 1;
  const opacity = Math.min(inP, outP);
  const blur = (1 - opacity) * 10;
  const scale = 1 - (1 - inP) * 0.03 + (1 - outP) * 0.05;

  return (
    <AbsoluteFill
      style={{ opacity, filter: `blur(${blur}px)`, transform: `scale(${scale})` }}
    >
      {children}
    </AbsoluteFill>
  );
};
