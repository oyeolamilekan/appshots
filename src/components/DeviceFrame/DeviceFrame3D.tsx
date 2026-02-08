/**
 * DeviceFrame3D Component
 *
 * Renders a realistic 3D device mockup with smooth rounded edges.
 * Uses a slice-based extrusion technique: stacks multiple thin copies
 * of the device shape at incrementing Z-depths, so the 3D edges
 * perfectly follow the device's border-radius at every corner.
 *
 * Supports iPhone and Samsung devices.
 */

import { useMemo } from "react";
import { useEditor } from "../../context/EditorContext";
import type { Screenshot } from "../../types";
import { SHADOWS } from "./constants";
import { getFrameBackground } from "./utils";
import { ScreenContent } from "./ScreenContent";
import { CameraElement } from "./CameraElements";
import { IPhoneButtons, SamsungButtons } from "./DeviceButtons";

interface DeviceFrame3DProps {
  screenshot: Screenshot;
}

/** Total depth of the 3D extrusion in pixels */
const EDGE_DEPTH = 28;
/** Number of slices used to build the extruded edge */
const SLICE_COUNT = 20;

/**
 * DeviceFrame3D - Renders a 3D device with smooth rounded edges
 *
 * Instead of separate flat edge panels, this component extrudes the
 * device shape by stacking thin slices at different Z positions.
 * Each slice shares the device's border-radius, so corners are
 * always smooth and perfectly matched.
 */
export const DeviceFrame3D = ({ screenshot }: DeviceFrame3DProps) => {
  const { selectedDevice, selectedColor } = useEditor();

  const isSamsungDevice = selectedDevice.id.startsWith("samsung-");
  const isSamsungTablet = selectedDevice.id.includes("tab");

  const frameBackground = useMemo(
    () => getFrameBackground(selectedColor),
    [selectedColor],
  );

  const frameStyle = useMemo(
    () => ({
      aspectRatio: `${selectedDevice.width} / ${selectedDevice.height}`,
      background: frameBackground,
      borderRadius: selectedDevice.frameRadius.outer,
      padding: "1.2%",
      boxShadow: SHADOWS.frame,
      border: "1px solid rgba(0,0,0,0.1)",
      transform: `translateZ(${EDGE_DEPTH / 2}px)`,
      backfaceVisibility: "hidden" as const,
    }),
    [selectedDevice, selectedColor, frameBackground],
  );

  const screenStyle = useMemo(
    () => ({
      backgroundColor: "#000",
      borderRadius: selectedDevice.frameRadius.inner,
    }),
    [selectedDevice.frameRadius.inner],
  );

  // Pre-compute slice styles for performance
  const sliceStyles = useMemo(() => {
    return Array.from({ length: SLICE_COUNT }, (_, i) => {
      const t = i / (SLICE_COUNT - 1); // 0 → 1 (back → front)
      const z = -EDGE_DEPTH / 2 + t * EDGE_DEPTH;
      // Darken back slices, lighten front slices for depth
      const brightness = 0.65 + t * 0.35;

      return {
        position: "absolute" as const,
        inset: 0,
        borderRadius: selectedDevice.frameRadius.outer,
        background: frameBackground,
        transform: `translateZ(${z}px)`,
        filter: `brightness(${brightness})`,
        border: "1px solid rgba(0,0,0,0.08)",
      };
    });
  }, [selectedDevice.frameRadius.outer, frameBackground]);

  return (
    <div
      className="relative w-full"
      style={{
        transformStyle: "preserve-3d",
        aspectRatio: `${selectedDevice.width} / ${selectedDevice.height}`,
      }}
    >
      {/* Extruded edge slices (back to front) */}
      {sliceStyles.map((style, i) => (
        <div key={i} style={style} />
      ))}

      {/* Front face - the actual device with screen */}
      <div className="relative w-full shadow-2xl" style={frameStyle}>
        <div
          className="relative w-full h-full overflow-hidden"
          style={screenStyle}
        >
          <ScreenContent screenshotSrc={screenshot.screenshotSrc} />
          <CameraElement
            device={selectedDevice}
            isSamsung={isSamsungDevice}
            isSamsungTablet={isSamsungTablet}
          />
        </div>

        {isSamsungDevice ? (
          <SamsungButtons color={selectedColor} is3d />
        ) : (
          <IPhoneButtons color={selectedColor} is3d />
        )}
      </div>
    </div>
  );
};
