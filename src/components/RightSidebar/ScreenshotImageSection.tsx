/**
 * ScreenshotImageSection Component
 *
 * Screenshot image upload control in its own sidebar section.
 */

import type { RefObject } from "react";
import type { Screenshot } from "../../types";
import { SidebarSection } from "./SidebarSection";
import { STYLES } from "./constants";

interface ScreenshotImageSectionProps {
  screenshot: Screenshot;
  fileInputRef: RefObject<HTMLInputElement | null>;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ScreenshotImageSection = ({
  screenshot,
  fileInputRef,
  onFileUpload,
}: ScreenshotImageSectionProps) => (
  <SidebarSection title="Screenshot Image">
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
      {screenshot.screenshotSrc ? "Change Image" : "Upload Image"}
    </button>
  </SidebarSection>
);
