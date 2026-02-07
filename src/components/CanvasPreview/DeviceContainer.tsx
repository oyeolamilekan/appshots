/**
 * DeviceContainer Component
 *
 * Wrapper for the device frame with positioning, rotation, and shadow effects.
 * Supports both flat (2D) and 3D device rendering styles.
 */

import type { Screenshot } from "../../types";
import { DeviceFrame } from "../DeviceFrame";
import { DeviceFrame3D } from "../DeviceFrame/DeviceFrame3D";
import { getDropShadowFilter } from "./utils";
import { Z_INDEX } from "./constants";

interface DeviceContainerProps {
  /** Screenshot data containing device settings */
  screenshot: Screenshot;
}

/**
 * DeviceContainer - Positioned device frame wrapper
 *
 * Handles device positioning, scale, rotation/3D perspective, and shadow effects.
 * Renders either a flat DeviceFrame or a 3D DeviceFrame3D based on deviceStyle.
 */
export const DeviceContainer = ({ screenshot }: DeviceContainerProps) => {
  const is3D = screenshot.deviceStyle === "3d";

  return (
    <div
      className="absolute left-1/2"
      style={{
        width: `${screenshot.deviceScale}%`,
        top: `${screenshot.deviceOffsetY}%`,
        transform: "translateX(-50%)",
        zIndex: Z_INDEX.device,
        filter: getDropShadowFilter(screenshot.deviceShadow),
        perspective: is3D ? "1200px" : undefined,
      }}
    >
      <div
        style={
          is3D
            ? {
                transform: `rotateY(${screenshot.device3dRotateY}deg) rotateX(${screenshot.device3dRotateX}deg)`,
                transformStyle: "preserve-3d",
                transformOrigin: "center center",
              }
            : {
                transform: `rotate(${screenshot.deviceRotation}deg)`,
                transformOrigin: "center center",
              }
        }
      >
        {is3D ? (
          <DeviceFrame3D screenshot={screenshot} />
        ) : (
          <DeviceFrame screenshot={screenshot} />
        )}
      </div>
    </div>
  );
};
