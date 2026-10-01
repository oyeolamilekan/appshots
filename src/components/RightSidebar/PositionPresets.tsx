/**
 * PositionPresets Component
 *
 * Quick position presets for device positioning.
 * Allows users to quickly apply common device layouts.
 */

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import type { DeviceInstance } from "../../types";
import { positionPresets } from "../../lib/position-presets";
import type { PositionPreset } from "../../lib/position-presets";

interface PositionPresetsProps {
  device: DeviceInstance;
  onUpdateDevice: (updates: Partial<DeviceInstance>) => void;
}

interface Preset extends PositionPreset {
  icon: React.ReactNode;
}

/**
 * Device icon component for preset thumbnails
 */
const DeviceIcon = ({
  rotation = 0,
  offsetY = 50,
  scale = 60,
  is3D = false,
  rotateY = 0,
}: {
  rotation?: number;
  offsetY?: number;
  scale?: number;
  is3D?: boolean;
  rotateY?: number;
}) => {
  const height = (scale / 100) * 32;
  const top = ((offsetY - 50) / 100) * 20;

  return (
    <div
      className="w-8 h-10 flex items-center justify-center"
      style={{
        perspective: is3D ? "100px" : undefined,
      }}
    >
      <div
        className="border-2 border-zinc-500 rounded-sm"
        style={{
          width: "14px",
          height: `${height}px`,
          transform: is3D
            ? `rotateY(${rotateY}deg) rotateX(5deg)`
            : `rotate(${rotation}deg) translateY(${top}px)`,
          transformStyle: is3D ? "preserve-3d" : undefined,
        }}
      />
    </div>
  );
};

/**
 * Preset thumbnails, keyed by preset id.
 * Settings themselves live in `src/lib/position-presets.ts` so the MCP server
 * can share them.
 */
const PRESET_ICONS: Record<string, React.ReactNode> = {
  centered: <DeviceIcon offsetY={50} scale={65} />,
  "bleed-bottom": <DeviceIcon offsetY={70} scale={70} />,
  "bleed-top": <DeviceIcon offsetY={30} scale={70} />,
  "float-center": <DeviceIcon offsetY={50} scale={55} />,
  "tilt-left": <DeviceIcon rotation={-15} offsetY={50} scale={60} />,
  "tilt-right": <DeviceIcon rotation={15} offsetY={50} scale={60} />,
  perspective: <DeviceIcon is3D rotateY={-20} offsetY={50} scale={60} />,
  "float-bottom": <DeviceIcon offsetY={65} scale={50} />,
};

const PRESETS: Preset[] = positionPresets.map((preset) => ({
  ...preset,
  icon: PRESET_ICONS[preset.id],
}));

/**
 * PositionPresets - Quick device positioning presets
 */
export const PositionPresets = ({
  device,
  onUpdateDevice,
}: PositionPresetsProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Determine active preset based on current settings
  const getActivePreset = (): string | null => {
    for (const preset of PRESETS) {
      const { settings } = preset;
      const matches =
        device.scale === settings.scale &&
        device.y === settings.y &&
        device.rotation === settings.rotation &&
        device.style === settings.style;
      if (matches) return preset.id;
    }
    return null;
  };

  const activePreset = getActivePreset();

  const handlePresetClick = (preset: Preset) => {
    onUpdateDevice(preset.settings);
  };

  return (
    <div className="border-b border-zinc-800">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-zinc-800/50 transition-colors"
      >
        <span className="text-sm font-medium text-white">Position Presets</span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-zinc-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-zinc-400" />
        )}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="grid grid-cols-4 gap-2">
            {PRESETS.map((preset) => {
              const isActive = activePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handlePresetClick(preset)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all ${
                    isActive
                      ? "bg-violet-600/20 ring-2 ring-violet-500"
                      : "bg-zinc-800 hover:bg-zinc-700"
                  }`}
                >
                  <div
                    className={`${isActive ? "text-violet-400" : "text-zinc-500"}`}
                  >
                    {preset.icon}
                  </div>
                  <span
                    className={`text-[10px] leading-tight text-center ${
                      isActive ? "text-violet-400" : "text-zinc-400"
                    }`}
                  >
                    {preset.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
