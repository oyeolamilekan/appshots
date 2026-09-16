import { describe, expect, it } from "vitest";
import type { Screenshot } from "../types";
import {
  DEFAULT_DECORATION_IMAGE_COLOR,
  decorationPresets,
  deriveDecorationColors,
  getDecorationBaseColor,
  mixHexColors,
  parseHexColor,
  relativeLuminance,
  resolveDecorations,
} from "./background-decorations";
import { createDeviceInstance } from "./device-instances";

const makeScreenshot = (overrides: Partial<Screenshot> = {}): Screenshot => {
  const device = createDeviceInstance({ id: "device-a" });
  return {
    id: "screen-1",
    headline: "",
    subheadline: "",
    backgroundColor: "#d4f0e8",
    backgroundMode: "solid",
    gradientPresetId: null,
    backgroundColorDark: "#0b1220",
    backgroundModeDark: "solid",
    gradientPresetIdDark: null,
    backgroundImageSrc: null,
    backgroundImageSrcDark: null,
    themeSplit: false,
    themeSplitAngle: 28,
    themeSplitOffset: 52,
    decorationPresetId: null,
    decorationOpacity: 70,
    decorationScale: 100,
    decorationColor: null,
    decorationColorDark: null,
    textColor: "#ffffff",
    headlineX: 50,
    headlineY: 10,
    headlineWidth: 80,
    subheadlineX: 50,
    subheadlineY: 20,
    subheadlineWidth: 80,
    fontFamily: "Inter",
    overlayImages: [],
    devices: [device],
    activeDeviceId: device.id,
    ...overrides,
  };
};

describe("hex color helpers", () => {
  it("parses 3 and 6 digit hex colors", () => {
    expect(parseHexColor("#0fc")).toEqual({ r: 0, g: 255, b: 204 });
    expect(parseHexColor("#d4f0e8")).toEqual({ r: 212, g: 240, b: 232 });
    expect(parseHexColor("not-a-color")).toBeNull();
  });

  it("mixes two hex colors", () => {
    expect(mixHexColors("#000000", "#ffffff", 0.5)).toBe("#808080");
    expect(mixHexColors("#d4f0e8", "#ffffff", 0)).toBe("#d4f0e8");
  });

  it("treats mint as a light color", () => {
    expect(relativeLuminance("#d4f0e8")).toBeGreaterThan(0.55);
    expect(relativeLuminance("#0b1220")).toBeLessThan(0.55);
  });
});

describe("deriveDecorationColors", () => {
  it("lightens a mint fill and darkens the stroke", () => {
    const colors = deriveDecorationColors("#d4f0e8");
    expect(relativeLuminance(colors.fill)).toBeGreaterThan(
      relativeLuminance("#d4f0e8"),
    );
    expect(relativeLuminance(colors.stroke)).toBeLessThan(
      relativeLuminance("#d4f0e8"),
    );
  });

  it("lightens decorations on a dark fill", () => {
    const colors = deriveDecorationColors("#0b1220");
    expect(relativeLuminance(colors.fill)).toBeGreaterThan(
      relativeLuminance("#0b1220"),
    );
    expect(relativeLuminance(colors.stroke)).toBeGreaterThan(
      relativeLuminance(colors.fill),
    );
  });
});

describe("decoration presets", () => {
  it("includes blob and wave presets with fill and stroke shapes", () => {
    expect(decorationPresets.map((preset) => preset.id)).toEqual([
      "blobs",
      "waves",
    ]);
    for (const preset of decorationPresets) {
      expect(preset.shapes.some((shape) => shape.kind === "fill")).toBe(true);
      expect(preset.shapes.some((shape) => shape.kind === "stroke")).toBe(true);
      expect(preset.shapes.every((shape) => shape.d.length > 0)).toBe(true);
    }
  });
});

describe("getDecorationBaseColor", () => {
  it("uses the solid fill color by default", () => {
    expect(getDecorationBaseColor(makeScreenshot())).toBe("#d4f0e8");
  });

  it("uses the gradient from color", () => {
    expect(
      getDecorationBaseColor(
        makeScreenshot({
          backgroundMode: "gradient",
          gradientPresetId: "ocean",
        }),
      ),
    ).toBe("#2b5876");
  });

  it("falls back to mint for image fills without a custom color", () => {
    expect(
      getDecorationBaseColor(
        makeScreenshot({
          backgroundMode: "image",
          backgroundImageSrc: "data:image/png;base64,abc",
        }),
      ),
    ).toBe(DEFAULT_DECORATION_IMAGE_COLOR);
  });

  it("prefers a custom decoration color", () => {
    expect(
      getDecorationBaseColor(
        makeScreenshot({
          decorationColor: "#ff00aa",
          backgroundMode: "image",
        }),
      ),
    ).toBe("#ff00aa");
  });
});

describe("resolveDecorations", () => {
  it("returns null when no preset is selected", () => {
    expect(resolveDecorations(makeScreenshot())).toBeNull();
  });

  it("resolves blob shapes with opacity and scale", () => {
    const resolved = resolveDecorations(
      makeScreenshot({
        decorationPresetId: "blobs",
        decorationOpacity: 80,
        decorationScale: 120,
      }),
    );

    expect(resolved).not.toBeNull();
    expect(resolved?.opacity).toBeCloseTo(0.8);
    expect(resolved?.scale).toBeCloseTo(1.2);
    expect(resolved?.shapes.length).toBeGreaterThan(0);
    expect(resolved?.shapes.some((shape) => shape.fill)).toBe(true);
    expect(resolved?.shapes.some((shape) => shape.stroke)).toBe(true);
  });
});
