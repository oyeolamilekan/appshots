import { Seo } from "./Seo";
import { LeftSidebar } from "./LeftSidebar";
import { RightSidebar } from "./RightSidebar";
import { CanvasPreview } from "./CanvasPreview";
import { FontPicker } from "./FontPicker";
import { useEditor } from "../context/EditorContext";

export const EditorLayout = () => {
  const {
    isFontPickerOpen,
    setIsFontPickerOpen,
    activeScreenshot,
    updateActiveScreenshot,
  } = useEditor();

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
      <Seo
        title="iOS App Store Screenshot Generator"
        description="Create stunning, high-converting screenshots for the Apple App Store in minutes. Free tool for iOS developers to design professional app previews."
      />
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
  );
};
