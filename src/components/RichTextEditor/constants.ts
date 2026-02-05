/**
 * RichTextEditor Constants
 *
 * Configuration and style constants for the editor.
 */

import type { ActiveStyles } from "./types";

/**
 * Default active styles state
 */
export const DEFAULT_ACTIVE_STYLES: ActiveStyles = {
  bold: false,
  italic: false,
  underline: false,
  alignLeft: true,
  alignCenter: false,
  alignRight: false,
};

/**
 * Default text color
 */
export const DEFAULT_TEXT_COLOR = "#ffffff";

/**
 * Icon size for toolbar buttons
 */
export const ICON_SIZE = 16;

/**
 * CSS classes for consistent styling
 */
export const STYLES = {
  /** Container wrapper */
  container: "rounded-lg border border-white/10 bg-[#2a2a2a] overflow-hidden",

  /** Toolbar section */
  toolbar:
    "flex items-center gap-0.5 px-2 py-1.5 bg-[#1e1e1e] border-b border-white/10",

  /** Toolbar button base */
  toolbarButton: "p-1.5 rounded transition-colors",

  /** Toolbar button active state */
  toolbarButtonActive: "bg-blue-500/20 text-blue-400",

  /** Toolbar button inactive state */
  toolbarButtonInactive: "text-gray-400 hover:text-white hover:bg-white/10",

  /** Separator between button groups */
  separator: "w-px h-4 bg-white/10 mx-1",

  /** Editor content area */
  editor:
    "min-h-[80px] px-3 py-2 text-sm text-white outline-none [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-gray-500 [&:empty]:before:pointer-events-none",

  /** Placeholder text */
  placeholder: "absolute top-2 left-3 text-sm text-gray-500 pointer-events-none",
} as const;
