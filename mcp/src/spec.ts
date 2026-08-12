/**
 * Spec Schema & Conversion
 *
 * Defines the agent-facing declarative spec and converts it into the exact
 * `Screenshot[]` shape the editor's renderer consumes. All id validation
 * happens here, with error messages that list the valid values so an agent can
 * self-correct in one turn.
 */

import { z } from "zod";
import { devices, exportSizes } from "../../src/constants";
import {
  DEFAULT_DEVICE_SHADOW,
  createDeviceInstance,
} from "../../src/lib/device-instances";
import { getPositionPreset } from "../../src/lib/position-presets";
import type {
  DeviceInstance,
  ExportSize,
  ImageOverlay,
  Screenshot,
  ShadowConfig,
} from "../../src/types";
import type { RenderRequest } from "../../src/render-entry";
import {
  validDeviceModels,
  validFontFamilies,
  validGradientIds,
  validPresetIds,
} from "./catalog";
import type { ImageResolver } from "./images";
import { SpecError } from "./paths";

/** Editor defaults for a fresh screenshot (see createDefaultScreenshot) */
const TEXT_DEFAULTS = {
  headline: { x: 50, y: 10, width: 80 },
  subheadline: { x: 50, y: 18, width: 80 },
} as const;

/** Editor defaults for a freshly added overlay (see addOverlayImage) */
const OVERLAY_SHADOW_DEFAULTS: ShadowConfig = {
  enabled: false,
  color: "#000000",
  blur: 20,
  offsetX: 0,
  offsetY: 10,
};

const HEX_COLOR = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

const colorSchema = z
  .string()
  .regex(HEX_COLOR, "expected a hex color such as #8b5cf6");

const shadowSchema = z
  .object({
    enabled: z.boolean().optional(),
    color: colorSchema.optional(),
    blur: z.number().min(0).max(200).optional(),
    offsetX: z.number().min(-200).max(200).optional(),
    offsetY: z.number().min(-200).max(200).optional(),
  })
  .describe("Drop shadow. Blur and offsets are in preview px and scale with export size.");

const deviceSchema = z.object({
  model: z
    .string()
    .describe("Device model id from get_catalog, e.g. iphone-15-pro-max"),
  color: z
    .string()
    .optional()
    .describe("Frame color id for this model; defaults to the model's first color"),
  screen: z
    .string()
    .optional()
    .describe(
      "App screenshot to place in the device screen: file path, http(s) URL or data URL",
    ),
  preset: z
    .string()
    .optional()
    .describe(
      "Position preset id (centered, perspective, tilt-left, ...). Explicit fields below override it.",
    ),
  scale: z
    .number()
    .min(10)
    .max(150)
    .optional()
    .describe("Device width as % of the screenshot width (editor range 40-90)"),
  x: z
    .number()
    .min(-150)
    .max(250)
    .optional()
    .describe(
      "Horizontal center as % of width (default 50). Values beyond 0-100 make the device overflow into the neighboring screenshot.",
    ),
  y: z
    .number()
    .min(-100)
    .max(200)
    .optional()
    .describe("Top edge as % of height (default 30, editor range 20-60)"),
  rotation: z
    .number()
    .min(-360)
    .max(360)
    .optional()
    .describe("2D rotation in degrees; flat style only"),
  style: z
    .enum(["flat", "3d"])
    .optional()
    .describe("flat = 2D frame, 3d = extruded perspective frame"),
  rotateY: z
    .number()
    .min(-60)
    .max(60)
    .optional()
    .describe("3D yaw in degrees (editor range -45 to 45); 3d style only"),
  rotateX: z
    .number()
    .min(-45)
    .max(45)
    .optional()
    .describe("3D pitch in degrees (editor range -30 to 30); 3d style only"),
  shadow: shadowSchema.optional(),
});

const overlaySchema = z.object({
  image: z
    .string()
    .describe("Badge/logo/decoration: file path, http(s) URL or data URL"),
  x: z.number().min(-50).max(150).default(50).describe("Center X as % of width"),
  y: z.number().min(-50).max(150).default(50).describe("Center Y as % of height"),
  width: z
    .number()
    .min(1)
    .max(200)
    .default(30)
    .describe("Width as % of the screenshot width"),
  height: z
    .number()
    .min(1)
    .max(200)
    .optional()
    .describe("Height as % of height; omit to derive from the image aspect ratio"),
  layer: z
    .enum(["behind", "front"])
    .default("front")
    .describe("Draw behind or in front of the device frame"),
  rotation: z.number().min(-360).max(360).default(0),
  shadow: shadowSchema.optional(),
});

const backgroundSchema = z
  .object({
    color: colorSchema
      .optional()
      .describe("Solid background color, e.g. #8b5cf6"),
    gradient: z
      .string()
      .optional()
      .describe("Gradient preset id (sunset, ocean, mint, berry, royal, rose)"),
  })
  .refine((value) => !(value.color && value.gradient), {
    message: "background: set either color or gradient, not both",
  });

const textLayoutSchema = z.object({
  x: z.number().min(0).max(100).optional().describe("Center X as % of width"),
  y: z.number().min(0).max(100).optional().describe("Top edge as % of height"),
  width: z
    .number()
    .min(10)
    .max(120)
    .optional()
    .describe("Text block width as % of the screenshot width"),
});

const screenSchema = z.object({
  name: z
    .string()
    .optional()
    .describe("Optional file name stem; defaults to <namePrefix>-<n>"),
  headline: z
    .string()
    .default("")
    .describe(
      "Headline. Inline HTML supported: <b> <strong> <i> <em> <u> <br> <mark> " +
        "<font color> <span style=\"color|background-color|font-weight|font-style|text-decoration\">. " +
        "Use <br> for line breaks — <div> and <p> do NOT break lines in the export.",
    ),
  subheadline: z.string().default("").describe("Subheadline; same HTML support"),
  fontFamily: z
    .string()
    .default("Inter")
    .describe("Google font family from get_catalog; unknown families fall back to sans-serif"),
  textColor: colorSchema.default("#ffffff").describe("Default text color"),
  background: backgroundSchema.default({ color: "#8b5cf6" }),
  headlineLayout: textLayoutSchema.optional(),
  subheadlineLayout: textLayoutSchema.optional(),
  devices: z
    .array(deviceSchema)
    .min(1)
    .max(6)
    .describe("Devices in this screenshot, drawn back to front"),
  overlays: z.array(overlaySchema).max(12).default([]),
});

const baseShape = {
  exportSize: z
    .string()
    .default("6.7")
    .describe(
      'Export size id from get_catalog ("6.7", "6.5", "5.5", "ipad") or explicit "WIDTHxHEIGHT", e.g. "1284x2778"',
    ),
  namePrefix: z
    .string()
    .default("appstore-screenshot")
    .describe("File name prefix for generated PNGs"),
  previewWidth: z
    .number()
    .min(120)
    .max(2000)
    .default(320)
    .describe(
      "Text-scale reference width in px (default 320 ~= the editor's on-screen card). " +
        "All font sizes are multiplied by exportSize.width / previewWidth, so lowering this makes text bigger.",
    ),
  headlineFontSize: z
    .number()
    .min(12)
    .max(200)
    .default(72)
    .describe("Headline size in editor slider units (editor range 32-120)"),
  subheadlineFontSize: z
    .number()
    .min(10)
    .max(160)
    .default(42)
    .describe("Subheadline size in editor slider units (editor range 20-72)"),
  screens: z
    .array(screenSchema)
    .min(1)
    .max(20)
    .describe("One entry per exported screenshot, in order"),
};

export const renderInputSchema = z.object({
  outDir: z
    .string()
    .describe("Directory for the PNGs, relative to the server's fs root. Created if missing."),
  ...baseShape,
});

export const validateInputSchema = z.object({
  outDir: z.string().optional(),
  ...baseShape,
});

export type RenderInput = z.infer<typeof renderInputSchema>;
export type ScreenInput = z.infer<typeof screenSchema>;
export type DeviceInput = z.infer<typeof deviceSchema>;

const listSet = (values: Set<string>) => Array.from(values).join(", ");

/** Drops undefined keys so they don't clobber preset/default values */
const defined = <T extends object>(value: T): Partial<T> =>
  Object.fromEntries(
    Object.entries(value).filter(([, v]) => v !== undefined),
  ) as Partial<T>;

/**
 * Resolves an export size id or explicit `WIDTHxHEIGHT` string.
 */
export const resolveExportSize = (value: string): ExportSize => {
  const preset = exportSizes.find((size) => size.id === value);
  if (preset) return preset;

  const match = /^(\d{3,5})\s*[x×]\s*(\d{3,5})$/i.exec(value.trim());
  if (match) {
    const width = Number(match[1]);
    const height = Number(match[2]);
    return { id: "custom", label: `Custom ${width}x${height}`, width, height };
  }

  throw new SpecError(
    `exportSize: unknown value "${value}". Use one of ${exportSizes
      .map((size) => size.id)
      .join(", ")} or an explicit size like 1284x2778.`,
  );
};

const buildDevice = async (
  input: DeviceInput,
  resolver: ImageResolver,
  label: string,
): Promise<DeviceInstance> => {
  if (!validDeviceModels.has(input.model)) {
    throw new SpecError(
      `${label}.model: unknown device "${input.model}". Valid models: ${listSet(validDeviceModels)}`,
    );
  }

  const spec = devices.find((device) => device.id === input.model)!;
  const colorId = input.color ?? spec.colors[0].id;

  if (!spec.colors.some((color) => color.id === colorId)) {
    throw new SpecError(
      `${label}.color: "${colorId}" is not available for ${input.model}. ` +
        `Valid colors: ${spec.colors.map((color) => color.id).join(", ")}`,
    );
  }

  if (input.preset && !validPresetIds.has(input.preset)) {
    throw new SpecError(
      `${label}.preset: unknown preset "${input.preset}". Valid presets: ${listSet(validPresetIds)}`,
    );
  }

  const presetSettings = input.preset
    ? (getPositionPreset(input.preset)?.settings ?? {})
    : {};

  const screenshotSrc = input.screen
    ? await resolver.resolve(input.screen, `${label}.screen`)
    : null;

  return createDeviceInstance({
    deviceId: input.model,
    colorId,
    screenshotSrc,
    ...presetSettings,
    ...defined({
      x: input.x,
      y: input.y,
      scale: input.scale,
      rotation: input.rotation,
      style: input.style,
      rotateY: input.rotateY,
      rotateX: input.rotateX,
    }),
    shadow: {
      ...DEFAULT_DEVICE_SHADOW,
      ...presetSettings.shadow,
      ...defined(input.shadow ?? {}),
    },
  });
};

const buildOverlay = async (
  input: z.infer<typeof overlaySchema>,
  resolver: ImageResolver,
  label: string,
): Promise<ImageOverlay> => ({
  id: Math.random().toString(36).substring(2, 9),
  src: await resolver.resolve(input.image, `${label}.image`),
  x: input.x,
  y: input.y,
  width: input.width,
  // 0 tells the render page to derive height from the image's aspect ratio
  height: input.height ?? 0,
  layer: input.layer,
  rotation: input.rotation,
  shadow: { ...OVERLAY_SHADOW_DEFAULTS, ...defined(input.shadow ?? {}) },
});

export interface BuiltSpec {
  request: RenderRequest;
  /** File stems in output order, without the .png extension */
  fileStems: string[];
  warnings: string[];
}

/**
 * Converts a validated spec into a render request.
 */
export const buildRenderRequest = async (
  input: z.infer<typeof validateInputSchema>,
  resolver: ImageResolver,
): Promise<BuiltSpec> => {
  const exportSize = resolveExportSize(input.exportSize);
  const warnings: string[] = [];
  const screenshots: Screenshot[] = [];
  const fileStems: string[] = [];

  for (const [index, screen] of input.screens.entries()) {
    const label = `screens[${index}]`;

    if (screen.background.gradient && !validGradientIds.has(screen.background.gradient)) {
      throw new SpecError(
        `${label}.background.gradient: unknown gradient "${screen.background.gradient}". ` +
          `Valid gradients: ${listSet(validGradientIds)}`,
      );
    }

    if (!validFontFamilies.has(screen.fontFamily)) {
      warnings.push(
        `${label}.fontFamily: "${screen.fontFamily}" is not in the bundled Google Fonts list; ` +
          `the export will fall back to the generic sans-serif face`,
      );
    }

    const deviceInstances: DeviceInstance[] = [];
    for (const [deviceIndex, device] of screen.devices.entries()) {
      deviceInstances.push(
        await buildDevice(device, resolver, `${label}.devices[${deviceIndex}]`),
      );
    }

    const overlayImages: ImageOverlay[] = [];
    for (const [overlayIndex, overlay] of screen.overlays.entries()) {
      overlayImages.push(
        await buildOverlay(overlay, resolver, `${label}.overlays[${overlayIndex}]`),
      );
    }

    screenshots.push({
      id: Math.random().toString(36).substring(2, 9),
      headline: screen.headline,
      subheadline: screen.subheadline,
      backgroundColor: screen.background.color ?? "#8b5cf6",
      backgroundMode: screen.background.gradient ? "gradient" : "solid",
      gradientPresetId: screen.background.gradient ?? null,
      textColor: screen.textColor,
      headlineX: screen.headlineLayout?.x ?? TEXT_DEFAULTS.headline.x,
      headlineY: screen.headlineLayout?.y ?? TEXT_DEFAULTS.headline.y,
      headlineWidth: screen.headlineLayout?.width ?? TEXT_DEFAULTS.headline.width,
      subheadlineX: screen.subheadlineLayout?.x ?? TEXT_DEFAULTS.subheadline.x,
      subheadlineY: screen.subheadlineLayout?.y ?? TEXT_DEFAULTS.subheadline.y,
      subheadlineWidth:
        screen.subheadlineLayout?.width ?? TEXT_DEFAULTS.subheadline.width,
      fontFamily: screen.fontFamily,
      overlayImages,
      devices: deviceInstances,
      activeDeviceId: deviceInstances[0].id,
    });

    fileStems.push(screen.name ?? `${input.namePrefix}-${index + 1}`);
  }

  return {
    request: {
      screenshots,
      exportSize,
      previewWidth: input.previewWidth,
      headlineFontSize: input.headlineFontSize,
      subheadlineFontSize: input.subheadlineFontSize,
    },
    fileStems,
    warnings,
  };
};
