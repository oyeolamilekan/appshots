/**
 * Catalog
 *
 * Read-only inventory of everything a spec can reference: device models and
 * their colors, export sizes, gradient presets, position presets, fonts and
 * numeric ranges. All values come from the editor's own constants, so the
 * catalog can never drift from what the renderer accepts.
 */

import { devices, exportSizes, gradientPresets } from "../../src/constants";
import { googleFonts } from "../../src/lib/google-fonts";
import { positionPresets } from "../../src/lib/position-presets";
import { SLIDER_RANGES } from "../../src/components/RightSidebar/constants";

export type CatalogSection =
  | "devices"
  | "exportSizes"
  | "gradients"
  | "positionPresets"
  | "fonts"
  | "ranges";

export const catalogSections: CatalogSection[] = [
  "devices",
  "exportSizes",
  "gradients",
  "positionPresets",
  "fonts",
  "ranges",
];

export const deviceCatalog = devices.map((device) => ({
  model: device.id,
  label: device.label,
  resolution: `${device.width}x${device.height}`,
  aspectRatio: Number((device.width / device.height).toFixed(4)),
  camera: device.hasIsland
    ? "dynamic-island"
    : device.notchWidth > 0
      ? "notch"
      : "punch-hole",
  colors: device.colors.map((color) => ({ id: color.id, label: color.label })),
}));

export const exportSizeCatalog = exportSizes.map((size) => ({
  id: size.id,
  label: size.label,
  width: size.width,
  height: size.height,
}));

export const gradientCatalog = gradientPresets.map((preset) => ({
  id: preset.id,
  label: preset.label,
  from: preset.from,
  to: preset.to,
}));

export const positionPresetCatalog = positionPresets.map((preset) => ({
  id: preset.id,
  label: preset.label,
  settings: preset.settings,
}));

export const fontCatalog = googleFonts.map((font) => ({
  family: font.family,
  category: font.category,
  weights: font.weights,
}));

export const rangeCatalog = {
  ...SLIDER_RANGES,
  note:
    "Values outside these ranges are accepted by the renderer but are not " +
    "reachable in the editor UI. Device x/y accept off-canvas values so a " +
    "device can overflow into the neighboring screenshot.",
};

export const validDeviceModels = new Set(devices.map((device) => device.id));
export const validGradientIds = new Set(
  gradientPresets.map((preset) => preset.id),
);
export const validPresetIds = new Set(positionPresets.map((p) => p.id));
export const validFontFamilies = new Set(googleFonts.map((f) => f.family));

/**
 * Returns the whole catalog, or a single section when asked.
 */
export const getCatalog = (section?: CatalogSection) => {
  const all = {
    devices: deviceCatalog,
    exportSizes: exportSizeCatalog,
    gradients: gradientCatalog,
    positionPresets: positionPresetCatalog,
    fonts: fontCatalog,
    ranges: rangeCatalog,
  };

  if (!section) return all;
  return { [section]: all[section] };
};
