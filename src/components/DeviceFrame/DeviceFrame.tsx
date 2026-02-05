/**
 * DeviceFrame Component
 *
 * Main component that renders a realistic device mockup frame.
 * Supports multiple device types including iPhones and Samsung devices.
 *
 * Features:
 * - Realistic device frame with proper aspect ratio
 * - Dynamic camera elements (Dynamic Island, Notch, Punch-hole)
 * - Physical buttons matching device type
 * - Gradient and solid color support
 * - Screenshot display with placeholder
 */

import { useMemo } from "react";
import { useEditor } from "../../context/EditorContext";
import type { Screenshot } from "../../types";
import { SHADOWS } from "./constants";
import { getFrameBackground } from "./utils";
import { ScreenContent } from "./ScreenContent";
import { CameraElement } from "./CameraElements";
import { IPhoneButtons, SamsungButtons } from "./DeviceButtons";

interface DeviceFrameProps {
  /** Screenshot data containing the image and metadata */
  screenshot: Screenshot;
}

/**
 * DeviceFrame - Renders a complete device mockup
 *
 * Combines all device frame elements (frame, screen, camera, buttons)
 * into a cohesive, realistic device representation.
 *
 * @param props - Component props
 * @param props.screenshot - The screenshot data to display
 *
 * @example
 * <DeviceFrame screenshot={currentScreenshot} />
 */
export const DeviceFrame = ({ screenshot }: DeviceFrameProps) => {
  const { selectedDevice, selectedColor } = useEditor();

  // Device type detection
  const isSamsungDevice = selectedDevice.id.startsWith("samsung-");
  const isSamsungTablet = selectedDevice.id.includes("tab");

  // Memoized styles for performance
  const frameStyle = useMemo(
    () => ({
      aspectRatio: `${selectedDevice.width} / ${selectedDevice.height}`,
      background: getFrameBackground(selectedColor),
      borderRadius: selectedDevice.frameRadius.outer,
      padding: "1.2%",
      boxShadow: SHADOWS.frame,
      border: "1px solid rgba(0,0,0,0.1)",
    }),
    [selectedDevice, selectedColor],
  );

  const screenStyle = useMemo(
    () => ({
      backgroundColor: "#000",
      borderRadius: selectedDevice.frameRadius.inner,
    }),
    [selectedDevice.frameRadius.inner],
  );

  return (
    <div className="relative w-full shadow-2xl" style={frameStyle}>
      {/* Screen area */}
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

      {/* Physical buttons */}
      {isSamsungDevice ? (
        <SamsungButtons color={selectedColor} />
      ) : (
        <IPhoneButtons color={selectedColor} />
      )}
    </div>
  );
};
