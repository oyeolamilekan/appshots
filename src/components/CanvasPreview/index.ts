/**
 * CanvasPreview Module
 *
 * A collection of components for the main screenshot editing canvas.
 * Provides interactive preview, element positioning, and screenshot management.
 *
 * @module CanvasPreview
 *
 * @example
 * // Basic usage
 * import { CanvasPreview } from './components/CanvasPreview';
 *
 * <CanvasPreview />
 *
 * @example
 * // Using individual components
 * import {
 *   CanvasPreview,
 *   ScreenshotCard,
 *   TextElement,
 *   OverlayImage,
 * } from './components/CanvasPreview';
 */

// Main component
export { CanvasPreview } from "./CanvasPreview";

// Sub-components
export { Toolbar } from "./Toolbar";
export { ScreenshotCard } from "./ScreenshotCard";
export { TextElement } from "./TextElement";
export { OverlayImage } from "./OverlayImage";
export { DeviceContainer } from "./DeviceContainer";
export { RemoveButton } from "./RemoveButton";
export { SelectionHandles } from "./SelectionHandles";

// Hooks
export { useResizeObserver } from "./useResizeObserver";

// Utilities and constants
export { Z_INDEX, SELECTION_COLORS } from "./constants";
export {
  getDropShadowFilter,
  isElementSelected,
  getTextSelectionStyles,
  getImageSelectionStyles,
  getOverlayImageStyles,
} from "./utils";
