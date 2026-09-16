/**
 * AnonymousScreen Component
 *
 * Screen-only mockup with no hardware chrome (bezel, buttons, camera).
 */

import type { DeviceInstance, DeviceSpec } from "../../types";
import { ScreenContent } from "./ScreenContent";

interface AnonymousScreenProps {
  device: DeviceInstance;
  selectedDevice: DeviceSpec;
}

/**
 * Renders a rounded screenshot without a device frame.
 */
export const AnonymousScreen = ({
  device,
  selectedDevice,
}: AnonymousScreenProps) => (
  <div
    className="relative w-full overflow-hidden"
    style={{
      aspectRatio: `${selectedDevice.width} / ${selectedDevice.height}`,
      borderRadius: selectedDevice.frameRadius.outer,
      backgroundColor: "#000",
    }}
  >
    <ScreenContent screenshotSrc={device.screenshotSrc} />
  </div>
);
