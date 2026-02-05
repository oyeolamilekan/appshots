/**
 * DeviceSection Component
 *
 * Device and color selection section.
 */

import type { DeviceSpec } from "../../types";
import { SidebarSection } from "./SidebarSection";
import { SelectionButton } from "./SelectionButton";
import { ColorButton } from "./ColorButton";
import { STYLES } from "./constants";

interface DeviceSectionProps {
  /** Available devices */
  devices: DeviceSpec[];
  /** Currently selected device ID */
  selectedDeviceId: string;
  /** Currently selected color ID */
  selectedColorId: string;
  /** Currently selected device object */
  selectedDevice: DeviceSpec;
  /** Handler for device selection */
  onDeviceSelect: (deviceId: string, defaultColorId: string) => void;
  /** Handler for color selection */
  onColorSelect: (colorId: string) => void;
}

/**
 * DeviceSection - Device and color picker section
 *
 * Displays a list of available devices and color options
 * for the currently selected device.
 *
 * @param props - Component props
 *
 * @example
 * <DeviceSection
 *   devices={devices}
 *   selectedDeviceId={selectedDeviceId}
 *   selectedColorId={selectedColorId}
 *   selectedDevice={selectedDevice}
 *   onDeviceSelect={(id, colorId) => { ... }}
 *   onColorSelect={(colorId) => { ... }}
 * />
 */
export const DeviceSection = ({
  devices,
  selectedDeviceId,
  selectedColorId,
  selectedDevice,
  onDeviceSelect,
  onColorSelect,
}: DeviceSectionProps) => (
  <SidebarSection title="Device">
    {/* Device list */}
    <div className={STYLES.buttonList}>
      {devices.map((device) => (
        <SelectionButton
          key={device.id}
          label={device.label}
          isSelected={selectedDeviceId === device.id}
          onClick={() => onDeviceSelect(device.id, device.colors[0].id)}
        />
      ))}
    </div>

    {/* Color picker */}
    <div className="mt-3">
      <p className="text-xs text-gray-400 mb-2">Color</p>
      <div className={STYLES.colorPicker}>
        {selectedDevice.colors.map((color) => (
          <ColorButton
            key={color.id}
            color={color.frame}
            label={color.label}
            isSelected={selectedColorId === color.id}
            onClick={() => onColorSelect(color.id)}
          />
        ))}
      </div>
    </div>
  </SidebarSection>
);
