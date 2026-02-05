/**
 * EmptyState Component
 *
 * Displayed when no fonts match the search query.
 */

interface EmptyStateProps {
  /** The search query that returned no results */
  searchQuery: string;
  /** Handler to clear the search */
  onClearSearch: () => void;
}

/**
 * EmptyState - No results message with clear button
 *
 * Shows a friendly message when search returns no fonts,
 * with option to clear the search query.
 *
 * @param props - Component props
 * @param props.searchQuery - Current search query
 * @param props.onClearSearch - Handler to clear search
 *
 * @example
 * <EmptyState
 *   searchQuery="xyz123"
 *   onClearSearch={() => setSearchQuery("")}
 * />
 */
export const EmptyState = ({ searchQuery, onClearSearch }: EmptyStateProps) => (
  <div className="col-span-full py-12 text-center text-gray-500 flex flex-col items-center gap-2">
    <p>No fonts found matching "{searchQuery}"</p>
    <button
      onClick={onClearSearch}
      className="text-neutral-400 hover:text-neutral-300 text-sm"
    >
      Clear search
    </button>
  </div>
);
