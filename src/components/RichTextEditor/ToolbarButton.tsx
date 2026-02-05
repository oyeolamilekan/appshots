/**
 * ToolbarButton Component
 *
 * Individual button in the editor toolbar with active state styling.
 */

import { STYLES } from "./constants";

interface ToolbarButtonProps {
  /** Click handler */
  onClick: () => void;
  /** Whether button is in active state */
  active?: boolean;
  /** Tooltip text */
  title: string;
  /** Button content (icon) */
  children: React.ReactNode;
  /** Mouse down handler (for focus management) */
  onMouseDown?: (e: React.MouseEvent) => void;
}

/**
 * ToolbarButton - Formatting toolbar button
 *
 * Renders a button with active/inactive styling for the editor toolbar.
 * Prevents focus stealing to maintain editor selection.
 *
 * @param props - Component props
 *
 * @example
 * <ToolbarButton
 *   onClick={() => execCommand("bold")}
 *   active={activeStyles.bold}
 *   title="Bold (Ctrl+B)"
 *   onMouseDown={preventFocus}
 * >
 *   <Bold size={16} />
 * </ToolbarButton>
 */
export const ToolbarButton = ({
  onClick,
  active = false,
  title,
  children,
  onMouseDown,
}: ToolbarButtonProps) => (
  <button
    onMouseDown={onMouseDown}
    onClick={onClick}
    title={title}
    className={`${STYLES.toolbarButton} ${
      active ? STYLES.toolbarButtonActive : STYLES.toolbarButtonInactive
    }`}
  >
    {children}
  </button>
);
