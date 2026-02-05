/**
 * SelectionButton Component
 *
 * Reusable button for selection lists (devices, export sizes).
 */

import { STYLES } from "./constants";

interface SelectionButtonProps {
  /** Button label text */
  label: string;
  /** Whether this option is selected */
  isSelected: boolean;
  /** Click handler */
  onClick: () => void;
}

/**
 * SelectionButton - Toggleable selection button
 *
 * A full-width button used in selection lists.
 * Shows active/inactive state with different styling.
 *
 * @param props - Component props
 * @param props.label - Button text
 * @param props.isSelected - Whether button is in selected state
 * @param props.onClick - Click handler
 *
 * @example
 * <SelectionButton
 *   label="iPhone 15 Pro"
 *   isSelected={selectedId === "iphone-15-pro"}
 *   onClick={() => setSelectedId("iphone-15-pro")}
 * />
 */
export const SelectionButton = ({
  label,
  isSelected,
  onClick,
}: SelectionButtonProps) => (
  <button
    className={`${STYLES.selectionButton} ${
      isSelected ? STYLES.selectionButtonActive : STYLES.selectionButtonInactive
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);
