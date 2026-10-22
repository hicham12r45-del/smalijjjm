import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { COLORS, HEIGHT, WIDTH } from "../config";

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  // Slow breathing glow, driven by the frame number
  const breathe = 0.5 + 0.5 * Math.sin(frame / 38);
  const drift = interpolate(frame, [0, 300], [-60, 60]);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 900px 700px at ${
            WIDTH / 2 + drift
          }px ${HEIGHT * 0.5}px, rgba(34,230,255,${
            0.07 + breathe * 0.05
          }) 0%, rgba(47,123,255,0.04) 45%, rgba(5,7,11,0) 75%)`,
        }}
      />
      {/* Subtle grid */}
      <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", opacity: 0.07 }}>
        {Array.from({ length: 19 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 60} y1={0} x2={i * 60} y2={HEIGHT} stroke={COLORS.cyan} strokeWidth={1} />
        ))}
        {Array.from({ length: 33 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 60} x2={WIDTH} y2={i * 60} stroke={COLORS.cyan} strokeWidth={1} />
        ))}
      </svg>
      {/* Vignette */}
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(5,7,11,0) 45%, rgba(5,7,11,0.85) 100%)",
        }}
      />
    </AbsoluteFill>
  );
};
