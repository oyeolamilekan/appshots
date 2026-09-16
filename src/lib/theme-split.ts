import { gradientPresets } from "../constants";
import type {
  BackgroundMode,
  DeviceInstance,
  DeviceSpec,
  Screenshot,
} from "../types";
import { isAnonymousDevice } from "./device-instances";

export type SplitSide = "light" | "dark";

export type PercentPoint = {
  x: number;
  y: number;
};

export type PercentRect = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotationDeg: number;
  rotationCenter: PercentPoint;
};

export const DEFAULT_THEME_SPLIT_ANGLE = 28;
export const DEFAULT_THEME_SPLIT_OFFSET = 52;
export const DEFAULT_BACKGROUND_COLOR_DARK = "#0b1220";
export const DEVICE_BEZEL_RATIO = 0.012;
export const SPLIT_HAIRLINE_THICKNESS = 1.2;

const EPS = 1e-9;

export const FULL_CANVAS_RECT: PercentRect = {
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  rotationDeg: 0,
  rotationCenter: { x: 50, y: 50 },
};

const UNIT_SQUARE: PercentPoint[] = [
  { x: 0, y: 0 },
  { x: 100, y: 0 },
  { x: 100, y: 100 },
  { x: 0, y: 100 },
];

export const signedSplitDistance = (
  point: PercentPoint,
  angle: number,
  offset: number,
  canvasAspect: number,
): number => {
  const theta = (angle * Math.PI) / 180;
  const dx = canvasAspect * (point.x - offset);
  const dy = point.y - 50;
  return -dx * Math.cos(theta) - dy * Math.sin(theta);
};

export const isOnSplitSide = (
  point: PercentPoint,
  angle: number,
  offset: number,
  canvasAspect: number,
  side: SplitSide,
): boolean => {
  const signed = signedSplitDistance(point, angle, offset, canvasAspect);
  return side === "light" ? signed >= -EPS : signed <= EPS;
};

const rotatePoint = (
  point: PercentPoint,
  center: PercentPoint,
  degrees: number,
): PercentPoint => {
  if (!degrees) return point;
  const rad = (degrees * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  return {
    x: center.x + dx * cos - dy * sin,
    y: center.y + dx * sin + dy * cos,
  };
};

export const mapLocalToCanvas = (
  local: PercentPoint,
  rect: PercentRect,
): PercentPoint => {
  const unrotated = {
    x: rect.x + (local.x / 100) * rect.width,
    y: rect.y + (local.y / 100) * rect.height,
  };
  return rotatePoint(unrotated, rect.rotationCenter, rect.rotationDeg);
};

const interpolate = (
  from: PercentPoint,
  to: PercentPoint,
  t: number,
): PercentPoint => ({
  x: from.x + (to.x - from.x) * t,
  y: from.y + (to.y - from.y) * t,
});

const clipPolygonByHalfPlane = (
  polygon: PercentPoint[],
  angle: number,
  offset: number,
  canvasAspect: number,
  side: SplitSide,
  rect: PercentRect,
): PercentPoint[] => {
  if (polygon.length === 0) return [];

  const output: PercentPoint[] = [];

  for (let i = 0; i < polygon.length; i++) {
    const start = polygon[i];
    const end = polygon[(i + 1) % polygon.length];
    const startCanvas = mapLocalToCanvas(start, rect);
    const endCanvas = mapLocalToCanvas(end, rect);
    const startIn = isOnSplitSide(startCanvas, angle, offset, canvasAspect, side);
    const endIn = isOnSplitSide(endCanvas, angle, offset, canvasAspect, side);
    const startSigned = signedSplitDistance(
      startCanvas,
      angle,
      offset,
      canvasAspect,
    );
    const endSigned = signedSplitDistance(endCanvas, angle, offset, canvasAspect);
    const delta = endSigned - startSigned;
    const intersection =
      Math.abs(delta) < EPS
        ? start
        : interpolate(start, end, -startSigned / delta);

    if (endIn) {
      if (!startIn) output.push(intersection);
      output.push(end);
    } else if (startIn) {
      output.push(intersection);
    }
  }

  return output;
};

export const getSplitClipPoints = (
  angle: number,
  offset: number,
  side: SplitSide,
  canvasAspect: number,
  rect: PercentRect = FULL_CANVAS_RECT,
): PercentPoint[] => {
  if (rect.width <= 0 || rect.height <= 0 || canvasAspect <= 0) return [];
  return clipPolygonByHalfPlane(
    UNIT_SQUARE,
    angle,
    offset,
    canvasAspect,
    side,
    rect,
  );
};

export const formatClipPolygon = (points: PercentPoint[]): string => {
  if (points.length < 3) {
    return "polygon(0% 0%, 0% 0%, 0% 0%)";
  }
  return `polygon(${points.map((point) => `${point.x}% ${point.y}%`).join(", ")})`;
};

export const getSplitClipPolygon = (
  angle: number,
  offset: number,
  side: SplitSide,
  canvasAspect: number,
  rect: PercentRect = FULL_CANVAS_RECT,
): string =>
  formatClipPolygon(getSplitClipPoints(angle, offset, side, canvasAspect, rect));

export const getSplitHairlinePoints = (
  angle: number,
  offset: number,
  canvasAspect: number,
  rect: PercentRect = FULL_CANVAS_RECT,
  thickness: number = SPLIT_HAIRLINE_THICKNESS,
): PercentPoint[] => {
  const crossings: PercentPoint[] = [];

  for (let i = 0; i < UNIT_SQUARE.length; i++) {
    const start = UNIT_SQUARE[i];
    const end = UNIT_SQUARE[(i + 1) % UNIT_SQUARE.length];
    const startSigned = signedSplitDistance(
      mapLocalToCanvas(start, rect),
      angle,
      offset,
      canvasAspect,
    );
    const endSigned = signedSplitDistance(
      mapLocalToCanvas(end, rect),
      angle,
      offset,
      canvasAspect,
    );

    if (startSigned === 0 || startSigned * endSigned < 0) {
      const delta = endSigned - startSigned;
      if (Math.abs(delta) < EPS) continue;
      crossings.push(interpolate(start, end, -startSigned / delta));
    }
  }

  if (crossings.length < 2) return [];

  const start = crossings[0];
  const end = crossings[1];
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.hypot(dx, dy);
  if (length < EPS) return [];

  const half = thickness / 2;
  const nx = (-dy / length) * half;
  const ny = (dx / length) * half;

  return [
    { x: start.x + nx, y: start.y + ny },
    { x: end.x + nx, y: end.y + ny },
    { x: end.x - nx, y: end.y - ny },
    { x: start.x - nx, y: start.y - ny },
  ];
};

export const getSplitHairlinePolygon = (
  angle: number,
  offset: number,
  canvasAspect: number,
  rect: PercentRect = FULL_CANVAS_RECT,
  thickness: number = SPLIT_HAIRLINE_THICKNESS,
): string =>
  formatClipPolygon(
    getSplitHairlinePoints(angle, offset, canvasAspect, rect, thickness),
  );

export const getDeviceScreenRect = (
  device: Pick<DeviceInstance, "x" | "y" | "scale" | "rotation" | "style" | "deviceId">,
  spec: Pick<DeviceSpec, "width" | "height">,
  canvasAspect: number,
  renderX: number = device.x,
): PercentRect => {
  const width = device.scale;
  const height = device.scale * canvasAspect * (spec.height / spec.width);
  const left = renderX - width / 2;
  const top = device.y;
  const bezelX = isAnonymousDevice(device.deviceId)
    ? 0
    : DEVICE_BEZEL_RATIO * width;
  const bezelY = isAnonymousDevice(device.deviceId)
    ? 0
    : DEVICE_BEZEL_RATIO * width * canvasAspect;

  return {
    x: left + bezelX,
    y: top + bezelY,
    width: width - bezelX * 2,
    height: height - bezelY * 2,
    rotationDeg: device.style === "3d" ? 0 : device.rotation,
    rotationCenter: { x: renderX, y: top + height / 2 },
  };
};

export const getThemeSplitClips = (
  angle: number,
  offset: number,
  canvasAspect: number,
  rect: PercentRect = FULL_CANVAS_RECT,
) => ({
  light: getSplitClipPolygon(angle, offset, "light", canvasAspect, rect),
  dark: getSplitClipPolygon(angle, offset, "dark", canvasAspect, rect),
  hairline: getSplitHairlinePolygon(angle, offset, canvasAspect, rect),
});

export const getBackgroundFillStyle = (
  mode: BackgroundMode,
  color: string,
  gradientPresetId: string | null,
): string => {
  if (mode === "gradient") {
    const preset =
      gradientPresets.find((preset) => preset.id === gradientPresetId) ??
      gradientPresets[0];
    return `linear-gradient(180deg, ${preset.from}, ${preset.to})`;
  }
  return color;
};

export const getScreenshotBackgroundFill = (
  screenshot: Screenshot,
  side: SplitSide = "light",
): string => {
  if (side === "dark") {
    return getBackgroundFillStyle(
      screenshot.backgroundModeDark,
      screenshot.backgroundColorDark,
      screenshot.gradientPresetIdDark,
    );
  }
  return getBackgroundFillStyle(
    screenshot.backgroundMode,
    screenshot.backgroundColor,
    screenshot.gradientPresetId,
  );
};

export const tracePercentPolygon = (
  ctx: CanvasRenderingContext2D,
  points: PercentPoint[],
  originX: number,
  originY: number,
  width: number,
  height: number,
) => {
  if (points.length < 3) return;
  ctx.beginPath();
  ctx.moveTo(
    originX + (points[0].x / 100) * width,
    originY + (points[0].y / 100) * height,
  );
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(
      originX + (points[i].x / 100) * width,
      originY + (points[i].y / 100) * height,
    );
  }
  ctx.closePath();
};
