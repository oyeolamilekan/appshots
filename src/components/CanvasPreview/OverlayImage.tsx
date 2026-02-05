/**
 * OverlayImage Component
 *
 * Renders a draggable overlay image with selection state and shadow effects.
 */

import type { ImageOverlay } from "../../types";
import { SelectionHandles } from "./SelectionHandles";
import { getOverlayImageStyles, getDropShadowFilter } from "./utils";

interface OverlayImageProps {
  /** Overlay image data */
  image: ImageOverlay;
  /** Z-index for stacking order */
  zIndex: number;
  /** Whether this image is selected */
  isSelected: boolean;
  /** Whether mouse interactions are enabled */
  isInteractive: boolean;
  /** Handler for mouse down event */
  onMouseDown: (e: React.MouseEvent) => void;
}

/**
 * OverlayImage - Draggable image overlay component
 *
 * Renders an overlay image that can be positioned anywhere on the canvas.
 * Supports selection state, rotation, and drop shadow effects.
 *
 * @param props - Component props
 * @param props.image - The overlay image data
 * @param props.zIndex - Z-index for proper layering
 * @param props.isSelected - Whether the image is currently selected
 * @param props.isInteractive - Whether to respond to mouse events
 * @param props.onMouseDown - Handler for initiating drag
 *
 * @example
 * <OverlayImage
 *   image={overlayImg}
 *   zIndex={110}
 *   isSelected={true}
 *   isInteractive={true}
 *   onMouseDown={handleMouseDown}
 * />
 */
export const OverlayImage = ({
  image,
  zIndex,
  isSelected,
  isInteractive,
  onMouseDown,
}: OverlayImageProps) => (
  <div
    data-draggable-element="image"
    className="absolute cursor-move select-none"
    style={getOverlayImageStyles(image, zIndex, isSelected)}
    onMouseDown={isInteractive ? onMouseDown : undefined}
  >
    <img
      src={image.src}
      alt="Overlay"
      className="w-full h-full object-contain pointer-events-none"
      style={{ filter: getDropShadowFilter(image.shadow) }}
    />
    {isSelected && <SelectionHandles />}
  </div>
);
