/**
 * CanvasPreview Utility Functions
 *
 * Helper functions for computing styles and handling element interactions.
 */

import type { ImageOverlay, ShadowConfig } from "../../types";
import { SELECTION_COLORS } from "./constants";

/**
 * Generates drop shadow CSS filter from shadow configuration.
 *
 * @param shadow - Shadow configuration object
 * @returns CSS filter string or undefined if shadow is disabled
 */
export const getDropShadowFilter = (
  shadow: ShadowConfig | undefined,
): string | undefined => {
  if (!shadow?.enabled) return undefined;
  return `drop-shadow(${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${shadow.color})`;
};

/**
 * Checks if an element is currently selected.
 *
 * @param isActiveScreenshot - Whether this screenshot is active
 * @param selectedElement - Currently selected element info
 * @param elementType - Type of element to check
 * @param elementId - Optional element ID for image elements
 * @returns True if the element is selected
 */
export const isElementSelected = (
  isActiveScreenshot: boolean,
  selectedElement: { type: string; id?: string } | null,
  elementType: string,
  elementId?: string,
): boolean => {
  if (!isActiveScreenshot || !selectedElement) return false;
  if (selectedElement.type !== elementType) return false;
  if (elementId && selectedElement.id !== elementId) return false;
  return true;
};

/**
 * Generates selection styles for text elements (headline/subheadline).
 *
 * @param isSelected - Whether the element is selected
 * @returns Style object for selection highlight
 */
export const getTextSelectionStyles = (
  isSelected: boolean,
): React.CSSProperties => ({
  outline: isSelected ? `2px solid ${SELECTION_COLORS.outline}` : "none",
  outlineOffset: "2px",
  background: isSelected ? SELECTION_COLORS.background : "transparent",
  boxShadow: isSelected ? `0 0 0 1px ${SELECTION_COLORS.shadow}` : "none",
});

/**
 * Generates selection styles for image overlay elements.
 *
 * @param isSelected - Whether the element is selected
 * @returns Style object for selection highlight
 */
export const getImageSelectionStyles = (
  isSelected: boolean,
): React.CSSProperties => ({
  outline: isSelected ? `2px dashed ${SELECTION_COLORS.imageOutline}` : "none",
  outlineOffset: "4px",
});

/**
 * Generates position and transform styles for overlay images.
 *
 * @param image - Overlay image data
 * @param zIndex - Z-index for stacking
 * @param isSelected - Whether the image is selected
 * @returns Style object for positioning
 */
export const getOverlayImageStyles = (
  image: ImageOverlay,
  zIndex: number,
  isSelected: boolean,
): React.CSSProperties => ({
  left: `${image.x}%`,
  top: `${image.y}%`,
  transform: `translate(-50%, -50%) rotate(${image.rotation ?? 0}deg)`,
  width: `${image.width}%`,
  height: `${image.height}%`,
  zIndex,
  ...getImageSelectionStyles(isSelected),
});
