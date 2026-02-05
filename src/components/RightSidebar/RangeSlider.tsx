/**
 * RangeSlider Component
 *
 * Labeled range input slider.
 */

import { STYLES } from "./constants";
import type { RangeSliderProps } from "./types";

/**
 * RangeSlider - Range input with label and value display
 *
 * @param props - Component props
 *
 * @example
 * <RangeSlider
 *   label="Device Size"
 *   value={80}
 *   min={40}
 *   max={90}
 *   unit="%"
 *   onChange={(v) => setDeviceSize(v)}
 * />
 */
export const RangeSlider = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
  showValue = true,
}: RangeSliderProps) => (
  <label className="block">
    <span className={STYLES.label}>
      {label}
      {showValue && `: ${value}${unit}`}
    </span>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={STYLES.rangeSlider}
    />
  </label>
);
