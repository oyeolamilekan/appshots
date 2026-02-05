/**
 * CanvasPreview Component
 *
 * Main canvas area displaying all screenshots with interactive editing capabilities.
 * Supports drag-and-drop positioning, element selection, and screenshot management.
 *
 * Features:
 * - Horizontal scrolling screenshot gallery
 * - Drag-to-position text and overlay elements
 * - Add/remove screenshots
 * - Responsive preview scaling
 */

import { useEditor } from "../../context/EditorContext";
import { Toolbar } from "./Toolbar";
import { ScreenshotCard } from "./ScreenshotCard";
import { useResizeObserver } from "./useResizeObserver";

/**
 * CanvasPreview - Main screenshot editing canvas
 *
 * Displays all screenshots in a horizontal scrollable gallery.
 * The active screenshot can be edited by dragging elements.
 *
 * @example
 * <CanvasPreview />
 */
export const CanvasPreview = () => {
  const {
    screenshots,
    activeScreenshotId,
    setActiveScreenshotId,
    setSelectedElement,
    removeScreenshot,
    handleElementMouseDown,
    handleElementMouseUp,
    getBackgroundStyle,
    addScreenshot,
    previewRef,
    canvasContainerRef,
    selectedElement,
    headlineFontSize,
    subheadlineFontSize,
    setPreviewDimensions,
    exportSize,
  } = useEditor();

  // Track preview dimensions for export scaling
  useResizeObserver({
    elementRef: previewRef,
    onResize: setPreviewDimensions,
    deps: [activeScreenshotId],
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Toolbar
        onAddScreenshot={addScreenshot}
        screenshotCount={screenshots.length}
      />

      {/* Preview area with horizontal scroll */}
      <div
        ref={canvasContainerRef}
        className="flex-1 overflow-x-auto overflow-y-hidden bg-[#0a0a0a] p-6"
      >
        <div className="flex gap-4 h-full min-w-max">
          {screenshots.map((screenshot) => (
            <ScreenshotCard
              key={screenshot.id}
              screenshot={screenshot}
              isActive={activeScreenshotId === screenshot.id}
              canRemove={screenshots.length > 1}
              selectedElement={selectedElement}
              exportSize={exportSize}
              headlineFontSize={headlineFontSize}
              subheadlineFontSize={subheadlineFontSize}
              previewRef={previewRef}
              getBackgroundStyle={getBackgroundStyle}
              onSelect={() => {
                if (activeScreenshotId !== screenshot.id) {
                  setActiveScreenshotId(screenshot.id);
                  setSelectedElement(null);
                }
              }}
              onRemove={() => removeScreenshot(screenshot.id)}
              onDeselect={() => setSelectedElement(null)}
              onElementMouseDown={handleElementMouseDown}
              onElementMouseUp={handleElementMouseUp}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
