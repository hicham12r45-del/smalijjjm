import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { COLORS, HEIGHT, WIDTH } from "../config";
import { random } from "../utils";

type Props = {
  count?: number;
  /** Frame (global) at which particles begin fading in */
  fadeInStart?: number;
  fadeInEnd?: number;
  maxOpacity?: number;
  seed?: number;
};

export const Particles: React.FC<Props> = ({
  count = 70,
  fadeInStart = 0,
  fadeInEnd = 60,
  maxOpacity = 0.9,
  seed = 1,
}) => {
  const frame = useCurrentFrame();
  const appear = interpolate(frame, [fadeInStart, fadeInEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0 }}>
      {Array.from({ length: count }).map((_, i) => {
        const s = seed * 1000 + i;
        const x0 = random(s) * WIDTH;
        const y0 = random(s + 1) * HEIGHT;
        const speed = 0.25 + random(s + 2) * 0.9;
        const size = 1.2 + random(s + 3) * 3.2;
        const phase = random(s + 4) * Math.PI * 2;
        // Float upward, wrap around vertically
        const y = (((y0 - frame * speed * 2.2) % HEIGHT) + HEIGHT) % HEIGHT;
        const x = x0 + Math.sin(frame / 40 + phase) * 18;
        const twinkle = 0.45 + 0.55 * Math.sin(frame / 12 + phase);
        const o = appear * maxOpacity * twinkle * (0.35 + random(s + 5) * 0.65);
        const color = random(s + 6) > 0.35 ? COLORS.cyan : COLORS.blue;
        return (
          <circle key={i} cx={x} cy={y} r={size} fill={color} opacity={o}
            style={{ filter: `drop-shadow(0 0 ${size * 2}px ${color})` }} />
        );
      })}
    </svg>
  );
};
