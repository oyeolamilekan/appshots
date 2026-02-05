/**
 * AppearanceSection Component
 *
 * Visual appearance controls including background, text color, font, and screenshot image.
 */

import type { RefObject } from "react";
import { ChevronDown } from "lucide-react";
import type { Screenshot, GradientPreset } from "../../types";
import { SidebarSection } from "./SidebarSection";
import { BackgroundPicker } from "./BackgroundPicker";
import { STYLES } from "./constants";

interface AppearanceSectionProps {
  /** Active screenshot data */
  screenshot: Screenshot;
  /** Available gradient presets */
  gradientPresets: GradientPreset[];
  /** File input ref for screenshot upload */
  fileInputRef: RefObject<HTMLInputElement | null>;
  /** Update screenshot handler */
  onUpdateScreenshot: (updates: Partial<Screenshot>) => void;
  /** Open font picker handler */
  onOpenFontPicker: () => void;
  /** File upload handler */
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * AppearanceSection - Visual appearance controls
 *
 * Background, text color, font, and screenshot image settings.
 *
 * @param props - Component props
 */
export const AppearanceSection = ({
  screenshot,
  gradientPresets,
  fileInputRef,
  onUpdateScreenshot,
  onOpenFontPicker,
  onFileUpload,
}: AppearanceSectionProps) => (
  <SidebarSection title="Appearance">
    <div className="space-y-4">
      {/* Background */}
      <BackgroundPicker
        screenshot={screenshot}
        gradientPresets={gradientPresets}
        onUpdateScreenshot={onUpdateScreenshot}
      />

      {/* Text Color */}
      <div>
        <label className="block text-xs text-gray-400 mb-1">Text Color</label>
        <input
          type="color"
          value={screenshot.textColor}
          onChange={(e) => onUpdateScreenshot({ textColor: e.target.value })}
          className={STYLES.colorInput}
        />
      </div>

      {/* Font Style */}
      <div>
        <label className="block text-xs text-gray-400 mb-1">Font Style</label>
        <button onClick={onOpenFontPicker} className={STYLES.dropdownButton}>
          <span style={{ fontFamily: `'${screenshot.fontFamily}', sans-serif` }}>
            {screenshot.fontFamily}
          </span>
          <ChevronDown size={16} className="text-gray-400" />
        </button>
      </div>

      {/* Screenshot Image */}
      <div>
        <label className="block text-xs text-gray-400 mb-1">
          Screenshot Image
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onFileUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className={STYLES.uploadButton}
        >
          {screenshot.screenshotSrc ? "Change Image" : "Upload Image"}
        </button>
      </div>
    </div>
  </SidebarSection>
);
