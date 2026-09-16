/**
 * DecorationPicker Component
 *
 * Blob/wave background decoration style, opacity, scale, and color.
 */

import type { DecorationPresetId, Screenshot } from "../../types";
import {
  decorationPresets,
  deriveDecorationColors,
  getDecorationBaseColor,
} from "../../lib/background-decorations";
import { RangeSlider } from "./RangeSlider";
import { Toggle } from "./Toggle";
import { SLIDER_RANGES, STYLES } from "./constants";

interface DecorationPickerProps {
  screenshot: Screenshot;
  onUpdateScreenshot: (updates: Partial<Screenshot>) => void;
}

const DecorationThumbnail = ({
  presetId,
  fill,
  stroke,
}: {
  presetId: DecorationPresetId;
  fill: string;
  stroke: string;
}) => {
  const shapes =
    decorationPresets.find((preset) => preset.id === presetId)?.shapes ?? [];

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="h-full w-full"
      aria-hidden="true"
    >
      {shapes.map((shape, index) =>
        shape.kind === "fill" ? (
          <path key={index} d={shape.d} fill={fill} opacity={shape.opacity} />
        ) : (
          <path
            key={index}
            d={shape.d}
            fill="none"
            stroke={stroke}
            strokeWidth={shape.strokeWidth ?? 0.95}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={shape.opacity}
          />
        ),
      )}
    </svg>
  );
};

export const DecorationPicker = ({
  screenshot,
  onUpdateScreenshot,
}: DecorationPickerProps) => {
  const colors = deriveDecorationColors(getDecorationBaseColor(screenshot));
  const customColorEnabled = screenshot.themeSplit
    ? Boolean(screenshot.decorationColor || screenshot.decorationColorDark)
    : Boolean(screenshot.decorationColor);

  return (
    <div className="space-y-3">
      <label className="block text-xs text-gray-400">Decorations</label>
      <div className="grid grid-cols-3 gap-1">
        <button
          onClick={() => onUpdateScreenshot({ decorationPresetId: null })}
          className={`h-12 overflow-hidden rounded-md ${
            screenshot.decorationPresetId === null
              ? STYLES.gradientButtonActive
              : ""
          } flex items-center justify-center text-[10px] text-gray-400`}
          style={{ background: "#2a2a2a" }}
        >
          None
        </button>
        {decorationPresets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onUpdateScreenshot({ decorationPresetId: preset.id })}
            className={`h-12 overflow-hidden rounded-md ${
              screenshot.decorationPresetId === preset.id
                ? STYLES.gradientButtonActive
                : ""
            }`}
            style={{ background: screenshot.backgroundColor }}
            title={preset.label}
          >
            <DecorationThumbnail
              presetId={preset.id}
              fill={colors.fill}
              stroke={colors.stroke}
            />
          </button>
        ))}
      </div>

      {screenshot.decorationPresetId && (
        <div className="space-y-3">
          <RangeSlider
            label="Decoration Opacity"
            value={screenshot.decorationOpacity}
            min={SLIDER_RANGES.decorationOpacity.min}
            max={SLIDER_RANGES.decorationOpacity.max}
            unit="%"
            onChange={(decorationOpacity) =>
              onUpdateScreenshot({ decorationOpacity })
            }
          />
          <RangeSlider
            label="Decoration Scale"
            value={screenshot.decorationScale}
            min={SLIDER_RANGES.decorationScale.min}
            max={SLIDER_RANGES.decorationScale.max}
            unit="%"
            onChange={(decorationScale) =>
              onUpdateScreenshot({ decorationScale })
            }
          />
          <Toggle
            label="Custom Color"
            enabled={customColorEnabled}
            onChange={(enabled) => {
              if (!enabled) {
                onUpdateScreenshot({
                  decorationColor: null,
                  decorationColorDark: null,
                });
                return;
              }
              onUpdateScreenshot({
                decorationColor: getDecorationBaseColor(screenshot, "light"),
                decorationColorDark: screenshot.themeSplit
                  ? getDecorationBaseColor(screenshot, "dark")
                  : screenshot.decorationColorDark,
              });
            }}
          />
          {customColorEnabled &&
            (screenshot.themeSplit ? (
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">
                    Light
                  </label>
                  <input
                    type="color"
                    value={
                      screenshot.decorationColor ??
                      getDecorationBaseColor(screenshot, "light")
                    }
                    onChange={(event) =>
                      onUpdateScreenshot({ decorationColor: event.target.value })
                    }
                    className={STYLES.colorInput}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Dark</label>
                  <input
                    type="color"
                    value={
                      screenshot.decorationColorDark ??
                      getDecorationBaseColor(screenshot, "dark")
                    }
                    onChange={(event) =>
                      onUpdateScreenshot({
                        decorationColorDark: event.target.value,
                      })
                    }
                    className={STYLES.colorInput}
                  />
                </div>
              </div>
            ) : (
              <input
                type="color"
                value={
                  screenshot.decorationColor ??
                  getDecorationBaseColor(screenshot, "light")
                }
                onChange={(event) =>
                  onUpdateScreenshot({ decorationColor: event.target.value })
                }
                className={STYLES.colorInput}
              />
            ))}
        </div>
      )}
    </div>
  );
};
