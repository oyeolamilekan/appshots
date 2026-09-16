/**
 * AppearanceSection Component
 *
 * Visual appearance controls including background, text color, font, and screenshot image.
 */

import { ChevronDown } from "lucide-react";
import type { Screenshot, GradientPreset } from "../../types";
import { SidebarSection } from "./SidebarSection";
import { BackgroundPicker } from "./BackgroundPicker";
import { Toggle } from "./Toggle";
import { RangeSlider } from "./RangeSlider";
import { SLIDER_RANGES, STYLES } from "./constants";

interface AppearanceSectionProps {
  /** Active screenshot data */
  screenshot: Screenshot;
  /** Available gradient presets */
  gradientPresets: GradientPreset[];
  /** Update screenshot handler */
  onUpdateScreenshot: (updates: Partial<Screenshot>) => void;
  /** Open font picker handler */
  onOpenFontPicker: () => void;
}

/**
 * AppearanceSection - Visual appearance controls
 *
 * Background, text color, font, and screenshot image settings.
 */
export const AppearanceSection = ({
  screenshot,
  gradientPresets,
  onUpdateScreenshot,
  onOpenFontPicker,
}: AppearanceSectionProps) => (
  <SidebarSection title="Appearance">
    <div className="space-y-4">
      <Toggle
        label="Light / Dark Split"
        enabled={screenshot.themeSplit}
        onChange={(themeSplit) => onUpdateScreenshot({ themeSplit })}
      />

      {screenshot.themeSplit && (
        <div className="space-y-3">
          <RangeSlider
            label="Split Angle"
            value={screenshot.themeSplitAngle}
            min={SLIDER_RANGES.splitAngle.min}
            max={SLIDER_RANGES.splitAngle.max}
            unit="°"
            onChange={(themeSplitAngle) => onUpdateScreenshot({ themeSplitAngle })}
          />
          <RangeSlider
            label="Split Offset"
            value={screenshot.themeSplitOffset}
            min={SLIDER_RANGES.splitOffset.min}
            max={SLIDER_RANGES.splitOffset.max}
            unit="%"
            onChange={(themeSplitOffset) =>
              onUpdateScreenshot({ themeSplitOffset })
            }
          />
        </div>
      )}

      <BackgroundPicker
        screenshot={screenshot}
        gradientPresets={gradientPresets}
        onUpdateScreenshot={onUpdateScreenshot}
      />

      <div>
        <label className="block text-xs text-gray-400 mb-1">Text Color</label>
        <input
          type="color"
          value={screenshot.textColor}
          onChange={(e) => onUpdateScreenshot({ textColor: e.target.value })}
          className={STYLES.colorInput}
        />
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1">Font Style</label>
        <button onClick={onOpenFontPicker} className={STYLES.dropdownButton}>
          <span style={{ fontFamily: `'${screenshot.fontFamily}', sans-serif` }}>
            {screenshot.fontFamily}
          </span>
          <ChevronDown size={16} className="text-gray-400" />
        </button>
      </div>
    </div>
  </SidebarSection>
);
