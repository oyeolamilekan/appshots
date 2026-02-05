/**
 * CanvasPreview Constants
 *
 * Style constants and configuration values used across CanvasPreview components.
 */

/**
 * Z-index layers for proper element stacking order
 */
export const Z_INDEX = {
  /** Overlay images behind device */
  behindDevice: 10,
  /** Device frame */
  device: 50,
  /** Text elements (headline, subheadline) */
  text: 60,
  /** Overlay images in front of device */
  frontDevice: 100,
} as const;

/**
 * Selection highlight colors (purple theme)
 */
export const SELECTION_COLORS = {
  outline: "rgba(139, 92, 246, 0.8)",
  background: "rgba(139, 92, 246, 0.15)",
  shadow: "rgba(139, 92, 246, 0.4)",
  imageOutline: "rgba(255, 255, 255, 0.8)",
} as const;
