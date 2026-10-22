import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { COLORS, HEIGHT, WIDTH } from "../config";

type Props = { startFrame?: number; endFrame?: number };

/** Central point of light that grows into an energy orb with rings. */
export const EnergyCore: React.FC<Props> = ({ startFrame = 10, endFrame = 60 }) => {
  const frame = useCurrentFrame();
  const grow = interpolate(frame, [startFrame, endFrame], [0, 1], {
    easing: Easing.bezier(0.16, 1, 0.3, 1),
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pulse = 1 + Math.sin(frame / 6) * 0.05;
  const r = 6 + grow * 70 * pulse;
  const cx = WIDTH / 2;
  const cy = HEIGHT / 2;

  return (
    <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0 }}>
      <defs>
        <radialGradient id="core">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity={1} />
          <stop offset="35%" stopColor={COLORS.cyan} stopOpacity={0.9} />
          <stop offset="100%" stopColor={COLORS.blue} stopOpacity={0} />
        </radialGradient>
      </defs>
      {[0, 1, 2].map((i) => {
        const t = interpolate(frame, [startFrame + 12 + i * 8, endFrame + 20 + i * 8], [0, 1], {
          easing: Easing.out(Easing.cubic),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return (
          <circle key={i} cx={cx} cy={cy} r={40 + t * (220 + i * 110)}
            fill="none" stroke={COLORS.cyan} strokeWidth={1.5}
            opacity={(1 - t) * 0.55} />
        );
      })}
      <circle cx={cx} cy={cy} r={r * 4.5} fill="url(#core)" opacity={0.35 * grow} />
      <circle cx={cx} cy={cy} r={r} fill="url(#core)" opacity={grow} />
    </svg>
  );
};
