import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, HEIGHT, WIDTH } from "../config";
import { random } from "../utils";

type Props = {
  count?: number;
  startFrame?: number;
  endFrame?: number;
};

/** Thin light streaks that sweep diagonally across the screen. */
export const AnimatedLines: React.FC<Props> = ({
  count = 9,
  startFrame = 0,
  endFrame = 80,
}) => {
  const frame = useCurrentFrame();

  return (
    <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <linearGradient id="streak" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={COLORS.cyan} stopOpacity={0} />
          <stop offset="50%" stopColor={COLORS.cyan} stopOpacity={1} />
          <stop offset="100%" stopColor={COLORS.blue} stopOpacity={0} />
        </linearGradient>
      </defs>
      {Array.from({ length: count }).map((_, i) => {
        const delay = random(i + 40) * 28;
        const len = 260 + random(i + 50) * 360;
        const y = 160 + random(i + 60) * (HEIGHT - 320);
        const progress = interpolate(
          frame,
          [startFrame + delay, endFrame + delay],
          [0, 1],
          { easing: Easing.bezier(0.22, 1, 0.36, 1), extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const dir = i % 2 === 0 ? 1 : -1;
        const x = dir === 1 ? -len + progress * (WIDTH + len * 1.4) : WIDTH - progress * (WIDTH + len * 1.4);
        const fade = Math.sin(progress * Math.PI);
        return (
          <rect key={i} x={x} y={y} width={len} height={2} fill="url(#streak)"
            opacity={fade * 0.8}
            transform={`rotate(${-8 * dir} ${x + len / 2} ${y})`} />
        );
      })}
    </svg>
  );
};
