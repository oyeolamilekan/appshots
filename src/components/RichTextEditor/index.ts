/**
 * RichTextEditor Module
 *
 * A lightweight WYSIWYG rich text editor with formatting toolbar.
 * Supports text formatting, colors, and alignment.
 *
 * @module RichTextEditor
 *
 * @example
 * // Basic usage
 * import { RichTextEditor } from './components/RichTextEditor';
 *
 * <RichTextEditor
 *   value={content}
 *   onChange={setContent}
 *   placeholder="Enter text..."
 * />
 *
 * @example
 * // Using individual components
 * import {
 *   EditorToolbar,
 *   EditorContent,
 *   ToolbarButton,
 * } from './components/RichTextEditor';
 */

// Main component
export { RichTextEditor } from "./RichTextEditor";

// Sub-components
export { EditorToolbar } from "./EditorToolbar";
export { EditorContent } from "./EditorContent";
export { ToolbarButton } from "./ToolbarButton";
export { ToolbarSeparator } from "./ToolbarSeparator";
export { ColorPicker } from "./ColorPicker";

// Hook
export { useRichTextEditor } from "./useRichTextEditor";

// Types
export type { RichTextEditorProps, ActiveStyles, ToolbarButtonConfig } from "./types";

// Utilities and constants
export { DEFAULT_ACTIVE_STYLES, DEFAULT_TEXT_COLOR, ICON_SIZE, STYLES } from "./constants";
export { isContentEmpty, getActiveStyles, executeCommand } from "./utils";
