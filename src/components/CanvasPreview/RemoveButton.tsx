/**
 * RemoveButton Component
 *
 * Button to remove a screenshot from the canvas.
 */

import { X } from "lucide-react";

interface RemoveButtonProps {
  /** Handler for remove action */
  onRemove: () => void;
}

/**
 * RemoveButton - Screenshot removal button
 *
 * Displays a small X button in the top-right corner of a screenshot card.
 * Only shown when there are multiple screenshots.
 *
 * @param props - Component props
 * @param props.onRemove - Handler called when button is clicked
 *
 * @example
 * {canRemove && <RemoveButton onRemove={() => removeScreenshot(id)} />}
 */
export const RemoveButton = ({ onRemove }: RemoveButtonProps) => (
  <button
    onClick={(e) => {
      e.stopPropagation();
      onRemove();
    }}
    className="absolute top-2 right-2 w-6 h-6 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white z-10"
  >
    <X className="w-3 h-3" />
  </button>
);
