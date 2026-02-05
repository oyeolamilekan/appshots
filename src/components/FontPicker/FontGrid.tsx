/**
 * FontGrid Component
 *
 * Scrollable grid displaying all filtered fonts.
 */

import type { FontConfig } from "../../lib/google-fonts";
import { FontCard } from "./FontCard";
import { EmptyState } from "./EmptyState";

interface FontGridProps {
  /** Array of fonts to display */
  fonts: FontConfig[];
  /** Currently selected font family name */
  selectedFontFamily: string;
  /** Current search query (for empty state) */
  searchQuery: string;
  /** Handler for font selection */
  onSelect: (fontFamily: string) => void;
  /** Handler to clear search */
  onClearSearch: () => void;
}

/**
 * FontGrid - Scrollable grid of font cards
 *
 * Displays fonts in a responsive 2-column grid with scrolling.
 * Shows empty state when no fonts match the search.
 *
 * @param props - Component props
 * @param props.fonts - Filtered array of fonts to display
 * @param props.selectedFontFamily - Currently selected font
 * @param props.searchQuery - Current search query
 * @param props.onSelect - Handler called when a font is selected
 * @param props.onClearSearch - Handler to clear search query
 *
 * @example
 * <FontGrid
 *   fonts={filteredFonts}
 *   selectedFontFamily="Roboto"
 *   searchQuery={query}
 *   onSelect={handleFontSelect}
 *   onClearSearch={() => setQuery("")}
 * />
 */
export const FontGrid = ({
  fonts,
  selectedFontFamily,
  searchQuery,
  onSelect,
  onClearSearch,
}: FontGridProps) => (
  <div className="flex-1 overflow-y-auto p-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fonts.map((font) => (
        <FontCard
          key={font.family}
          font={font}
          isSelected={selectedFontFamily === font.family}
          onSelect={() => onSelect(font.family)}
        />
      ))}

      {fonts.length === 0 && (
        <EmptyState searchQuery={searchQuery} onClearSearch={onClearSearch} />
      )}
    </div>
  </div>
);
