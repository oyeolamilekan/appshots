/**
 * ScreenshotCard Component
 *
 * Individual screenshot preview card with all interactive elements.
 */

import type { RefObject } from "react";
import type { Screenshot, ExportSize } from "../../types";
import { RemoveButton } from "./RemoveButton";
import { OverlayImage } from "./OverlayImage";
import { TextElement } from "./TextElement";
import { DeviceContainer } from "./DeviceContainer";
import { isElementSelected } from "./utils";
import { Z_INDEX } from "./constants";

interface SelectedElement {
  type: string;
  id?: string;
}

interface ScreenshotCardProps {
  /** Screenshot data */
  screenshot: Screenshot;
  /** Whether this screenshot is currently active */
  isActive: boolean;
  /** Whether this screenshot can be removed */
  canRemove: boolean;
  /** Currently selected element */
  selectedElement: SelectedElement | null;
  /** Export size for aspect ratio */
  exportSize: ExportSize;
  /** Headline font size in pixels */
  headlineFontSize: number;
  /** Subheadline font size in pixels */
  subheadlineFontSize: number;
  /** Ref for preview element (only attached to active screenshot) */
  previewRef: RefObject<HTMLDivElement | null>;
  /** Background style getter */
  getBackgroundStyle: (screenshot: Screenshot) => string;
  /** Handler for selecting this screenshot */
  onSelect: () => void;
  /** Handler for removing this screenshot */
  onRemove: () => void;
  /** Handler for deselecting elements */
  onDeselect: () => void;
  /** Handler for element mouse down */
  onElementMouseDown: (
    e: React.MouseEvent,
    type: "headline" | "subheadline" | "image",
    id?: string,
  ) => void;
  /** Handler for element mouse up */
  onElementMouseUp: () => void;
}

/**
 * ScreenshotCard - Complete screenshot preview with all elements
 *
 * Renders a screenshot canvas with device frame, text elements,
 * and overlay images. Handles selection and drag interactions.
 *
 * @param props - Component props
 */
export const ScreenshotCard = ({
  screenshot,
  isActive,
  canRemove,
  selectedElement,
  exportSize,
  headlineFontSize,
  subheadlineFontSize,
  previewRef,
  getBackgroundStyle,
  onSelect,
  onRemove,
  onDeselect,
  onElementMouseDown,
  onElementMouseUp,
}: ScreenshotCardProps) => {
  // Split overlay images by layer
  const behindImages = screenshot.overlayImages.filter(
    (img) => img.layer === "behind",
  );
  const frontImages = screenshot.overlayImages.filter(
    (img) => img.layer !== "behind",
  );

  // Handle background click to deselect
  const handleBackgroundMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (isActive && !target.closest("[data-draggable-element]")) {
      onDeselect();
    }
  };

  return (
    <div
      ref={isActive ? previewRef : undefined}
      onClick={onSelect}
      onMouseUp={onElementMouseUp}
      onMouseLeave={onElementMouseUp}
      onMouseDown={handleBackgroundMouseDown}
      className={`relative h-full rounded-xl overflow-hidden cursor-pointer transition-all ${
        isActive
          ? "ring-2 ring-white ring-offset-2 ring-offset-[#0a0a0a]"
          : "opacity-70 hover:opacity-100"
      }`}
      style={{
        background: getBackgroundStyle(screenshot),
        aspectRatio: `${exportSize.width}/${exportSize.height}`,
      }}
    >
      {/* Remove button */}
      {canRemove && <RemoveButton onRemove={onRemove} />}

      {/* Content layer */}
      <div className="absolute inset-0 select-none">
        {/* Overlay images behind device */}
        {behindImages.map((image, index) => (
          <OverlayImage
            key={image.id}
            image={image}
            zIndex={Z_INDEX.behindDevice + index}
            isSelected={isElementSelected(
              isActive,
              selectedElement,
              "image",
              image.id,
            )}
            isInteractive={isActive}
            onMouseDown={(e) => onElementMouseDown(e, "image", image.id)}
          />
        ))}

        {/* Headline */}
        <TextElement
          type="headline"
          content={screenshot.headline}
          x={screenshot.headlineX}
          y={screenshot.headlineY}
          width={screenshot.headlineWidth}
          fontSize={headlineFontSize / 3}
          color={screenshot.textColor}
          fontFamily={screenshot.fontFamily}
          isSelected={isElementSelected(isActive, selectedElement, "headline")}
          isInteractive={isActive}
          onMouseDown={(e) => onElementMouseDown(e, "headline")}
        />

        {/* Subheadline */}
        <TextElement
          type="subheadline"
          content={screenshot.subheadline}
          x={screenshot.subheadlineX}
          y={screenshot.subheadlineY}
          width={screenshot.subheadlineWidth}
          fontSize={subheadlineFontSize / 3}
          color={screenshot.textColor}
          fontFamily={screenshot.fontFamily}
          isSelected={isElementSelected(
            isActive,
            selectedElement,
            "subheadline",
          )}
          isInteractive={isActive}
          onMouseDown={(e) => onElementMouseDown(e, "subheadline")}
        />

        {/* Device */}
        <DeviceContainer screenshot={screenshot} />

        {/* Overlay images in front of device */}
        {frontImages.map((image, index) => (
          <OverlayImage
            key={image.id}
            image={image}
            zIndex={Z_INDEX.frontDevice + index}
            isSelected={isElementSelected(
              isActive,
              selectedElement,
              "image",
              image.id,
            )}
            isInteractive={isActive}
            onMouseDown={(e) => onElementMouseDown(e, "image", image.id)}
          />
        ))}
      </div>
    </div>
  );
};
