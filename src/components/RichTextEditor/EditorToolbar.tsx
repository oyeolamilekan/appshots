/**
 * EditorToolbar Component
 *
 * Complete toolbar with all formatting controls.
 */

import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sparkles,
} from "lucide-react";
import type { ActiveStyles } from "./types";
import { ICON_SIZE, STYLES } from "./constants";
import { ToolbarButton } from "./ToolbarButton";
import { ToolbarSeparator } from "./ToolbarSeparator";
import { ColorPicker } from "./ColorPicker";

interface EditorToolbarProps {
  /** Current active formatting styles */
  activeStyles: ActiveStyles;
  /** Current text color */
  textColor: string;
  /** Execute formatting command */
  onCommand: (command: string, value?: string) => void;
  /** Color change handler */
  onColorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * EditorToolbar - Complete formatting toolbar
 *
 * Contains all formatting buttons organized into groups:
 * - Text formatting (Bold, Italic, Underline)
 * - Color picker
 * - Alignment (Left, Center, Right)
 * - AI Assist (placeholder)
 *
 * @param props - Component props
 *
 * @example
 * <EditorToolbar
 *   activeStyles={activeStyles}
 *   textColor={textColor}
 *   onCommand={execCommand}
 *   onColorChange={handleColorChange}
 * />
 */
export const EditorToolbar = ({
  activeStyles,
  textColor,
  onCommand,
  onColorChange,
}: EditorToolbarProps) => {
  // Prevent toolbar clicks from stealing focus
  const preventFocus = (e: React.MouseEvent) => e.preventDefault();

  return (
    <div className={STYLES.toolbar}>
      {/* Text Formatting */}
      <ToolbarButton
        onClick={() => onCommand("bold")}
        active={activeStyles.bold}
        title="Bold (Ctrl+B)"
        onMouseDown={preventFocus}
      >
        <Bold size={ICON_SIZE} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => onCommand("italic")}
        active={activeStyles.italic}
        title="Italic (Ctrl+I)"
        onMouseDown={preventFocus}
      >
        <Italic size={ICON_SIZE} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => onCommand("underline")}
        active={activeStyles.underline}
        title="Underline (Ctrl+U)"
        onMouseDown={preventFocus}
      >
        <Underline size={ICON_SIZE} />
      </ToolbarButton>

      <ToolbarSeparator />

      {/* Color Picker */}
      <ColorPicker
        value={textColor}
        onChange={onColorChange}
        onMouseDown={preventFocus}
      />

      <ToolbarSeparator />

      {/* Alignment */}
      <ToolbarButton
        onClick={() => onCommand("justifyLeft")}
        active={activeStyles.alignLeft}
        title="Align Left"
        onMouseDown={preventFocus}
      >
        <AlignLeft size={ICON_SIZE} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => onCommand("justifyCenter")}
        active={activeStyles.alignCenter}
        title="Align Center"
        onMouseDown={preventFocus}
      >
        <AlignCenter size={ICON_SIZE} />
      </ToolbarButton>
      <ToolbarButton
        onClick={() => onCommand("justifyRight")}
        active={activeStyles.alignRight}
        title="Align Right"
        onMouseDown={preventFocus}
      >
        <AlignRight size={ICON_SIZE} />
      </ToolbarButton>

      <ToolbarSeparator />

      {/* AI Assist (placeholder) */}
      <ToolbarButton
        onClick={() => {}}
        title="AI Assist (Coming Soon)"
        onMouseDown={preventFocus}
      >
        <Sparkles size={ICON_SIZE} />
      </ToolbarButton>
    </div>
  );
};
