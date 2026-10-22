import React from "react";
import { Composition } from "remotion";
import { PowerOfAI } from "./PowerOfAI";
import { FPS, HEIGHT, TOTAL_FRAMES, WIDTH } from "./config";

export const Root: React.FC = () => (
  <Composition
    id="PowerOfAI"
    component={PowerOfAI}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
