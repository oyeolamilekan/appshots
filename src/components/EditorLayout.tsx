import { LeftSidebar } from "./LeftSidebar";
import { RightSidebar } from "./RightSidebar";
import { CanvasPreview } from "./CanvasPreview";
import { FontPicker } from "./FontPicker";
import { useEditor } from "../context/EditorContext";
import { Star, X } from "lucide-react";
import { useState } from "react";

export const EditorLayout = () => {
  const {
    isFontPickerOpen,
    setIsFontPickerOpen,
    activeScreenshot,
    updateActiveScreenshot,
  } = useEditor();

  const [showBanner, setShowBanner] = useState(true);

  return (
    <div className="flex flex-col h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {showBanner && (
        <div className="flex items-center justify-center gap-2 bg-zinc-800 px-4 py-1.5 text-xs text-zinc-300 relative shrink-0">
          <Star size={12} className="text-yellow-400 fill-yellow-400" />
          <span>
            AppShots is open source —{" "}
            <a
              href="https://github.com/oyeolamilekan/appshots"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white underline underline-offset-2 hover:text-zinc-100"
            >
              Star us on GitHub
            </a>
          </span>
          <button
            onClick={() => setShowBanner(false)}
            className="absolute right-3 text-zinc-500 hover:text-zinc-300"
          >
            <X size={14} />
          </button>
        </div>
      )}
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        <CanvasPreview />
        <RightSidebar />
        <FontPicker
          isOpen={isFontPickerOpen}
          onClose={() => setIsFontPickerOpen(false)}
          selectedFontFamily={activeScreenshot.fontFamily}
          onSelect={(fontFamily: string) =>
            updateActiveScreenshot({ fontFamily })
          }
        />
      </div>
    </div>
  );
};
