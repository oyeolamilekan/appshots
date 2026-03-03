/**
 * BackgroundPicker Component
 *
 * Background mode and color/gradient selection with multi-stop gradient support.
 */

import { Plus, X } from "lucide-react";
import type { Screenshot, GradientPreset, GradientStop } from "../../types";
import { HexColorInput } from "./HexColorInput";
import { STYLES, SLIDER_RANGES } from "./constants";

interface BackgroundPickerProps {
  /** Active screenshot data */
  screenshot: Screenshot;
  /** Available gradient presets */
  gradientPresets: GradientPreset[];
  /** Update screenshot handler */
  onUpdateScreenshot: (updates: Partial<Screenshot>) => void;
}

const generateStopId = () => Math.random().toString(36).substring(2, 9);

/**
 * Interpolate between two hex colors at a given ratio (0-1).
 */
const interpolateColor = (c1: string, c2: string, t: number): string => {
  const hex = (s: string) => parseInt(s, 16);
  const r1 = hex(c1.slice(1, 3)),
    g1 = hex(c1.slice(3, 5)),
    b1 = hex(c1.slice(5, 7));
  const r2 = hex(c2.slice(1, 3)),
    g2 = hex(c2.slice(3, 5)),
    b2 = hex(c2.slice(5, 7));
  const r = Math.round(r1 + (r2 - r1) * t);
  const g = Math.round(g1 + (g2 - g1) * t);
  const b = Math.round(b1 + (b2 - b1) * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

export const BackgroundPicker = ({
  screenshot,
  gradientPresets,
  onUpdateScreenshot,
}: BackgroundPickerProps) => {
  const isLinear = (screenshot.gradientType ?? "linear") === "linear";
  const stops: GradientStop[] =
    screenshot.gradientStops && screenshot.gradientStops.length >= 2
      ? screenshot.gradientStops
      : [
          { id: "s1", color: screenshot.gradientFrom ?? "#ff7e5f", position: 0 },
          { id: "s2", color: screenshot.gradientTo ?? "#feb47b", position: 100 },
        ];
  const sortedStops = [...stops].sort((a, b) => a.position - b.position);

  const updateStops = (newStops: GradientStop[]) => {
    onUpdateScreenshot({
      gradientStops: newStops,
      gradientFrom: newStops[0]?.color,
      gradientTo: newStops[newStops.length - 1]?.color,
      gradientPresetId: null,
    });
  };

  const updateStopColor = (id: string, color: string) => {
    updateStops(stops.map((s) => (s.id === id ? { ...s, color } : s)));
  };

  const updateStopPosition = (id: string, position: number) => {
    const clamped = Math.max(0, Math.min(100, position));
    updateStops(stops.map((s) => (s.id === id ? { ...s, position: clamped } : s)));
  };

  const removeStop = (id: string) => {
    if (stops.length <= 2) return;
    updateStops(stops.filter((s) => s.id !== id));
  };

  const addStop = () => {
    // Find the widest gap between sorted stops and insert there
    let maxGap = 0;
    let insertIdx = 0;
    for (let i = 0; i < sortedStops.length - 1; i++) {
      const gap = sortedStops[i + 1].position - sortedStops[i].position;
      if (gap > maxGap) {
        maxGap = gap;
        insertIdx = i;
      }
    }
    const left = sortedStops[insertIdx];
    const right = sortedStops[insertIdx + 1];
    const midPosition = Math.round((left.position + right.position) / 2);
    const midColor = interpolateColor(left.color, right.color, 0.5);
    updateStops([
      ...stops,
      { id: generateStopId(), color: midColor, position: midPosition },
    ]);
  };

  // Build gradient CSS for preview bar
  const gradientPreview = (() => {
    const colorStops = sortedStops
      .map((s) => `${s.color} ${s.position}%`)
      .join(", ");
    return `linear-gradient(90deg, ${colorStops})`;
  })();

  return (
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

        {/* Color picker or gradient controls */}
        {screenshot.backgroundMode === "solid" ? (
          <HexColorInput
            value={screenshot.backgroundColor}
            onChange={(color) =>
              onUpdateScreenshot({ backgroundColor: color })
            }
          />
        ) : (
          <div className="space-y-2">
            {/* Gradient type toggle */}
            <div className="flex gap-2">
              <button
                onClick={() =>
                  onUpdateScreenshot({ gradientType: "linear" })
                }
                className={`${STYLES.modeButton} ${
                  isLinear
                    ? STYLES.modeButtonActive
                    : STYLES.modeButtonInactive
                }`}
              >
                Linear
              </button>
              <button
                onClick={() =>
                  onUpdateScreenshot({ gradientType: "radial" })
                }
                className={`${STYLES.modeButton} ${
                  !isLinear
                    ? STYLES.modeButtonActive
                    : STYLES.modeButtonInactive
                }`}
              >
                Radial
              </button>
            </div>

            {/* Gradient presets */}
            <div className="grid grid-cols-3 gap-1">
              {gradientPresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() =>
                    onUpdateScreenshot({
                      gradientPresetId: preset.id,
                      gradientFrom: preset.from,
                      gradientTo: preset.to,
                      gradientStops: preset.stops.map((s) => ({ ...s, id: generateStopId() })),
                    })
                  }
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

            {/* Gradient preview bar */}
            <div
              className="h-3 rounded-md border border-white/10"
              style={{ background: gradientPreview }}
            />

            {/* Gradient stops */}
            <div className="space-y-1.5">
              {sortedStops.map((stop) => (
                <div key={stop.id} className="flex items-center gap-1.5">
                  <HexColorInput
                    compact
                    value={stop.color}
                    onChange={(color) => updateStopColor(stop.id, color)}
                  />
                  <div className="flex items-center shrink-0">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={stop.position}
                      onChange={(e) =>
                        updateStopPosition(stop.id, Number(e.target.value))
                      }
                      className="w-8 bg-transparent text-[10px] text-gray-500 text-right outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                    />
                    <span className="text-[10px] text-gray-500">%</span>
                  </div>
                  {stops.length > 2 && (
                    <button
                      onClick={() => removeStop(stop.id)}
                      className="p-0.5 text-gray-500 hover:text-red-400 shrink-0"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addStop}
                className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-gray-300 transition-colors"
              >
                <Plus size={12} />
                Add stop
              </button>
            </div>

            {/* Angle slider (linear only) */}
            {isLinear && (
              <label className="block">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-[10px] text-gray-500">Angle</span>
                  <span className="text-[10px] text-gray-500">
                    {screenshot.gradientAngle ?? 180}&deg;
                  </span>
                </div>
                <input
                  type="range"
                  min={SLIDER_RANGES.gradientAngle.min}
                  max={SLIDER_RANGES.gradientAngle.max}
                  value={screenshot.gradientAngle ?? 180}
                  onChange={(e) =>
                    onUpdateScreenshot({
                      gradientAngle: Number(e.target.value),
                    })
                  }
                  className={STYLES.rangeSlider}
                />
              </label>
            )}
          </div>
        )}

        {/* Noise overlay */}
        <label className="block">
          <div className="flex justify-between items-center mb-0.5">
            <span className="text-[10px] text-gray-500">Noise</span>
            <span className="text-[10px] text-gray-500">
              {screenshot.backgroundNoise ?? 0}%
            </span>
          </div>
          <input
            type="range"
            min={SLIDER_RANGES.backgroundNoise.min}
            max={SLIDER_RANGES.backgroundNoise.max}
            value={screenshot.backgroundNoise ?? 0}
            onChange={(e) =>
              onUpdateScreenshot({
                backgroundNoise: Number(e.target.value),
              })
            }
            className={STYLES.rangeSlider}
          />
        </label>
      </div>
    </div>
  );
};
