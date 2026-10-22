import { loadFont } from "@remotion/google-fonts/Inter";

export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;
export const TOTAL_FRAMES = 300;

export const COLORS = {
  bg: "#05070B",
  cyan: "#22E6FF",
  blue: "#2F7BFF",
  white: "#EAF8FF",
  dim: "#6FA6C4",
};

// Loads Inter at render time (falls back to system sans-serif if offline).
const { fontFamily } = loadFont("normal", {
  weights: ["300", "800"],
  subsets: ["latin"],
});
export const FONT = `${fontFamily}, "Helvetica Neue", Arial, sans-serif`;
