import { gradientPresets } from "../constants";
import type { DecorationPresetId, Screenshot } from "../types";
import {
  getSplitClipPoints,
  tracePercentPolygon,
  type SplitSide,
} from "./theme-split";

export const DEFAULT_DECORATION_OPACITY = 70;
export const DEFAULT_DECORATION_SCALE = 100;
export const DEFAULT_DECORATION_IMAGE_COLOR = "#d8f0e8";

export type DecorationShapeKind = "fill" | "stroke";

export type DecorationShape = {
  d: string;
  kind: DecorationShapeKind;
  opacity: number;
  strokeWidth?: number;
};

export type DecorationPreset = {
  id: DecorationPresetId;
  label: string;
  shapes: DecorationShape[];
};

export type ResolvedDecorationShape = {
  d: string;
  kind: DecorationShapeKind;
  fill?: string;
  stroke?: string;
  strokeWidth: number;
  opacity: number;
};

export type ResolvedDecoration = {
  shapes: ResolvedDecorationShape[];
  opacity: number;
  scale: number;
};

const BLOB_SHAPES: DecorationShape[] = [
  {
    kind: "fill",
    opacity: 0.95,
    d: "M 74 -14 C 94 -22, 122 -6, 128 22 C 132 46, 114 62, 92 54 C 74 47, 64 30, 58 10 C 54 -4, 58 -8, 74 -14 Z",
  },
  {
    kind: "fill",
    opacity: 0.8,
    d: "M 86 4 C 104 -4, 122 12, 116 32 C 111 48, 92 52, 80 38 C 70 26, 72 12, 86 4 Z",
  },
  {
    kind: "stroke",
    opacity: 0.85,
    strokeWidth: 0.95,
    d: "M 56 -2 C 78 -16, 112 -2, 116 26 C 118 46, 98 56, 80 46 C 62 36, 46 16, 56 -2 Z",
  },
  {
    kind: "fill",
    opacity: 0.9,
    d: "M -16 78 C -22 96, -6 116, 24 112 C 44 109, 50 94, 38 82 C 24 68, 2 66, -16 78 Z",
  },
  {
    kind: "stroke",
    opacity: 0.9,
    strokeWidth: 0.95,
    d: "M -18 56 C -24 82, 4 116, 36 110 C 56 105, 62 86, 44 72 C 24 56, -8 44, -18 56 Z",
  },
  {
    kind: "fill",
    opacity: 0.7,
    d: "M 4 84 C 20 78, 36 92, 30 108 C 25 118, 6 118, -2 106 C -8 96, -6 88, 4 84 Z",
  },
  {
    kind: "stroke",
    opacity: 0.75,
    strokeWidth: 0.85,
    d: "M -10 36 C 6 22, 30 34, 24 56 C 20 74, 0 78, -12 62 C -18 52, -18 44, -10 36 Z",
  },
];

const WAVE_SHAPES: DecorationShape[] = [
  {
    kind: "fill",
    opacity: 0.9,
    d: "M -8 -4 L 108 -4 L 108 18 C 86 6, 68 28, 48 16 C 28 4, 12 22, -8 10 Z",
  },
  {
    kind: "stroke",
    opacity: 0.8,
    strokeWidth: 0.85,
    d: "M -8 24 C 16 8, 38 32, 58 18 C 78 4, 94 26, 108 14",
  },
  {
    kind: "fill",
    opacity: 0.9,
    d: "M -8 104 L 108 104 L 108 82 C 88 94, 70 72, 50 86 C 30 98, 12 76, -8 90 Z",
  },
  {
    kind: "stroke",
    opacity: 0.8,
    strokeWidth: 0.85,
    d: "M -8 76 C 18 92, 40 68, 62 82 C 82 94, 96 72, 108 84",
  },
];

export const decorationPresets: DecorationPreset[] = [
  { id: "blobs", label: "Blobs", shapes: BLOB_SHAPES },
  { id: "waves", label: "Waves", shapes: WAVE_SHAPES },
];

export const getDecorationPreset = (
  id: DecorationPresetId | null,
): DecorationPreset | null =>
  decorationPresets.find((preset) => preset.id === id) ?? null;

export const parseHexColor = (
  hex: string,
): { r: number; g: number; b: number } | null => {
  const normalized = hex.trim().replace("#", "");
  const full =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => char + char)
          .join("")
      : normalized;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
};

export const mixHexColors = (
  from: string,
  to: string,
  amount: number,
): string => {
  const start = parseHexColor(from);
  const end = parseHexColor(to);
  if (!start || !end) return from;
  const t = Math.min(1, Math.max(0, amount));
  const mix = (a: number, b: number) => Math.round(a + (b - a) * t);
  return `#${[mix(start.r, end.r), mix(start.g, end.g), mix(start.b, end.b)]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;
};

export const relativeLuminance = (hex: string): number => {
  const color = parseHexColor(hex);
  if (!color) return 0.5;
  const toLinear = (value: number) => {
    const channel = value / 255;
    return channel <= 0.03928
      ? channel / 12.92
      : ((channel + 0.055) / 1.055) ** 2.4;
  };
  return (
    0.2126 * toLinear(color.r) +
    0.7152 * toLinear(color.g) +
    0.0722 * toLinear(color.b)
  );
};

export const deriveDecorationColors = (
  baseHex: string,
): { fill: string; stroke: string } => {
  const luminance = relativeLuminance(baseHex);
  if (luminance > 0.55) {
    return {
      fill: mixHexColors(baseHex, "#ffffff", 0.78),
      stroke: mixHexColors(baseHex, "#000000", 0.4),
    };
  }
  return {
    fill: mixHexColors(baseHex, "#ffffff", 0.24),
    stroke: mixHexColors(baseHex, "#ffffff", 0.42),
  };
};

export const getDecorationBaseColor = (
  screenshot: Screenshot,
  side: SplitSide = "light",
): string => {
  const custom =
    side === "dark" ? screenshot.decorationColorDark : screenshot.decorationColor;
  if (custom) return custom;

  const mode =
    side === "dark" ? screenshot.backgroundModeDark : screenshot.backgroundMode;
  if (mode === "gradient") {
    const presetId =
      side === "dark"
        ? screenshot.gradientPresetIdDark
        : screenshot.gradientPresetId;
    const preset =
      gradientPresets.find((item) => item.id === presetId) ?? gradientPresets[0];
    return preset.from;
  }
  if (mode === "image") return DEFAULT_DECORATION_IMAGE_COLOR;
  return side === "dark"
    ? screenshot.backgroundColorDark
    : screenshot.backgroundColor;
};

export const resolveDecorations = (
  screenshot: Screenshot,
  side: SplitSide = "light",
): ResolvedDecoration | null => {
  const preset = getDecorationPreset(screenshot.decorationPresetId);
  if (!preset) return null;
  const colors = deriveDecorationColors(getDecorationBaseColor(screenshot, side));
  return {
    opacity: screenshot.decorationOpacity / 100,
    scale: screenshot.decorationScale / 100,
    shapes: preset.shapes.map((shape) => ({
      d: shape.d,
      kind: shape.kind,
      fill: shape.kind === "fill" ? colors.fill : undefined,
      stroke: shape.kind === "stroke" ? colors.stroke : undefined,
      strokeWidth: shape.strokeWidth ?? 0.95,
      opacity: shape.opacity,
    })),
  };
};

const getDecorationMatrix = (
  width: number,
  height: number,
  scale: number,
): DOMMatrix =>
  new DOMMatrix()
    .translateSelf(width / 2, height / 2)
    .scaleSelf(scale)
    .translateSelf(-width / 2, -height / 2)
    .scaleSelf(width / 100, height / 100);

export const drawBackgroundDecorations = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  screenshot: Screenshot,
) => {
  const drawSide = (side: SplitSide) => {
    const resolved = resolveDecorations(screenshot, side);
    if (!resolved) return;

    ctx.save();
    if (screenshot.themeSplit) {
      const points = getSplitClipPoints(
        screenshot.themeSplitAngle,
        screenshot.themeSplitOffset,
        side,
        canvas.width / canvas.height,
      );
      tracePercentPolygon(ctx, points, 0, 0, canvas.width, canvas.height);
      ctx.clip();
    }

    const matrix = getDecorationMatrix(
      canvas.width,
      canvas.height,
      resolved.scale,
    );
    const strokeScale = Math.min(canvas.width, canvas.height) / 100;

    for (const shape of resolved.shapes) {
      const path = new Path2D();
      path.addPath(new Path2D(shape.d), matrix);
      ctx.save();
      ctx.globalAlpha = resolved.opacity * shape.opacity;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      if (shape.kind === "fill" && shape.fill) {
        ctx.fillStyle = shape.fill;
        ctx.fill(path);
      } else if (shape.stroke) {
        ctx.strokeStyle = shape.stroke;
        ctx.lineWidth = shape.strokeWidth * strokeScale;
        ctx.stroke(path);
      }
      ctx.restore();
    }
    ctx.restore();
  };

  drawSide("light");
  if (screenshot.themeSplit) drawSide("dark");
};
