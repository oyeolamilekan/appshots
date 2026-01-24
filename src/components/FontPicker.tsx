import { useState, useMemo } from "react";
import { X, Search } from "lucide-react";
import { googleFonts } from "../lib/google-fonts";

interface FontPickerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFontFamily: string;
  onSelect: (fontFamily: string) => void;
}

export const FontPicker = ({
  isOpen,
  onClose,
  selectedFontFamily,
  onSelect,
}: FontPickerProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFonts = useMemo(() => {
    if (!searchQuery) return googleFonts;
    const query = searchQuery.toLowerCase();
    return googleFonts.filter((font) =>
      font.family.toLowerCase().includes(query),
    );
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl bg-[#1e1e1e] rounded-xl shadow-2xl flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200 border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-semibold text-white">
            Select a Google Font
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
            aria-label="Close font picker"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-white/10 bg-[#1e1e1e]">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search from all Google Fonts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#2a2a2a] text-white pl-10 pr-4 py-3 rounded-lg border border-white/10 focus:border-white focus:ring-1 focus:ring-white outline-none transition-all placeholder:text-gray-500"
              autoFocus
            />
          </div>
        </div>

        {/* Font Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFonts.map((font) => (
              <button
                key={font.family}
                onClick={() => {
                  onSelect(font.family);
                  onClose();
                }}
                className={`group flex flex-col p-4 rounded-lg border text-left transition-all hover:border-white hover:bg-[#2a2a2a] ${
                  selectedFontFamily === font.family
                    ? "border-white bg-[#2a2a2a] ring-1 ring-white"
                    : "border-white/10 bg-[#141414]"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <span className="font-medium text-gray-200 group-hover:text-white">
                    {font.family}
                  </span>
                  <span className="text-xs text-gray-500 font-mono border border-white/10 px-2 py-0.5 rounded-full">
                    {font.category}
                  </span>
                </div>
                <p
                  className="text-2xl text-gray-400 group-hover:text-white truncate w-full"
                  style={{ fontFamily: `"${font.family}", ${font.category}` }}
                >
                  The quick brown fox jumps over the lazy dog
                </p>
              </button>
            ))}

            {filteredFonts.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500 flex flex-col items-center gap-2">
                <p>No fonts found matching "{searchQuery}"</p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-neutral-400 hover:text-neutral-300 text-sm"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex justify-end bg-[#1e1e1e] rounded-b-xl">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] text-white rounded-md transition-colors text-sm font-medium border border-white/10"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
