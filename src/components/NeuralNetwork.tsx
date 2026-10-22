import React from "react";
import { Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { COLORS, HEIGHT, WIDTH } from "../config";
import { random } from "../utils";

const LAYERS = [3, 5, 6, 5, 3];
const TOP = 560;
const BOTTOM = 1400;
const CX = WIDTH / 2;
const CY = (TOP + BOTTOM) / 2;

type Node = { layer: number; x: number; y: number; phase: number };

const buildNodes = (): Node[] => {
  const nodes: Node[] = [];
  LAYERS.forEach((count, layer) => {
    const span = Math.min(700, (count - 1) * 135);
    const y = TOP + (layer * (BOTTOM - TOP)) / (LAYERS.length - 1);
    for (let i = 0; i < count; i++) {
      const x = CX - span / 2 + (count === 1 ? 0 : (i * span) / (count - 1));
      nodes.push({ layer, x, y, phase: random(layer * 10 + i) * Math.PI * 2 });
    }
  });
  return nodes;
};

const NODES = buildNodes();

type Edge = { a: number; b: number; layer: number; seed: number };
const buildEdges = (): Edge[] => {
  const edges: Edge[] = [];
  NODES.forEach((a, ai) => {
    NODES.forEach((b, bi) => {
      if (b.layer === a.layer + 1) {
        edges.push({ a: ai, b: bi, layer: a.layer, seed: edges.length });
      }
    });
  });
  return edges;
};
const EDGES = buildEdges();

const floatPos = (n: Node, frame: number) => ({
  x: n.x + Math.sin(frame / 32 + n.phase) * 9,
  y: n.y + Math.cos(frame / 38 + n.phase * 1.3) * 9,
});

export const NeuralNetwork: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

  return (
    <svg width={WIDTH} height={HEIGHT} style={{ position: "absolute", inset: 0 }}>
      {/* Rotating orbit rings */}
      {[
        { r: 470, speed: 0.22, dash: "6 16", o: 0.28 },
        { r: 395, speed: -0.34, dash: "2 10", o: 0.22 },
      ].map((ring, i) => {
        const appear = interpolate(frame, [4 + i * 6, 40 + i * 6], [0, 1], {
          ...clamp,
          easing: Easing.out(Easing.cubic),
        });
        return (
          <circle
            key={i}
            cx={CX}
            cy={CY}
            r={ring.r * (0.85 + appear * 0.15)}
            fill="none"
            stroke={COLORS.cyan}
            strokeWidth={1.5}
            strokeDasharray={ring.dash}
            opacity={ring.o * appear}
            transform={`rotate(${frame * ring.speed} ${CX} ${CY})`}
          />
        );
      })}

      {/* Connections */}
      {EDGES.map((e) => {
        const na = floatPos(NODES[e.a], frame);
        const nb = floatPos(NODES[e.b], frame);
        const draw = interpolate(frame, [10 + e.layer * 8, 34 + e.layer * 8], [0, 1], {
          ...clamp,
          easing: Easing.out(Easing.cubic),
        });
        const shimmer = 0.5 + 0.5 * Math.sin(frame / 16 + e.seed);
        return (
          <line
            key={e.seed}
            x1={na.x}
            y1={na.y}
            x2={na.x + (nb.x - na.x) * draw}
            y2={na.y + (nb.y - na.y) * draw}
            stroke={COLORS.cyan}
            strokeWidth={1.2}
            opacity={0.12 + shimmer * 0.12}
          />
        );
      })}

      {/* Signal pulses travelling along connections */}
      {EDGES.map((e) => {
        if (random(e.seed + 300) < 0.55) return null;
        const na = floatPos(NODES[e.a], frame);
        const nb = floatPos(NODES[e.b], frame);
        const startAt = 34 + e.layer * 8;
        if (frame < startAt) return null;
        const t = (((frame - startAt) * 0.022 + random(e.seed + 77)) % 1 + 1) % 1;
        const x = na.x + (nb.x - na.x) * t;
        const y = na.y + (nb.y - na.y) * t;
        const o = Math.sin(t * Math.PI);
        return (
          <circle
            key={`p${e.seed}`}
            cx={x}
            cy={y}
            r={4.5}
            fill="#FFFFFF"
            opacity={o}
            style={{ filter: `drop-shadow(0 0 8px ${COLORS.cyan})` }}
          />
        );
      })}

      {/* Nodes */}
      {NODES.map((n, i) => {
        const p = floatPos(n, frame);
        const s = spring({
          frame: frame - (n.layer * 8 + (i % 6)),
          fps,
          config: { damping: 16, stiffness: 120 },
        });
        const pulse = 1 + 0.18 * Math.sin(frame / 10 + n.phase);
        const r = 13 * s * pulse;
        return (
          <g key={i} opacity={Math.min(1, s)}>
            <circle cx={p.x} cy={p.y} r={r * 2.8} fill={COLORS.cyan} opacity={0.12} />
            <circle
              cx={p.x}
              cy={p.y}
              r={Math.max(0, r)}
              fill={COLORS.bg}
              stroke={COLORS.cyan}
              strokeWidth={3}
              style={{ filter: `drop-shadow(0 0 10px ${COLORS.cyan})` }}
            />
            <circle cx={p.x} cy={p.y} r={Math.max(0, r * 0.38)} fill="#FFFFFF" />
          </g>
        );
      })}
    </svg>
  );
};
