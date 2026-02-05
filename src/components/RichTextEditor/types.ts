/**
 * RichTextEditor Types
 *
 * TypeScript interfaces and types for the RichTextEditor components.
 */

/**
 * Active formatting styles state
 */
export interface ActiveStyles {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  alignLeft: boolean;
  alignCenter: boolean;
  alignRight: boolean;
}

/**
 * Toolbar button configuration
 */
export interface ToolbarButtonConfig {
  /** Unique identifier */
  id: string;
  /** execCommand command name */
  command: string;
  /** Button title/tooltip */
  title: string;
  /** Key in ActiveStyles to check for active state */
  activeKey?: keyof ActiveStyles;
}

/**
 * Props for the main RichTextEditor component
 */
export interface RichTextEditorProps {
  /** HTML content value */
  value: string;
  /** Callback when content changes */
  onChange: (html: string) => void;
  /** Placeholder text when empty */
  placeholder?: string;
  /** Additional CSS classes */
  className?: string;
}
