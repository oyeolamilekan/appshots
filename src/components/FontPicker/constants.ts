/**
 * FontPicker Constants
 *
 * Style constants and configuration values used across FontPicker components.
 */

/**
 * Sample text displayed in font previews
 */
export const PREVIEW_TEXT = "The quick brown fox jumps over the lazy dog";

/**
 * Common CSS classes for consistent styling
 */
export const STYLES = {
  /** Modal backdrop */
  backdrop:
    "fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200",

  /** Modal container */
  modal:
    "w-full max-w-4xl bg-[#1e1e1e] rounded-xl shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200 border border-white/10",

  /** Section backgrounds */
  sectionBg: "bg-[#1e1e1e]",

  /** Input field base */
  input:
    "w-full bg-[#2a2a2a] text-white pl-10 pr-4 py-3 rounded-lg border border-white/10 focus:border-white focus:ring-1 focus:ring-white outline-none transition-all placeholder:text-gray-500",

  /** Icon button */
  iconButton:
    "p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white",

  /** Cancel button */
  cancelButton:
    "px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] text-white rounded-md transition-colors text-sm font-medium border border-white/10",
} as const;
