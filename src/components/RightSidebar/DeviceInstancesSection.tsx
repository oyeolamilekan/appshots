import { ArrowUp, ArrowDown, Smartphone, X } from "lucide-react";
import type { Screenshot } from "../../types";
import { getDeviceSpecById } from "../../lib/device-instances";
import { SidebarSection } from "./SidebarSection";
import { STYLES } from "./constants";

interface DeviceInstancesSectionProps {
  screenshot: Screenshot;
  onAddDevice: () => void;
  onSelectDevice: (deviceId: string) => void;
  onRemoveDevice: (deviceId: string) => void;
  onBringForward: (deviceId: string) => void;
  onSendBackward: (deviceId: string) => void;
}

export const DeviceInstancesSection = ({
  screenshot,
  onAddDevice,
  onSelectDevice,
  onRemoveDevice,
  onBringForward,
  onSendBackward,
}: DeviceInstancesSectionProps) => (
  <SidebarSection title="Devices">
    <div className="space-y-2">
      <button onClick={onAddDevice} className={STYLES.uploadButton}>
        + Add Device
      </button>
      <p className="text-[11px] leading-4 text-gray-500">
        Drag a device past the left or right edge to span adjacent screenshots.
      </p>

      <div className="space-y-2 mt-3">
        {screenshot.devices.map((device, index) => {
          const spec = getDeviceSpecById(device.deviceId);
          const isSelected = screenshot.activeDeviceId === device.id;

          return (
            <div
              key={device.id}
              onClick={() => onSelectDevice(device.id)}
              className={`${STYLES.overlayItem} ${
                isSelected ? STYLES.overlayItemActive : STYLES.overlayItemInactive
              }`}
            >
              <div className="w-10 h-10 rounded bg-[#1a1a1a] border border-white/10 flex items-center justify-center">
                <Smartphone className="w-4 h-4 text-gray-300" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-300 truncate">{spec.label}</p>
                <p className="text-[10px] text-gray-500">
                  {device.screenshotSrc ? "Image attached" : "No image"} · Layer{" "}
                  {index + 1} of {screenshot.devices.length}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSendBackward(device.id);
                  }}
                  disabled={index === 0}
                  className={STYLES.iconButton}
                  title="Send backward"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onBringForward(device.id);
                  }}
                  disabled={index === screenshot.devices.length - 1}
                  className={STYLES.iconButton}
                  title="Bring forward"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveDevice(device.id);
                  }}
                  disabled={screenshot.devices.length === 1}
                  className={STYLES.iconButtonDelete}
                  title="Remove"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </SidebarSection>
);
