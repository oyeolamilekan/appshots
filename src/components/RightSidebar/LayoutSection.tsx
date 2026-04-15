/**
 * LayoutSection Component
 *
 * Device layout and sizing controls including 2D/3D style toggle.
 */

import type { DeviceInstance, Screenshot, ShadowConfig } from "../../types";
import { SidebarSection } from "./SidebarSection";
import { RangeSlider } from "./RangeSlider";
import { ShadowControls } from "./ShadowControls";
import { SLIDER_RANGES, STYLES } from "./constants";

interface LayoutSectionProps {
  /** Active device data */
  device: DeviceInstance;
  /** Active screenshot for text width controls */
  screenshot: Screenshot;
  /** Headline font size */
  headlineFontSize: number;
  /** Subheadline font size */
  subheadlineFontSize: number;
  /** Update device handler */
  onUpdateDevice: (updates: Partial<DeviceInstance>) => void;
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
  device,
  screenshot,
  headlineFontSize,
  subheadlineFontSize,
  onUpdateDevice,
  onUpdateScreenshot,
  onHeadlineSizeChange,
  onSubheadlineSizeChange,
}: LayoutSectionProps) => {
  const handleShadowUpdate = (updates: Partial<ShadowConfig>) => {
    onUpdateDevice({
      shadow: { ...device.shadow, ...updates },
    });
  };

  const is3D = device.style === "3d";

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
              onClick={() => onUpdateDevice({ style: "flat" })}
            >
              Flat
            </button>
            <button
              className={`${STYLES.modeButton} ${is3D ? STYLES.modeButtonActive : STYLES.modeButtonInactive}`}
              onClick={() => onUpdateDevice({ style: "3d" })}
            >
              3D
            </button>
          </div>
        </div>

        <RangeSlider
          label="Device Size"
          value={device.scale}
          min={SLIDER_RANGES.deviceScale.min}
          max={SLIDER_RANGES.deviceScale.max}
          unit="%"
          onChange={(v) => onUpdateDevice({ scale: v })}
        />

        <RangeSlider
          label="Device Position"
          value={device.y}
          min={SLIDER_RANGES.devicePosition.min}
          max={SLIDER_RANGES.devicePosition.max}
          unit="%"
          onChange={(v) => onUpdateDevice({ y: v })}
        />

        {/* Show rotation for flat mode, 3D controls for 3D mode */}
        {is3D ? (
          <>
            <RangeSlider
              label="3D Rotate Y"
              value={device.rotateY}
              min={SLIDER_RANGES.device3dRotateY.min}
              max={SLIDER_RANGES.device3dRotateY.max}
              unit="°"
              onChange={(v) => onUpdateDevice({ rotateY: v })}
            />
            <RangeSlider
              label="3D Rotate X"
              value={device.rotateX}
              min={SLIDER_RANGES.device3dRotateX.min}
              max={SLIDER_RANGES.device3dRotateX.max}
              unit="°"
              onChange={(v) => onUpdateDevice({ rotateX: v })}
            />
          </>
        ) : (
          <RangeSlider
            label="Device Rotation"
            value={device.rotation}
            min={SLIDER_RANGES.deviceRotation.min}
            max={SLIDER_RANGES.deviceRotation.max}
            unit="°"
            onChange={(v) => onUpdateDevice({ rotation: v })}
          />
        )}

        <ShadowControls
          shadow={device.shadow}
          onToggle={() =>
            handleShadowUpdate({ enabled: !device.shadow.enabled })
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
