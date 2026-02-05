/**
 * BackgroundPicker Component
 *
 * Background mode and color/gradient selection.
 */

import type { Screenshot, GradientPreset } from "../../types";
import { STYLES } from "./constants";

interface BackgroundPickerProps {
  /** Active screenshot data */
  screenshot: Screenshot;
  /** Available gradient presets */
  gradientPresets: GradientPreset[];
  /** Update screenshot handler */
  onUpdateScreenshot: (updates: Partial<Screenshot>) => void;
}

/**
 * BackgroundPicker - Background style selector
 *
 * Toggle between solid color and gradient backgrounds.
 *
 * @param props - Component props
 */
export const BackgroundPicker = ({
  screenshot,
  gradientPresets,
  onUpdateScreenshot,
}: BackgroundPickerProps) => (
  <div>
    <label className="block text-xs text-gray-400 mb-1">Background</label>
    <div className="space-y-2">
      {/* Mode toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => onUpdateScreenshot({ backgroundMode: "solid" })}
          className={`${STYLES.modeButton} ${
            screenshot.backgroundMode === "solid"
              ? STYLES.modeButtonActive
              : STYLES.modeButtonInactive
          }`}
        >
          Solid
        </button>
        <button
          onClick={() => onUpdateScreenshot({ backgroundMode: "gradient" })}
          className={`${STYLES.modeButton} ${
            screenshot.backgroundMode === "gradient"
              ? STYLES.modeButtonActive
              : STYLES.modeButtonInactive
          }`}
        >
          Gradient
        </button>
      </div>

      {/* Color picker or gradient presets */}
      {screenshot.backgroundMode === "solid" ? (
        <input
          type="color"
          value={screenshot.backgroundColor}
          onChange={(e) =>
            onUpdateScreenshot({ backgroundColor: e.target.value })
          }
          className={STYLES.colorInput}
        />
      ) : (
        <div className="grid grid-cols-3 gap-1">
          {gradientPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onUpdateScreenshot({ gradientPresetId: preset.id })}
              className={`${STYLES.gradientButton} ${
                screenshot.gradientPresetId === preset.id
                  ? STYLES.gradientButtonActive
                  : ""
              }`}
              style={{
                background: `linear-gradient(135deg, ${preset.from}, ${preset.to})`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  </div>
);
