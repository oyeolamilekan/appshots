import { describe, expect, it } from "vitest";
import { createDeviceInstance } from "./device-instances";
import {
  DEFAULT_THEME_SPLIT_ANGLE,
  DEFAULT_THEME_SPLIT_OFFSET,
  FULL_CANVAS_RECT,
  formatClipPolygon,
  getDeviceScreenRect,
  getSplitClipPoints,
  isOnSplitSide,
  signedSplitDistance,
} from "./theme-split";

const PORTRAIT_ASPECT = 1320 / 2868;

describe("split side tests", () => {
  it("treats the left of a vertical center line as light", () => {
    expect(isOnSplitSide({ x: 25, y: 50 }, 0, 50, PORTRAIT_ASPECT, "light")).toBe(
      true,
    );
    expect(isOnSplitSide({ x: 75, y: 50 }, 0, 50, PORTRAIT_ASPECT, "light")).toBe(
      false,
    );
    expect(isOnSplitSide({ x: 75, y: 50 }, 0, 50, PORTRAIT_ASPECT, "dark")).toBe(
      true,
    );
  });

  it("moves the top of a clockwise split to the right of the offset", () => {
    const topCenter = signedSplitDistance(
      { x: DEFAULT_THEME_SPLIT_OFFSET, y: 0 },
      DEFAULT_THEME_SPLIT_ANGLE,
      DEFAULT_THEME_SPLIT_OFFSET,
      PORTRAIT_ASPECT,
    );
    const bottomCenter = signedSplitDistance(
      { x: DEFAULT_THEME_SPLIT_OFFSET, y: 100 },
      DEFAULT_THEME_SPLIT_ANGLE,
      DEFAULT_THEME_SPLIT_OFFSET,
      PORTRAIT_ASPECT,
    );

    expect(topCenter).toBeGreaterThan(0);
    expect(bottomCenter).toBeLessThan(0);
  });
});

describe("getSplitClipPoints", () => {
  it("clips the canvas to the left half for a vertical split", () => {
    const points = getSplitClipPoints(0, 50, "light", PORTRAIT_ASPECT);

    expect(points.length).toBeGreaterThanOrEqual(3);
    expect(Math.max(...points.map((point) => point.x))).toBeCloseTo(50, 5);
    expect(Math.min(...points.map((point) => point.x))).toBeCloseTo(0, 5);
    expect(formatClipPolygon(points)).toContain("polygon(");
  });

  it("clips the canvas to the right half for the dark side", () => {
    const points = getSplitClipPoints(0, 50, "dark", PORTRAIT_ASPECT);

    expect(Math.min(...points.map((point) => point.x))).toBeCloseTo(50, 5);
    expect(Math.max(...points.map((point) => point.x))).toBeCloseTo(100, 5);
  });

  it("returns a diagonal polygon for the default angled split", () => {
    const points = getSplitClipPoints(
      DEFAULT_THEME_SPLIT_ANGLE,
      DEFAULT_THEME_SPLIT_OFFSET,
      "light",
      PORTRAIT_ASPECT,
    );
    const xsAtTop = points.filter((point) => point.y < 1).map((point) => point.x);
    const xsAtBottom = points
      .filter((point) => point.y > 99)
      .map((point) => point.x);

    expect(Math.max(...xsAtTop)).toBeGreaterThan(DEFAULT_THEME_SPLIT_OFFSET);
    expect(Math.max(...xsAtBottom)).toBeLessThan(DEFAULT_THEME_SPLIT_OFFSET);
  });
});

describe("getDeviceScreenRect", () => {
  it("insets the framed screen and keeps anonymous screens unbezeled", () => {
    const framed = createDeviceInstance({
      x: 50,
      y: 30,
      scale: 80,
      rotation: 0,
    });
    const anonymous = createDeviceInstance({
      deviceId: "anonymous",
      x: 50,
      y: 30,
      scale: 80,
      rotation: 0,
    });

    const framedRect = getDeviceScreenRect(
      framed,
      { width: 1290, height: 2796 },
      PORTRAIT_ASPECT,
    );
    const anonymousRect = getDeviceScreenRect(
      anonymous,
      { width: 1290, height: 2796 },
      PORTRAIT_ASPECT,
    );

    expect(framedRect.width).toBeLessThan(framed.scale);
    expect(anonymousRect.width).toBe(anonymous.scale);
    expect(framedRect.rotationCenter.x).toBe(50);
  });

  it("converts the canvas split into a different local screen polygon", () => {
    const device = createDeviceInstance({ x: 50, y: 30, scale: 80 });
    const screenRect = getDeviceScreenRect(
      device,
      { width: 1290, height: 2796 },
      PORTRAIT_ASPECT,
    );
    const canvasPoints = getSplitClipPoints(
      0,
      50,
      "light",
      PORTRAIT_ASPECT,
      FULL_CANVAS_RECT,
    );
    const screenPoints = getSplitClipPoints(
      0,
      50,
      "light",
      PORTRAIT_ASPECT,
      screenRect,
    );

    expect(screenPoints).not.toEqual(canvasPoints);
    expect(Math.max(...screenPoints.map((point) => point.x))).toBeGreaterThan(50);
  });
});
