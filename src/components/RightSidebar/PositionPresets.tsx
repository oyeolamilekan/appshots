/**
 * PositionPresets Component
 *
 * Quick position presets for device positioning.
 * Allows users to quickly apply common device layouts.
 */

import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import type { Screenshot } from "../../types";

interface PositionPresetsProps {
  screenshot: Screenshot;
  onUpdateScreenshot: (updates: Partial<Screenshot>) => void;
}

interface Preset {
  id: string;
  label: string;
  icon: React.ReactNode;
  settings: Partial<Screenshot>;
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

const PRESETS: Preset[] = [
  {
    id: "centered",
    label: "Centered",
    icon: <DeviceIcon offsetY={50} scale={65} />,
    settings: {
      deviceScale: 65,
      deviceOffsetY: 35,
      deviceRotation: 0,
      deviceStyle: "flat",
    },
  },
  {
    id: "bleed-bottom",
    label: "Bleed Bottom",
    icon: <DeviceIcon offsetY={70} scale={70} />,
    settings: {
      deviceScale: 70,
      deviceOffsetY: 45,
      deviceRotation: 0,
      deviceStyle: "flat",
    },
  },
  {
    id: "bleed-top",
    label: "Bleed Top",
    icon: <DeviceIcon offsetY={30} scale={70} />,
    settings: {
      deviceScale: 70,
      deviceOffsetY: 15,
      deviceRotation: 0,
      deviceStyle: "flat",
    },
  },
  {
    id: "float-center",
    label: "Float Center",
    icon: <DeviceIcon offsetY={50} scale={55} />,
    settings: {
      deviceScale: 55,
      deviceOffsetY: 30,
      deviceRotation: 0,
      deviceStyle: "flat",
    },
  },
  {
    id: "tilt-left",
    label: "Tilt Left",
    icon: <DeviceIcon rotation={-15} offsetY={50} scale={60} />,
    settings: {
      deviceScale: 60,
      deviceOffsetY: 35,
      deviceRotation: -15,
      deviceStyle: "flat",
    },
  },
  {
    id: "tilt-right",
    label: "Tilt Right",
    icon: <DeviceIcon rotation={15} offsetY={50} scale={60} />,
    settings: {
      deviceScale: 60,
      deviceOffsetY: 35,
      deviceRotation: 15,
      deviceStyle: "flat",
    },
  },
  {
    id: "perspective",
    label: "Perspective",
    icon: <DeviceIcon is3D rotateY={-20} offsetY={50} scale={60} />,
    settings: {
      deviceScale: 60,
      deviceOffsetY: 35,
      deviceRotation: 0,
      deviceStyle: "3d",
      device3dRotateY: -20,
      device3dRotateX: 5,
    },
  },
  {
    id: "float-bottom",
    label: "Float Bottom",
    icon: <DeviceIcon offsetY={65} scale={50} />,
    settings: {
      deviceScale: 50,
      deviceOffsetY: 50,
      deviceRotation: 0,
      deviceStyle: "flat",
    },
  },
];

/**
 * PositionPresets - Quick device positioning presets
 */
export const PositionPresets = ({
  screenshot,
  onUpdateScreenshot,
}: PositionPresetsProps) => {
  const [isExpanded, setIsExpanded] = useState(true);

  // Determine active preset based on current settings
  const getActivePreset = (): string | null => {
    for (const preset of PRESETS) {
      const { settings } = preset;
      const matches =
        screenshot.deviceScale === settings.deviceScale &&
        screenshot.deviceOffsetY === settings.deviceOffsetY &&
        screenshot.deviceRotation === settings.deviceRotation &&
        screenshot.deviceStyle === settings.deviceStyle;
      if (matches) return preset.id;
    }
    return null;
  };

  const activePreset = getActivePreset();

  const handlePresetClick = (preset: Preset) => {
    onUpdateScreenshot(preset.settings);
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
