/**
 * EditorContent Component
 *
 * Contenteditable area for text input.
 */

import type { RefObject } from "react";
import { STYLES } from "./constants";

interface EditorContentProps {
  /** Ref for the contenteditable element */
  editorRef: RefObject<HTMLDivElement | null>;
  /** Placeholder text */
  placeholder: string;
  /** Whether the editor is empty */
  isEmpty: boolean;
  /** Input change handler */
  onInput: () => void;
  /** Blur handler */
  onBlur: () => void;
}

/**
 * EditorContent - Contenteditable text area
 *
 * The main editing area where users type and format text.
 * Shows placeholder when empty.
 *
 * @param props - Component props
 *
 * @example
 * <EditorContent
 *   editorRef={editorRef}
 *   placeholder="Type something..."
 *   isEmpty={isEmpty}
 *   onInput={handleInput}
 *   onBlur={triggerChange}
 * />
 */
export const EditorContent = ({
  editorRef,
  placeholder,
  isEmpty,
  onInput,
  onBlur,
}: EditorContentProps) => (
  <div className="relative">
    <div
      ref={editorRef}
      contentEditable
      suppressContentEditableWarning
      onInput={onInput}
      onBlur={onBlur}
      className={STYLES.editor}
      data-placeholder={placeholder}
      style={{ fontFamily: "Inter, system-ui, sans-serif" }}
    />
    {/* Fallback placeholder for browsers that don't support :empty */}
    {isEmpty && !editorRef.current?.innerHTML && (
      <div className={STYLES.placeholder}>{placeholder}</div>
    )}
  </div>
);
