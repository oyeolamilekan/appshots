/**
 * AnonymousScreen Component
 *
 * Screen-only mockup with no hardware chrome (bezel, buttons, camera).
 */

import type { DeviceInstance, DeviceSpec } from "../../types";
import { ANONYMOUS_TOP_CROP } from "../../lib/device-instances";
import { ScreenContent } from "./ScreenContent";

interface AnonymousScreenProps {
  device: DeviceInstance;
  selectedDevice: DeviceSpec;
  themeSplit?: boolean;
  lightClipPath?: string;
  darkClipPath?: string;
  hairlineClipPath?: string;
}

/**
 * Renders a rounded screenshot without a device frame.
 */
export const AnonymousScreen = ({
  device,
  selectedDevice,
  themeSplit = false,
  lightClipPath,
  darkClipPath,
  hairlineClipPath,
}: AnonymousScreenProps) => (
  <div
    className="relative w-full overflow-hidden"
    style={{
      aspectRatio: `${selectedDevice.width} / ${selectedDevice.height}`,
      borderRadius: selectedDevice.frameRadius.outer,
      backgroundColor: "#000",
    }}
  >
    <ScreenContent
      screenshotSrc={device.screenshotSrc}
      screenshotSrcDark={device.screenshotSrcDark}
      themeSplit={themeSplit}
      lightClipPath={lightClipPath}
      darkClipPath={darkClipPath}
      hairlineClipPath={hairlineClipPath}
      topCrop={ANONYMOUS_TOP_CROP}
    />
  </div>
);
