import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { AnimatedLines } from "./components/AnimatedLines";
import { EnergyCore } from "./components/EnergyCore";
import { KineticTypography } from "./components/KineticTypography";
import { NeuralNetwork } from "./components/NeuralNetwork";
import { COLORS, FONT, HEIGHT, WIDTH } from "./config";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** Scene 1: light streaks + growing energy core. */
export const OpeningScene: React.FC = () => (
  <AbsoluteFill>
    <AnimatedLines count={9} startFrame={0} endFrame={70} />
    <EnergyCore startFrame={8} endFrame={60} />
  </AbsoluteFill>
);

/** Scene 2: kinetic title "THE POWER / OF AI". */
export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const drift = interpolate(frame, [0, 102], [1, 1.05]);
  const lineW = interpolate(frame, [44, 80], [0, 640], {
    ...clamp,
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  const bloom = interpolate(frame, [10, 50], [0, 1], clamp);

  return (
    <AbsoluteFill style={{ transform: `scale(${drift})` }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 700px 500px at 50% 50%, rgba(34,230,255,${
            0.16 * bloom
          }) 0%, rgba(5,7,11,0) 70%)`,
        }}
      />
      <KineticTypography
        centerY={HEIGHT / 2 - 40}
        lineGap={26}
        lines={[
          { text: "THE POWER", fontSize: 128, delay: 8, stagger: 2, letterSpacing: 0.05, glow: 10 },
          { text: "OF AI", fontSize: 250, delay: 26, stagger: 3, letterSpacing: 0.06, color: COLORS.cyan, glow: 30 },
        ]}
      />
      {/* Underline light sweep */}
      <div
        style={{
          position: "absolute",
          left: (WIDTH - lineW) / 2,
          top: HEIGHT / 2 + 235,
          width: lineW,
          height: 3,
          background: `linear-gradient(90deg, rgba(34,230,255,0), ${COLORS.cyan}, rgba(47,123,255,0))`,
          boxShadow: `0 0 18px ${COLORS.cyan}`,
        }}
      />
    </AbsoluteFill>
  );
};

/** Scene 3: neural network visualisation. */
export const NetworkScene: React.FC = () => {
  const frame = useCurrentFrame();
  const label = interpolate(frame, [14, 40], [0, 1], clamp);
  return (
    <AbsoluteFill>
      <NeuralNetwork />
      <div
        style={{
          position: "absolute",
          top: 300,
          width: "100%",
          textAlign: "center",
          fontFamily: FONT,
          fontWeight: 300,
          fontSize: 30,
          letterSpacing: "0.55em",
          color: COLORS.dim,
          opacity: label,
          transform: `translateY(${(1 - label) * 16}px)`,
        }}
      >
        NEURAL INTELLIGENCE
      </div>
    </AbsoluteFill>
  );
};

/** Scene 4: final message. */
export const FinalScene: React.FC = () => {
  const frame = useCurrentFrame();
  const glow = 0.18 + 0.06 * Math.sin(frame / 8) + interpolate(frame, [10, 40], [0, 0.12], clamp);
  const lineW = interpolate(frame, [34, 56], [0, 560], {
    ...clamp,
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });
  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 800px 600px at 50% 50%, rgba(34,230,255,${glow}) 0%, rgba(5,7,11,0) 70%)`,
        }}
      />
      <KineticTypography
        centerY={HEIGHT / 2 - 20}
        lineGap={30}
        lines={[
          { text: "THE FUTURE", fontSize: 124, delay: 6, stagger: 2, letterSpacing: 0.05, glow: 8 },
          { text: "IS NOW", fontSize: 210, delay: 20, stagger: 3, letterSpacing: 0.06, color: COLORS.cyan, glow: 34 },
        ]}
      />
      <div
        style={{
          position: "absolute",
          left: (WIDTH - lineW) / 2,
          top: HEIGHT / 2 + 215,
          width: lineW,
          height: 3,
          background: `linear-gradient(90deg, rgba(34,230,255,0), ${COLORS.cyan}, rgba(47,123,255,0))`,
          boxShadow: `0 0 18px ${COLORS.cyan}`,
        }}
      />
    </AbsoluteFill>
  );
};
