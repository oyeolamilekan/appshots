/**
 * DeviceContainer Component
 *
 * Wrapper for the device frame with positioning, rotation, and shadow effects.
 * Supports both flat (2D) and 3D device rendering styles.
 */

import type { DeviceInstance } from "../../types";
import { SelectionHandles } from "./SelectionHandles";
import { DeviceFrame } from "../DeviceFrame";
import { DeviceFrame3D } from "../DeviceFrame/DeviceFrame3D";
import { getDeviceSelectionStyles, getDropShadowFilter } from "./utils";
import { getDeviceColorById, getDeviceSpecById } from "../../lib/device-instances";

interface DeviceContainerProps {
  /** Device instance data containing render settings */
  device: DeviceInstance;
  /** Horizontal position override in screenshot-local percent */
  renderX?: number;
  /** Z-index for stacking order */
  zIndex: number;
  /** Whether this device is selected */
  isSelected: boolean;
  /** Whether mouse interactions are enabled */
  isInteractive: boolean;
  /** Handler for mouse down event */
  onMouseDown: (e: React.MouseEvent) => void;
}

/**
 * DeviceContainer - Positioned device frame wrapper
 *
 * Handles device positioning, scale, rotation/3D perspective, and shadow effects.
 * Renders either a flat DeviceFrame or a 3D DeviceFrame3D based on the device instance style.
 */
export const DeviceContainer = ({
  device,
  renderX = device.x,
  zIndex,
  isSelected,
  isInteractive,
  onMouseDown,
}: DeviceContainerProps) => {
  const is3D = device.style === "3d";
  const selectedDevice = getDeviceSpecById(device.deviceId);
  const selectedColor = getDeviceColorById(selectedDevice.id, device.colorId);

  return (
    <div
      data-draggable-element="device"
      className="absolute cursor-move select-none"
      style={{
        left: `${renderX}%`,
        width: `${device.scale}%`,
        top: `${device.y}%`,
        transform: "translateX(-50%)",
        zIndex,
        filter: getDropShadowFilter(device.shadow),
        perspective: is3D ? "1200px" : undefined,
        ...getDeviceSelectionStyles(isSelected),
      }}
      onMouseDown={isInteractive ? onMouseDown : undefined}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={
          is3D
            ? {
                transform: `rotateY(${device.rotateY}deg) rotateX(${device.rotateX}deg)`,
                transformStyle: "preserve-3d",
                transformOrigin: "center center",
              }
            : {
                transform: `rotate(${device.rotation}deg)`,
                transformOrigin: "center center",
              }
        }
      >
        {is3D ? (
          <DeviceFrame3D
            device={device}
            selectedDevice={selectedDevice}
            selectedColor={selectedColor}
          />
        ) : (
          <DeviceFrame
            device={device}
            selectedDevice={selectedDevice}
            selectedColor={selectedColor}
          />
        )}
      </div>
      {isSelected && <SelectionHandles />}
    </div>
  );
};
