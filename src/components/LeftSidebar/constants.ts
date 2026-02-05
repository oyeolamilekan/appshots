/**
 * LeftSidebar Constants
 *
 * Style constants used across LeftSidebar components.
 */

/**
 * CSS classes for consistent styling
 */
export const STYLES = {
  /** Sidebar container */
  sidebar: "w-72 shrink-0 border-r border-white/10 bg-[#141414] flex flex-col",

  /** Header section */
  header: "p-4 border-b border-white/10",

  /** Content area */
  content: "flex-1 overflow-y-auto p-4 space-y-4",

  /** Section container */
  section: "rounded-lg bg-[#1e1e1e] p-3",

  /** Section title */
  sectionTitle:
    "text-xs font-medium text-gray-300 uppercase tracking-wider mb-3",

  /** Button list container */
  buttonList: "space-y-2",

  /** Selection button base */
  selectionButton: "w-full rounded-md px-3 py-2 text-left text-sm transition-colors",

  /** Selection button active state */
  selectionButtonActive: "bg-white text-black",

  /** Selection button inactive state */
  selectionButtonInactive: "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]",

  /** Color picker container */
  colorPicker: "flex flex-wrap gap-2",

  /** Color button base */
  colorButton: "w-7 h-7 rounded-full border-2 transition-all",

  /** Color button active state */
  colorButtonActive: "border-white scale-110",

  /** Color button inactive state */
  colorButtonInactive: "border-transparent",

  /** Primary action button */
  primaryButton:
    "w-full mt-3 bg-white hover:bg-neutral-200 text-black font-medium py-2.5 rounded-lg transition-colors",
} as const;
