/**
 * OverlayImageProperties Component
 *
 * Properties panel for selected overlay image.
 */

import { RangeSlider } from "./RangeSlider";
import { ShadowControls } from "./ShadowControls";
import { STYLES, SLIDER_RANGES } from "./constants";
import type { OverlayImagePropertiesProps } from "./types";

/**
 * OverlayImageProperties - Image property controls
 *
 * Size, rotation, layer position, and shadow settings.
 *
 * @param props - Component props
 */
export const OverlayImageProperties = ({
  image,
  onSizeChange,
  onRotationChange,
  onLayerChange,
  onShadowToggle,
  onShadowColorChange,
  onShadowBlurChange,
  onShadowOffsetYChange,
}: OverlayImagePropertiesProps) => (
  <div className={STYLES.propertiesPanel}>
    <RangeSlider
      label="Size"
      value={image.width}
      min={SLIDER_RANGES.imageSize.min}
      max={SLIDER_RANGES.imageSize.max}
      onChange={onSizeChange}
      showValue={false}
    />

    <RangeSlider
      label="Rotation"
      value={image.rotation ?? 0}
      min={SLIDER_RANGES.imageRotation.min}
      max={SLIDER_RANGES.imageRotation.max}
      unit="°"
      onChange={onRotationChange}
    />

    <div>
      <label className="block text-xs text-gray-400 mb-1">Layer Position</label>
      <div className="flex gap-1">
        <button
          onClick={() => onLayerChange("behind")}
          className={`${STYLES.modeButton} transition-colors ${
            image.layer === "behind"
              ? STYLES.modeButtonActive
              : "bg-[#333] text-gray-300 hover:bg-[#444]"
          }`}
        >
          Behind Device
        </button>
        <button
          onClick={() => onLayerChange("front")}
          className={`${STYLES.modeButton} transition-colors ${
            (image.layer ?? "front") === "front"
              ? STYLES.modeButtonActive
              : "bg-[#333] text-gray-300 hover:bg-[#444]"
          }`}
        >
          In Front
        </button>
      </div>
    </div>

    <ShadowControls
      shadow={image.shadow}
      onToggle={onShadowToggle}
      onColorChange={onShadowColorChange}
      onBlurChange={onShadowBlurChange}
      onOffsetYChange={onShadowOffsetYChange}
    />
  </div>
);
