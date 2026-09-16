/**
 * BackgroundPicker Component
 *
 * Background mode and color/gradient selection.
 */

import type { BackgroundMode, GradientPreset, Screenshot } from "../../types";
import { STYLES } from "./constants";

interface BackgroundControlsProps {
  label: string;
  mode: BackgroundMode;
  color: string;
  gradientPresetId: string | null;
  gradientPresets: GradientPreset[];
  onModeChange: (mode: BackgroundMode) => void;
  onColorChange: (color: string) => void;
  onGradientChange: (presetId: string) => void;
}

const BackgroundControls = ({
  label,
  mode,
  color,
  gradientPresetId,
  gradientPresets,
  onModeChange,
  onColorChange,
  onGradientChange,
}: BackgroundControlsProps) => (
  <div>
    <label className="block text-xs text-gray-400 mb-1">{label}</label>
    <div className="space-y-2">
      <div className="flex gap-2">
        <button
          onClick={() => onModeChange("solid")}
          className={`${STYLES.modeButton} ${
            mode === "solid" ? STYLES.modeButtonActive : STYLES.modeButtonInactive
          }`}
        >
          Solid
        </button>
        <button
          onClick={() => onModeChange("gradient")}
          className={`${STYLES.modeButton} ${
            mode === "gradient"
              ? STYLES.modeButtonActive
              : STYLES.modeButtonInactive
          }`}
        >
          Gradient
        </button>
      </div>

      {mode === "solid" ? (
        <input
          type="color"
          value={color}
          onChange={(e) => onColorChange(e.target.value)}
          className={STYLES.colorInput}
        />
      ) : (
        <div className="grid grid-cols-3 gap-1">
          {gradientPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onGradientChange(preset.id)}
              className={`${STYLES.gradientButton} ${
                gradientPresetId === preset.id ? STYLES.gradientButtonActive : ""
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
 * When light/dark split is enabled, both sides are edited independently.
 */
export const BackgroundPicker = ({
  screenshot,
  gradientPresets,
  onUpdateScreenshot,
}: BackgroundPickerProps) =>
  screenshot.themeSplit ? (
    <div className="space-y-3">
      <BackgroundControls
        label="Light Background"
        mode={screenshot.backgroundMode}
        color={screenshot.backgroundColor}
        gradientPresetId={screenshot.gradientPresetId}
        gradientPresets={gradientPresets}
        onModeChange={(backgroundMode) => onUpdateScreenshot({ backgroundMode })}
        onColorChange={(backgroundColor) =>
          onUpdateScreenshot({ backgroundColor })
        }
        onGradientChange={(gradientPresetId) =>
          onUpdateScreenshot({ gradientPresetId })
        }
      />
      <BackgroundControls
        label="Dark Background"
        mode={screenshot.backgroundModeDark}
        color={screenshot.backgroundColorDark}
        gradientPresetId={screenshot.gradientPresetIdDark}
        gradientPresets={gradientPresets}
        onModeChange={(backgroundModeDark) =>
          onUpdateScreenshot({ backgroundModeDark })
        }
        onColorChange={(backgroundColorDark) =>
          onUpdateScreenshot({ backgroundColorDark })
        }
        onGradientChange={(gradientPresetIdDark) =>
          onUpdateScreenshot({ gradientPresetIdDark })
        }
      />
    </div>
  ) : (
    <BackgroundControls
      label="Background"
      mode={screenshot.backgroundMode}
      color={screenshot.backgroundColor}
      gradientPresetId={screenshot.gradientPresetId}
      gradientPresets={gradientPresets}
      onModeChange={(backgroundMode) => onUpdateScreenshot({ backgroundMode })}
      onColorChange={(backgroundColor) => onUpdateScreenshot({ backgroundColor })}
      onGradientChange={(gradientPresetId) =>
        onUpdateScreenshot({ gradientPresetId })
      }
    />
  );
