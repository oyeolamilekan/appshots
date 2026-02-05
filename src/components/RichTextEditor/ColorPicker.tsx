/**
 * ColorPicker Component
 *
 * Color picker button for text color selection.
 */

import { Palette } from "lucide-react";
import { ICON_SIZE, STYLES } from "./constants";

interface ColorPickerProps {
  /** Current color value */
  value: string;
  /** Change handler */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Mouse down handler (for focus management) */
  onMouseDown: (e: React.MouseEvent) => void;
}

/**
 * ColorPicker - Text color selection button
 *
 * Displays a palette icon with color indicator and hidden color input.
 *
 * @param props - Component props
 *
 * @example
 * <ColorPicker
 *   value={textColor}
 *   onChange={handleColorChange}
 *   onMouseDown={preventFocus}
 * />
 */
export const ColorPicker = ({
  value,
  onChange,
  onMouseDown,
}: ColorPickerProps) => (
  <div
    className={`relative ${STYLES.toolbarButton} ${STYLES.toolbarButtonInactive}`}
  >
    <input
      type="color"
      value={value}
      onMouseDown={onMouseDown}
      onChange={onChange}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      title="Text Color"
    />
    <Palette size={ICON_SIZE} />
    {/* Color indicator bar */}
    <div
      className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full"
      style={{ backgroundColor: value }}
    />
  </div>
);
