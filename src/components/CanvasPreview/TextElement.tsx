/**
 * TextElement Component
 *
 * Renders a draggable text element (headline or subheadline) with selection state.
 */

import type React from "react";
import { getTextSelectionStyles } from "./utils";
import { Z_INDEX } from "./constants";

interface TextElementProps {
  /** Type of text element */
  type: "headline" | "subheadline";
  /** HTML content to display */
  content: string;
  /** Horizontal position as percentage */
  x: number;
  /** Vertical position as percentage */
  y: number;
  /** Width as percentage */
  width: number;
  /** Font size in pixels */
  fontSize: number;
  /** Text color */
  color: string;
  /** Font family name */
  fontFamily: string;
  /** Whether this element is selected */
  isSelected: boolean;
  /** Whether mouse interactions are enabled */
  isInteractive: boolean;
  /** Handler for mouse down event */
  onMouseDown: (e: React.MouseEvent) => void;
}

/**
 * TextElement - Draggable text component for headlines and subheadlines
 *
 * Renders styled text that can be dragged to reposition.
 * Supports HTML content for rich text formatting.
 *
 * @param props - Component props
 *
 * @example
 * <TextElement
 *   type="headline"
 *   content="<b>Welcome</b>"
 *   x={50}
 *   y={10}
 *   width={80}
 *   fontSize={24}
 *   color="#ffffff"
 *   fontFamily="Inter"
 *   isSelected={true}
 *   isInteractive={true}
 *   onMouseDown={handleMouseDown}
 * />
 */
export const TextElement = ({
  type,
  content,
  x,
  y,
  width,
  fontSize,
  color,
  fontFamily,
  isSelected,
  isInteractive,
  onMouseDown,
}: TextElementProps) => {
  const isHeadline = type === "headline";

  return (
    <div
      data-draggable-element={type}
      className={`absolute cursor-move text-center select-none whitespace-pre-wrap overflow-hidden ${
        isHeadline ? "font-bold" : "font-semibold"
      }`}
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: "translateX(-50%)",
        width: `${width}%`,
        maxWidth: `${width}%`,
        fontSize: `${fontSize}px`,
        lineHeight: 1.1,
        color,
        fontFamily: `'${fontFamily}', sans-serif`,
        wordWrap: "break-word",
        overflowWrap: "break-word",
        zIndex: Z_INDEX.text,
        padding: "4px",
        borderRadius: "4px",
        ...getTextSelectionStyles(isSelected),
      }}
      onMouseDown={isInteractive ? onMouseDown : undefined}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
};
