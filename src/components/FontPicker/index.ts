/**
 * FontPicker Module
 *
 * A modal component for browsing and selecting Google Fonts.
 * Provides search, preview, and category filtering.
 *
 * @module FontPicker
 *
 * @example
 * // Basic usage
 * import { FontPicker } from './components/FontPicker';
 *
 * <FontPicker
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   selectedFontFamily="Roboto"
 *   onSelect={handleFontSelect}
 * />
 *
 * @example
 * // Using individual components
 * import {
 *   FontCard,
 *   SearchInput,
 *   FontGrid,
 * } from './components/FontPicker';
 */

// Main component
export { FontPicker } from "./FontPicker";

// Sub-components
export { FontPickerHeader } from "./FontPickerHeader";
export { SearchInput } from "./SearchInput";
export { FontGrid } from "./FontGrid";
export { FontCard } from "./FontCard";
export { EmptyState } from "./EmptyState";
export { FontPickerFooter } from "./FontPickerFooter";

// Utilities and constants
export { PREVIEW_TEXT, STYLES } from "./constants";
export { filterFonts, getFontFamily } from "./utils";
