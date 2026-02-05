/**
 * RichTextEditor Component
 *
 * A lightweight rich text editor with formatting toolbar.
 *
 * Features:
 * - Bold, italic, underline formatting
 * - Text color selection
 * - Text alignment (left, center, right)
 * - Placeholder support
 * - Selection-aware toolbar state
 */

import type { RichTextEditorProps } from "./types";
import { STYLES } from "./constants";
import { useRichTextEditor } from "./useRichTextEditor";
import { EditorToolbar } from "./EditorToolbar";
import { EditorContent } from "./EditorContent";

/**
 * RichTextEditor - Lightweight WYSIWYG editor
 *
 * A simple rich text editor using contentEditable with a formatting toolbar.
 * Outputs HTML that can be used directly in the application.
 *
 * @param props - Component props
 * @param props.value - Controlled HTML value
 * @param props.onChange - Callback when content changes
 * @param props.placeholder - Placeholder text when empty
 * @param props.className - Additional CSS classes
 *
 * @example
 * const [content, setContent] = useState("");
 *
 * <RichTextEditor
 *   value={content}
 *   onChange={setContent}
 *   placeholder="Enter headline..."
 * />
 */
export const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Type something...",
  className = "",
}: RichTextEditorProps) => {
  const {
    editorRef,
    textColor,
    isEmpty,
    activeStyles,
    execCommand,
    handleInput,
    handleColorChange,
    triggerChange,
  } = useRichTextEditor({ value, onChange });

  return (
    <div className={`${STYLES.container} ${className}`}>
      <EditorToolbar
        activeStyles={activeStyles}
        textColor={textColor}
        onCommand={execCommand}
        onColorChange={handleColorChange}
      />
      <EditorContent
        editorRef={editorRef}
        placeholder={placeholder}
        isEmpty={isEmpty}
        onInput={handleInput}
        onBlur={triggerChange}
      />
    </div>
  );
};
