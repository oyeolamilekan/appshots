/**
 * DeviceContainer Component
 *
 * Wrapper for the device frame with positioning, rotation, and shadow effects.
 */

import type { Screenshot } from "../../types";
import { DeviceFrame } from "../DeviceFrame";
import { getDropShadowFilter } from "./utils";
import { Z_INDEX } from "./constants";

interface DeviceContainerProps {
  /** Screenshot data containing device settings */
  screenshot: Screenshot;
}

/**
 * DeviceContainer - Positioned device frame wrapper
 *
 * Handles device positioning, scale, rotation, and shadow effects.
 * Wraps the DeviceFrame component with proper styling.
 *
 * @param props - Component props
 * @param props.screenshot - Screenshot data with device configuration
 *
 * @example
 * <DeviceContainer screenshot={currentScreenshot} />
 */
export const DeviceContainer = ({ screenshot }: DeviceContainerProps) => (
  <div
    className="absolute left-1/2"
    style={{
      width: `${screenshot.deviceScale}%`,
      top: `${screenshot.deviceOffsetY}%`,
      transform: "translateX(-50%)",
      zIndex: Z_INDEX.device,
      filter: getDropShadowFilter(screenshot.deviceShadow),
    }}
  >
    <div
      style={{
        transform: `rotate(${screenshot.deviceRotation}deg)`,
        transformOrigin: "center center",
      }}
    >
      <DeviceFrame screenshot={screenshot} />
    </div>
  </div>
);
