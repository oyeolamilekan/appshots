/**
 * OverlayImageItem Component
 *
 * Individual overlay image item in the list.
 */

import { ArrowUp, ArrowDown, X } from "lucide-react";
import { STYLES } from "./constants";
import type { OverlayImageItemProps } from "./types";

/**
 * OverlayImageItem - Overlay image list item
 *
 * Shows thumbnail, layer info, and action buttons.
 *
 * @param props - Component props
 */
export const OverlayImageItem = ({
  image,
  index,
  totalCount,
  isSelected,
  onSelect,
  onRemove,
  onMoveForward,
  onMoveBackward,
}: OverlayImageItemProps) => (
  <div
    onClick={onSelect}
    className={`${STYLES.overlayItem} ${
      isSelected ? STYLES.overlayItemActive : STYLES.overlayItemInactive
    }`}
  >
    <img
      src={image.src}
      alt={`Overlay ${index + 1}`}
      className={STYLES.overlayThumbnail}
    />
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-300 truncate">Image {index + 1}</p>
      <p className="text-[10px] text-gray-500">
        Layer {index + 1} of {totalCount}
      </p>
    </div>
    <div className="flex items-center gap-1">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onMoveBackward();
        }}
        disabled={index === 0}
        className={STYLES.iconButton}
        title="Send backward"
      >
        <ArrowDown className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onMoveForward();
        }}
        disabled={index === totalCount - 1}
        className={STYLES.iconButton}
        title="Bring forward"
      >
        <ArrowUp className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className={STYLES.iconButtonDelete}
        title="Remove"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);
