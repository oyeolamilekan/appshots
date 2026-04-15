/**
 * ScreenshotImageSection Component
 *
 * Screenshot image upload control in its own sidebar section.
 */

import type { RefObject } from "react";
import type { DeviceInstance } from "../../types";
import { SidebarSection } from "./SidebarSection";
import { STYLES } from "./constants";

interface ScreenshotImageSectionProps {
  device: DeviceInstance;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ScreenshotImageSection = ({
  device,
  fileInputRef,
  onFileUpload,
}: ScreenshotImageSectionProps) => (
  <SidebarSection title="Device Screen Image">
    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      onChange={onFileUpload}
      className="hidden"
    />
    <button
      onClick={() => fileInputRef.current?.click()}
      className={STYLES.uploadButton}
    >
      {device.screenshotSrc ? "Change Image" : "Upload Image"}
    </button>
  </SidebarSection>
);
