/**
 * BackgroundPicker Component
 *
 * Background mode and color/gradient/image selection.
 */

import { useRef } from "react";
import type { BackgroundMode, GradientPreset, Screenshot } from "../../types";
import { STYLES } from "./constants";

interface BackgroundControlsProps {
  label: string;
  mode: BackgroundMode;
  color: string;
  gradientPresetId: string | null;
  gradientPresets: GradientPreset[];
  imageSrc: string | null;
  onModeChange: (mode: BackgroundMode) => void;
  onColorChange: (color: string) => void;
  onGradientChange: (presetId: string) => void;
  onImageChange: (src: string | null) => void;
}

const readImageFile = (
  file: File,
  onLoad: (src: string) => void,
) => {
  const reader = new FileReader();
  reader.onload = () => {
    const result = reader.result;
    if (typeof result === "string") onLoad(result);
  };
  reader.readAsDataURL(file);
};

const BackgroundControls = ({
  label,
  mode,
  color,
  gradientPresetId,
  gradientPresets,
  imageSrc,
  onModeChange,
  onColorChange,
  onGradientChange,
  onImageChange,
}: BackgroundControlsProps) => {
  const imageInputRef = useRef<HTMLInputElement>(null);

  return (
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
          <button
            onClick={() => onModeChange("image")}
            className={`${STYLES.modeButton} ${
              mode === "image" ? STYLES.modeButtonActive : STYLES.modeButtonInactive
            }`}
          >
            Image
          </button>
        </div>

        {mode === "solid" ? (
          <input
            type="color"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            className={STYLES.colorInput}
          />
        ) : mode === "gradient" ? (
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
        ) : (
          <div className="space-y-2">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) readImageFile(file, onImageChange);
                event.target.value = "";
              }}
            />
            {imageSrc && (
              <img
                src={imageSrc}
                alt="Background"
                className="h-16 w-full rounded-md object-cover"
              />
            )}
            <button
              onClick={() => imageInputRef.current?.click()}
              className={STYLES.uploadButton}
            >
              {imageSrc ? "Change Image" : "Upload Image"}
            </button>
            {imageSrc && (
              <button
                onClick={() => onImageChange(null)}
                className={STYLES.uploadButton}
              >
                Remove Image
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

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
 * Toggle between solid color, gradient, and image backgrounds.
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
        imageSrc={screenshot.backgroundImageSrc}
        onModeChange={(backgroundMode) => onUpdateScreenshot({ backgroundMode })}
        onColorChange={(backgroundColor) =>
          onUpdateScreenshot({ backgroundColor })
        }
        onGradientChange={(gradientPresetId) =>
          onUpdateScreenshot({ gradientPresetId })
        }
        onImageChange={(backgroundImageSrc) =>
          onUpdateScreenshot({ backgroundImageSrc })
        }
      />
      <BackgroundControls
        label="Dark Background"
        mode={screenshot.backgroundModeDark}
        color={screenshot.backgroundColorDark}
        gradientPresetId={screenshot.gradientPresetIdDark}
        gradientPresets={gradientPresets}
        imageSrc={screenshot.backgroundImageSrcDark}
        onModeChange={(backgroundModeDark) =>
          onUpdateScreenshot({ backgroundModeDark })
        }
        onColorChange={(backgroundColorDark) =>
          onUpdateScreenshot({ backgroundColorDark })
        }
        onGradientChange={(gradientPresetIdDark) =>
          onUpdateScreenshot({ gradientPresetIdDark })
        }
        onImageChange={(backgroundImageSrcDark) =>
          onUpdateScreenshot({ backgroundImageSrcDark })
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
      imageSrc={screenshot.backgroundImageSrc}
      onModeChange={(backgroundMode) => onUpdateScreenshot({ backgroundMode })}
      onColorChange={(backgroundColor) => onUpdateScreenshot({ backgroundColor })}
      onGradientChange={(gradientPresetId) =>
        onUpdateScreenshot({ gradientPresetId })
      }
      onImageChange={(backgroundImageSrc) =>
        onUpdateScreenshot({ backgroundImageSrc })
      }
    />
  );
