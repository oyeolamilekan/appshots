/**
 * LayoutSection Component
 *
 * Device layout and sizing controls.
 */

import type { Screenshot, ShadowConfig } from "../../types";
import { SidebarSection } from "./SidebarSection";
import { RangeSlider } from "./RangeSlider";
import { ShadowControls } from "./ShadowControls";
import { SLIDER_RANGES } from "./constants";

interface LayoutSectionProps {
  /** Active screenshot data */
  screenshot: Screenshot;
  /** Headline font size */
  headlineFontSize: number;
  /** Subheadline font size */
  subheadlineFontSize: number;
  /** Update screenshot handler */
  onUpdateScreenshot: (updates: Partial<Screenshot>) => void;
  /** Set headline font size handler */
  onHeadlineSizeChange: (size: number) => void;
  /** Set subheadline font size handler */
  onSubheadlineSizeChange: (size: number) => void;
}

/**
 * LayoutSection - Device and text layout controls
 *
 * Contains sliders for device size, position, rotation,
 * text sizes, and shadow settings.
 *
 * @param props - Component props
 */
export const LayoutSection = ({
  screenshot,
  headlineFontSize,
  subheadlineFontSize,
  onUpdateScreenshot,
  onHeadlineSizeChange,
  onSubheadlineSizeChange,
}: LayoutSectionProps) => {
  const handleShadowUpdate = (updates: Partial<ShadowConfig>) => {
    onUpdateScreenshot({
      deviceShadow: { ...screenshot.deviceShadow, ...updates },
    });
  };

  return (
    <SidebarSection title="Layout">
      <div className="space-y-3">
        <RangeSlider
          label="Device Size"
          value={screenshot.deviceScale}
          min={SLIDER_RANGES.deviceScale.min}
          max={SLIDER_RANGES.deviceScale.max}
          unit="%"
          onChange={(v) => onUpdateScreenshot({ deviceScale: v })}
        />

        <RangeSlider
          label="Device Position"
          value={screenshot.deviceOffsetY}
          min={SLIDER_RANGES.devicePosition.min}
          max={SLIDER_RANGES.devicePosition.max}
          unit="%"
          onChange={(v) => onUpdateScreenshot({ deviceOffsetY: v })}
        />

        <RangeSlider
          label="Device Rotation"
          value={screenshot.deviceRotation}
          min={SLIDER_RANGES.deviceRotation.min}
          max={SLIDER_RANGES.deviceRotation.max}
          unit="°"
          onChange={(v) => onUpdateScreenshot({ deviceRotation: v })}
        />

        <ShadowControls
          shadow={screenshot.deviceShadow}
          onToggle={() =>
            handleShadowUpdate({ enabled: !screenshot.deviceShadow.enabled })
          }
          onColorChange={(color) => handleShadowUpdate({ color })}
          onBlurChange={(blur) => handleShadowUpdate({ blur })}
          onOffsetYChange={(offsetY) => handleShadowUpdate({ offsetY })}
        />

        <RangeSlider
          label="Headline Size"
          value={headlineFontSize}
          min={SLIDER_RANGES.headlineSize.min}
          max={SLIDER_RANGES.headlineSize.max}
          unit="px"
          onChange={onHeadlineSizeChange}
        />

        <RangeSlider
          label="Subheadline Size"
          value={subheadlineFontSize}
          min={SLIDER_RANGES.subheadlineSize.min}
          max={SLIDER_RANGES.subheadlineSize.max}
          unit="px"
          onChange={onSubheadlineSizeChange}
        />

        <label className="block">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-400">Headline Width</span>
            <span className="text-xs text-neutral-400 font-medium">
              {screenshot.headlineWidth}%
            </span>
          </div>
          <input
            type="range"
            min={SLIDER_RANGES.textWidth.min}
            max={SLIDER_RANGES.textWidth.max}
            step={SLIDER_RANGES.textWidth.step}
            value={screenshot.headlineWidth}
            onChange={(e) =>
              onUpdateScreenshot({ headlineWidth: Number(e.target.value) })
            }
            className="w-full accent-white h-2 rounded-lg appearance-none cursor-pointer bg-[#2a2a2a]"
          />
        </label>

        <label className="block">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-400">Subheadline Width</span>
            <span className="text-xs text-neutral-400 font-medium">
              {screenshot.subheadlineWidth}%
            </span>
          </div>
          <input
            type="range"
            min={SLIDER_RANGES.textWidth.min}
            max={SLIDER_RANGES.textWidth.max}
            step={SLIDER_RANGES.textWidth.step}
            value={screenshot.subheadlineWidth}
            onChange={(e) =>
              onUpdateScreenshot({ subheadlineWidth: Number(e.target.value) })
            }
            className="w-full accent-white h-2 rounded-lg appearance-none cursor-pointer bg-[#2a2a2a]"
          />
        </label>
      </div>
    </SidebarSection>
  );
};
