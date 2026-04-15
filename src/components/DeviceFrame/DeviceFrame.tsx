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
import type { DeviceColor, DeviceInstance, DeviceSpec } from "../../types";
import { SHADOWS } from "./constants";
import { getFrameBackground } from "./utils";
import { ScreenContent } from "./ScreenContent";
import { CameraElement } from "./CameraElements";
import { IPhoneButtons, SamsungButtons } from "./DeviceButtons";

interface DeviceFrameProps {
  /** Device instance data containing the image and metadata */
  device: DeviceInstance;
  /** Selected device specification */
  selectedDevice: DeviceSpec;
  /** Selected device frame color */
  selectedColor: DeviceColor;
}

/**
 * DeviceFrame - Renders a complete device mockup
 *
 * Combines all device frame elements (frame, screen, camera, buttons)
 * into a cohesive, realistic device representation.
 *
 * @param props - Component props
 * @param props.device - The device instance data to display
 *
 * @example
 * <DeviceFrame device={currentDevice} selectedDevice={deviceSpec} selectedColor={deviceColor} />
 */
export const DeviceFrame = ({
  device,
  selectedDevice,
  selectedColor,
}: DeviceFrameProps) => {
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
        <ScreenContent screenshotSrc={device.screenshotSrc} />
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
