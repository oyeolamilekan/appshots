/**
 * ColorButton Component
 *
 * Circular button for color selection.
 */

import { STYLES } from "./constants";

interface ColorButtonProps {
  /** Color value (CSS color) */
  color: string;
  /** Color label for tooltip */
  label: string;
  /** Whether this color is selected */
  isSelected: boolean;
  /** Click handler */
  onClick: () => void;
}

/**
 * ColorButton - Circular color swatch button
 *
 * A small circular button displaying a color option.
 * Shows scale effect and border when selected.
 *
 * @param props - Component props
 * @param props.color - CSS background color
 * @param props.label - Tooltip text
 * @param props.isSelected - Whether color is selected
 * @param props.onClick - Click handler
 *
 * @example
 * <ColorButton
 *   color="#1a1a1a"
 *   label="Space Black"
 *   isSelected={selectedColorId === "space-black"}
 *   onClick={() => setSelectedColorId("space-black")}
 * />
 */
export const ColorButton = ({
  color,
  label,
  isSelected,
  onClick,
}: ColorButtonProps) => (
  <button
    className={`${STYLES.colorButton} ${
      isSelected ? STYLES.colorButtonActive : STYLES.colorButtonInactive
    }`}
    style={{ backgroundColor: color }}
    onClick={onClick}
    title={label}
  />
);
