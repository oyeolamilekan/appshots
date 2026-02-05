/**
 * ContentSection Component
 *
 * Text content editors for headline and subheadline.
 */

import type { Screenshot } from "../../types";
import { SidebarSection } from "./SidebarSection";
import { RichTextEditor } from "../RichTextEditor";

interface ContentSectionProps {
  /** Active screenshot data */
  screenshot: Screenshot;
  /** Update screenshot handler */
  onUpdateScreenshot: (updates: Partial<Screenshot>) => void;
}

/**
 * ContentSection - Text content editors
 *
 * Rich text editors for headline and subheadline.
 *
 * @param props - Component props
 */
export const ContentSection = ({
  screenshot,
  onUpdateScreenshot,
}: ContentSectionProps) => (
  <SidebarSection title="Content">
    <div className="space-y-4">
      <div>
        <label className="block text-xs text-gray-400 mb-1">Headline</label>
        <RichTextEditor
          value={screenshot.headline}
          onChange={(html) => onUpdateScreenshot({ headline: html })}
          placeholder="Enter headline..."
        />
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1">Subheadline</label>
        <RichTextEditor
          value={screenshot.subheadline}
          onChange={(html) => onUpdateScreenshot({ subheadline: html })}
          placeholder="Enter subheadline..."
        />
      </div>
    </div>
  </SidebarSection>
);
