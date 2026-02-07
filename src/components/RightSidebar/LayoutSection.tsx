/**
 * LayoutSection Component
 *
 * Device layout and sizing controls including 2D/3D style toggle.
 */

import type { Screenshot, ShadowConfig } from "../../types";
import { SidebarSection } from "./SidebarSection";
import { RangeSlider } from "./RangeSlider";
import { ShadowControls } from "./ShadowControls";
import { SLIDER_RANGES, STYLES } from "./constants";

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
 * device style toggle (flat/3D), 3D rotation sliders,
 * text sizes, and shadow settings.
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

  const is3D = screenshot.deviceStyle === "3d";

  return (
    <SidebarSection title="Layout">
      <div className="space-y-3">
        {/* Device Style Toggle */}
        <div>
          <label className="block text-xs text-gray-400 mb-2">
            Device Style
          </label>
          <div className="flex gap-1 p-0.5 bg-[#2a2a2a] rounded-lg">
            <button
              className={`${STYLES.modeButton} ${!is3D ? STYLES.modeButtonActive : STYLES.modeButtonInactive}`}
              onClick={() => onUpdateScreenshot({ deviceStyle: "flat" })}
            >
              Flat
            </button>
            <button
              className={`${STYLES.modeButton} ${is3D ? STYLES.modeButtonActive : STYLES.modeButtonInactive}`}
              onClick={() => onUpdateScreenshot({ deviceStyle: "3d" })}
            >
              3D
            </button>
          </div>
        </div>

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

        {/* Show rotation for flat mode, 3D controls for 3D mode */}
        {is3D ? (
          <>
            <RangeSlider
              label="3D Rotate Y"
              value={screenshot.device3dRotateY}
              min={SLIDER_RANGES.device3dRotateY.min}
              max={SLIDER_RANGES.device3dRotateY.max}
              unit="°"
              onChange={(v) => onUpdateScreenshot({ device3dRotateY: v })}
            />
            <RangeSlider
              label="3D Rotate X"
              value={screenshot.device3dRotateX}
              min={SLIDER_RANGES.device3dRotateX.min}
              max={SLIDER_RANGES.device3dRotateX.max}
              unit="°"
              onChange={(v) => onUpdateScreenshot({ device3dRotateX: v })}
            />
          </>
        ) : (
          <RangeSlider
            label="Device Rotation"
            value={screenshot.deviceRotation}
            min={SLIDER_RANGES.deviceRotation.min}
            max={SLIDER_RANGES.deviceRotation.max}
            unit="°"
            onChange={(v) => onUpdateScreenshot({ deviceRotation: v })}
          />
        )}

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
