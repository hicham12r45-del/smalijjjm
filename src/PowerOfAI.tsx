import React from "react";
import { AbsoluteFill, interpolate, Sequence, useCurrentFrame } from "remotion";
import { Background } from "./components/Background";
import { Particles } from "./components/Particles";
import { SceneTransition } from "./components/SceneTransition";
import { FinalScene, NetworkScene, OpeningScene, TitleScene } from "./scenes";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// Scenes overlap by 12 frames so transitions cross-dissolve.
const SCENES = [
  { from: 0, duration: 72, fadeIn: 0, fadeOut: 12, Component: OpeningScene },
  { from: 60, duration: 102, fadeIn: 12, fadeOut: 12, Component: TitleScene },
  { from: 150, duration: 102, fadeIn: 12, fadeOut: 12, Component: NetworkScene },
  { from: 240, duration: 60, fadeIn: 12, fadeOut: 0, Component: FinalScene },
];

export const PowerOfAI: React.FC = () => {
  const frame = useCurrentFrame();
  // Starts almost black, ends with a soft fade to dark.
  const veil =
    frame < 150
      ? interpolate(frame, [0, 40], [0.9, 0], clamp)
      : interpolate(frame, [284, 299], [0, 0.92], clamp);

  return (
    <AbsoluteFill>
      <Background />
      <Particles count={80} fadeInStart={6} fadeInEnd={70} seed={3} />
      {SCENES.map(({ from, duration, fadeIn, fadeOut, Component }) => (
        <Sequence key={from} from={from} durationInFrames={duration}>
          <SceneTransition durationInFrames={duration} fadeIn={fadeIn} fadeOut={fadeOut}>
            <Component />
          </SceneTransition>
        </Sequence>
      ))}
      <AbsoluteFill style={{ backgroundColor: "#000", opacity: veil, pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};
