/**
 * ShadowControls Component
 *
 * Controls for configuring shadow effects.
 */

import { Toggle } from "./Toggle";
import { RangeSlider } from "./RangeSlider";
import { STYLES, SLIDER_RANGES } from "./constants";
import type { ShadowControlsProps } from "./types";

/**
 * ShadowControls - Shadow configuration panel
 *
 * Toggle and sliders for shadow color, blur, and offset.
 *
 * @param props - Component props
 *
 * @example
 * <ShadowControls
 *   shadow={deviceShadow}
 *   onToggle={() => toggleShadow()}
 *   onColorChange={(c) => setShadowColor(c)}
 *   onBlurChange={(b) => setShadowBlur(b)}
 *   onOffsetYChange={(y) => setShadowOffsetY(y)}
 * />
 */
export const ShadowControls = ({
  shadow,
  onToggle,
  onColorChange,
  onBlurChange,
  onOffsetYChange,
}: ShadowControlsProps) => (
  <div className="space-y-2 pt-2 border-t border-white/10">
    <Toggle label="Shadow" enabled={shadow.enabled} onChange={onToggle} />

    {shadow.enabled && (
      <>
        <div className="flex items-center gap-2">
          <span className={STYLES.labelSmall}>Color</span>
          <input
            type="color"
            value={shadow.color}
            onChange={(e) => onColorChange(e.target.value)}
            className={STYLES.colorInputSmall}
          />
        </div>

        <RangeSlider
          label="Blur"
          value={shadow.blur}
          min={SLIDER_RANGES.shadowBlur.min}
          max={SLIDER_RANGES.shadowBlur.max}
          unit="px"
          onChange={onBlurChange}
        />

        <RangeSlider
          label="Offset Y"
          value={shadow.offsetY}
          min={SLIDER_RANGES.shadowOffset.min}
          max={SLIDER_RANGES.shadowOffset.max}
          unit="px"
          onChange={onOffsetYChange}
        />
      </>
    )}
  </div>
);
