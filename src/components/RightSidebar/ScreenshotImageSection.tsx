/**
 * ScreenshotImageSection Component
 *
 * Screenshot image upload control in its own sidebar section.
 */

import { useRef, type RefObject } from "react";
import type { DeviceInstance } from "../../types";
import { SidebarSection } from "./SidebarSection";
import { STYLES } from "./constants";

interface ScreenshotImageSectionProps {
  device: DeviceInstance;
  themeSplit: boolean;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileUpload: (
    e: React.ChangeEvent<HTMLInputElement>,
    slot?: "light" | "dark",
  ) => void;
}

export const ScreenshotImageSection = ({
  device,
  themeSplit,
  fileInputRef,
  onFileUpload,
}: ScreenshotImageSectionProps) => {
  const darkFileInputRef = useRef<HTMLInputElement>(null);

  if (!themeSplit) {
    return (
      <SidebarSection title="Device Screen Image">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(event) => onFileUpload(event, "light")}
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
  }

  return (
    <SidebarSection title="Device Screen Image">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(event) => onFileUpload(event, "light")}
        className="hidden"
      />
      <input
        ref={darkFileInputRef}
        type="file"
        accept="image/*"
        onChange={(event) => onFileUpload(event, "dark")}
        className="hidden"
      />
      <div className="space-y-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          className={STYLES.uploadButton}
        >
          {device.screenshotSrc ? "Change Light Screenshot" : "Upload Light Screenshot"}
        </button>
        <button
          onClick={() => darkFileInputRef.current?.click()}
          className={STYLES.uploadButton}
        >
          {device.screenshotSrcDark
            ? "Change Dark Screenshot"
            : "Upload Dark Screenshot"}
        </button>
      </div>
    </SidebarSection>
  );
};
