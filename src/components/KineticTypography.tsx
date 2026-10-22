import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, FONT } from "../config";

export type TypeLine = {
  text: string;
  fontSize: number;
  color?: string;
  weight?: number;
  letterSpacing?: number; // in em
  delay: number; // frames before the first letter starts
  stagger?: number; // frames between letters
  glow?: number; // text-shadow radius in px
};

type Props = {
  lines: TypeLine[];
  lineGap?: number;
  /** vertical center of the text block, in px */
  centerY?: number;
};

const Letter: React.FC<{
  char: string;
  index: number;
  line: TypeLine;
}> = ({ char, index, line }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = line.delay + index * (line.stagger ?? 2);
  const s = spring({
    frame: frame - start,
    fps,
    config: { damping: 22, stiffness: 110, mass: 0.9 },
  });
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
  const opacity = interpolate(s, [0, 0.55], [0, 1], clamp);
  const y = interpolate(s, [0, 1], [70, 0]);
  const scale = interpolate(s, [0, 1], [1.3, 1]);
  const blur = interpolate(s, [0, 0.8], [14, 0], clamp);
  const glow = line.glow ?? 0;

  return (
    <span
      style={{
        display: "inline-block",
        opacity,
        transform: `translateY(${y}px) scale(${scale})`,
        filter: `blur(${blur}px)`,
        textShadow: glow
          ? `0 0 ${glow}px rgba(34,230,255,0.55), 0 0 ${glow * 2.5}px rgba(47,123,255,0.3)`
          : undefined,
        whiteSpace: "pre",
      }}
    >
      {char}
    </span>
  );
};

export const KineticTypography: React.FC<Props> = ({
  lines,
  lineGap = 10,
  centerY,
}) => (
  <AbsoluteFill
    style={{
      justifyContent: centerY === undefined ? "center" : "flex-start",
      alignItems: "center",
    }}
  >
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: lineGap,
        marginTop: centerY === undefined ? 0 : centerY,
        transform: centerY === undefined ? undefined : "translateY(-50%)",
        fontFamily: FONT,
        textAlign: "center",
      }}
    >
      {lines.map((line, li) => (
        <div
          key={li}
          style={{
            fontSize: line.fontSize,
            fontWeight: line.weight ?? 800,
            color: line.color ?? COLORS.white,
            letterSpacing: `${line.letterSpacing ?? 0.04}em`,
            lineHeight: 1,
            display: "flex",
          }}
        >
          {line.text.split("").map((c, i) => (
            <Letter key={i} char={c} index={i} line={line} />
          ))}
        </div>
      ))}
    </div>
  </AbsoluteFill>
);
