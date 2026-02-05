/**
 * SearchInput Component
 *
 * Search input field for filtering fonts.
 */

import { Search } from "lucide-react";
import { STYLES } from "./constants";

interface SearchInputProps {
  /** Current search query value */
  value: string;
  /** Handler for search query changes */
  onChange: (value: string) => void;
}

/**
 * SearchInput - Font search input with icon
 *
 * Auto-focused input field for searching through available fonts.
 *
 * @param props - Component props
 * @param props.value - Current search query
 * @param props.onChange - Handler called when query changes
 *
 * @example
 * <SearchInput
 *   value={searchQuery}
 *   onChange={setSearchQuery}
 * />
 */
export const SearchInput = ({ value, onChange }: SearchInputProps) => (
  <div className="p-4 border-b border-white/10 bg-[#1e1e1e]">
    <div className="relative">
      <Search
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={18}
      />
      <input
        type="text"
        placeholder="Search from all Google Fonts..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={STYLES.input}
        autoFocus
      />
    </div>
  </div>
);
