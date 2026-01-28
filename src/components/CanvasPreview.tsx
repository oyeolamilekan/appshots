import { useEffect, useCallback } from "react";
import { useEditor } from "../context/EditorContext";
import { DeviceFrame } from "./DeviceFrame";

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

  // Resize observer to update preview dimensions for export scaling
  const updateDimensions = useCallback(() => {
    if (previewRef.current) {
      const { clientWidth, clientHeight } = previewRef.current;
      setPreviewDimensions({
        width: clientWidth,
        height: clientHeight,
      });
    }
  }, [setPreviewDimensions, previewRef]);

  useEffect(() => {
    updateDimensions();
    const observer = new ResizeObserver(updateDimensions);
    if (previewRef.current) {
      observer.observe(previewRef.current);
    }
    return () => observer.disconnect();
  }, [updateDimensions, previewRef, activeScreenshotId]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top Toolbar */}
      <div className="h-14 border-b border-white/10 bg-[#141414] flex items-center px-4 gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={addScreenshot}
            className="flex items-center gap-1.5 bg-white hover:bg-neutral-200 text-black text-sm font-medium px-3 py-1.5 rounded-md transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Screenshot
          </button>
        </div>
        <div className="flex-1" />
        <span className="text-xs text-gray-400">
          {screenshots.length} screenshot{screenshots.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Preview Area - Horizontal Scroll */}
      <div
        ref={canvasContainerRef}
        className="flex-1 overflow-x-auto overflow-y-hidden bg-[#0a0a0a] p-6"
      >
        <div className="flex gap-4 h-full min-w-max">
          {screenshots.map((screenshot) => (
            <div
              key={screenshot.id}
              ref={
                activeScreenshotId === screenshot.id ? previewRef : undefined
              }
              onClick={() => {
                if (activeScreenshotId !== screenshot.id) {
                  setActiveScreenshotId(screenshot.id);
                  setSelectedElement(null);
                }
              }}
              onMouseUp={handleElementMouseUp}
              onMouseLeave={handleElementMouseUp}
              onMouseDown={(event) => {
                // Only deselect if clicking directly on the background, not on elements
                if (
                  activeScreenshotId === screenshot.id &&
                  !(event.target as HTMLElement).closest(
                    "[data-draggable-element]",
                  )
                ) {
                  setSelectedElement(null);
                }
              }}
              className={`relative h-full rounded-xl overflow-hidden cursor-pointer transition-all ${
                activeScreenshotId === screenshot.id
                  ? "ring-2 ring-white ring-offset-2 ring-offset-[#0a0a0a]"
                  : "opacity-70 hover:opacity-100"
              }`}
              style={{
                background: getBackgroundStyle(screenshot),
                aspectRatio: `${exportSize.width}/${exportSize.height}`,
              }}
            >
              {/* Remove button */}
              {screenshots.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeScreenshot(screenshot.id);
                  }}
                  className="absolute top-2 right-2 w-6 h-6 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white z-10"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}

              {/* Content */}
              <div className="absolute inset-0 select-none">
                {/* Overlay Images Behind Device */}
                {screenshot.overlayImages
                  .filter((img) => img.layer === "behind")
                  .map((overlayImg, index) => (
                    <div
                      key={overlayImg.id}
                      data-draggable-element="image"
                      className="absolute cursor-move select-none"
                      style={{
                        left: `${overlayImg.x}%`,
                        top: `${overlayImg.y}%`,
                        transform: `translate(-50%, -50%) rotate(${overlayImg.rotation ?? 0}deg)`,
                        width: `${overlayImg.width}%`,
                        height: `${overlayImg.height}%`,
                        zIndex: 10 + index,
                        outline:
                          activeScreenshotId === screenshot.id &&
                          selectedElement?.type === "image" &&
                          selectedElement?.id === overlayImg.id
                            ? "2px dashed rgba(255,255,255,0.8)"
                            : "none",
                        outlineOffset: "4px",
                      }}
                      onMouseDown={(e) => {
                        if (activeScreenshotId === screenshot.id) {
                          handleElementMouseDown(e, "image", overlayImg.id);
                        }
                      }}
                    >
                      <img
                        src={overlayImg.src}
                        alt="Overlay"
                        className="w-full h-full object-contain pointer-events-none"
                        style={{
                          filter: overlayImg.shadow?.enabled
                            ? `drop-shadow(${overlayImg.shadow.offsetX}px ${overlayImg.shadow.offsetY}px ${overlayImg.shadow.blur}px ${overlayImg.shadow.color})`
                            : undefined,
                        }}
                      />
                      {activeScreenshotId === screenshot.id &&
                        selectedElement?.type === "image" &&
                        selectedElement?.id === overlayImg.id && (
                          <>
                            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-neutral-400 rounded-full shadow-sm" />
                            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-neutral-400 rounded-full shadow-sm" />
                            <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-neutral-400 rounded-full shadow-sm" />
                            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-neutral-400 rounded-full shadow-sm" />
                          </>
                        )}
                    </div>
                  ))}

                {/* Headline - Draggable */}
                <div
                  data-draggable-element="headline"
                  className="absolute cursor-move text-center font-bold select-none whitespace-pre-wrap overflow-hidden"
                  style={{
                    left: `${screenshot.headlineX}%`,
                    top: `${screenshot.headlineY}%`,
                    transform: "translateX(-50%)",
                    width: `${screenshot.headlineWidth}%`,
                    maxWidth: `${screenshot.headlineWidth}%`,
                    fontSize: `${headlineFontSize / 3}px`,
                    lineHeight: 1.1,
                    color: screenshot.textColor,
                    fontFamily: `'${screenshot.fontFamily}', sans-serif`,
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    zIndex: 60,
                    outline:
                      activeScreenshotId === screenshot.id &&
                      selectedElement?.type === "headline"
                        ? "2px solid rgba(139, 92, 246, 0.8)"
                        : "none",
                    outlineOffset: "2px",
                    background:
                      activeScreenshotId === screenshot.id &&
                      selectedElement?.type === "headline"
                        ? "rgba(139, 92, 246, 0.15)"
                        : "transparent",
                    padding: "4px",
                    borderRadius: "4px",
                    boxShadow:
                      activeScreenshotId === screenshot.id &&
                      selectedElement?.type === "headline"
                        ? "0 0 0 1px rgba(139, 92, 246, 0.4)"
                        : "none",
                  }}
                  onMouseDown={(e) => {
                    if (activeScreenshotId === screenshot.id) {
                      handleElementMouseDown(e, "headline");
                    }
                  }}
                  dangerouslySetInnerHTML={{ __html: screenshot.headline }}
                />

                {/* Subheadline - Draggable */}
                <div
                  data-draggable-element="subheadline"
                  className="absolute cursor-move text-center font-semibold select-none whitespace-pre-wrap overflow-hidden"
                  style={{
                    left: `${screenshot.subheadlineX}%`,
                    top: `${screenshot.subheadlineY}%`,
                    transform: "translateX(-50%)",
                    width: `${screenshot.subheadlineWidth}%`,
                    maxWidth: `${screenshot.subheadlineWidth}%`,
                    fontSize: `${subheadlineFontSize / 3}px`,
                    lineHeight: 1.1,
                    color: screenshot.textColor,
                    fontFamily: `'${screenshot.fontFamily}', sans-serif`,
                    wordWrap: "break-word",
                    overflowWrap: "break-word",
                    zIndex: 60,
                    outline:
                      activeScreenshotId === screenshot.id &&
                      selectedElement?.type === "subheadline"
                        ? "2px solid rgba(139, 92, 246, 0.8)"
                        : "none",
                    outlineOffset: "2px",
                    background:
                      activeScreenshotId === screenshot.id &&
                      selectedElement?.type === "subheadline"
                        ? "rgba(139, 92, 246, 0.15)"
                        : "transparent",
                    padding: "4px",
                    borderRadius: "4px",
                    boxShadow:
                      activeScreenshotId === screenshot.id &&
                      selectedElement?.type === "subheadline"
                        ? "0 0 0 1px rgba(139, 92, 246, 0.4)"
                        : "none",
                  }}
                  onMouseDown={(e) => {
                    if (activeScreenshotId === screenshot.id) {
                      handleElementMouseDown(e, "subheadline");
                    }
                  }}
                  dangerouslySetInnerHTML={{ __html: screenshot.subheadline }}
                />

                {/* Device */}
                <div
                  className="absolute left-1/2"
                  style={{
                    width: `${screenshot.deviceScale}%`,
                    top: `${screenshot.deviceOffsetY}%`,
                    transform: `translateX(-50%)`,
                    zIndex: 50,
                    filter: screenshot.deviceShadow?.enabled
                      ? `drop-shadow(${screenshot.deviceShadow.offsetX}px ${screenshot.deviceShadow.offsetY}px ${screenshot.deviceShadow.blur}px ${screenshot.deviceShadow.color})`
                      : undefined,
                  }}
                >
                  <div
                    style={{
                      transform: `rotate(${screenshot.deviceRotation}deg)`,
                      transformOrigin: "center center",
                    }}
                  >
                    <DeviceFrame screenshot={screenshot} />
                  </div>
                </div>

                {/* Overlay Images In Front of Device */}
                {screenshot.overlayImages
                  .filter((img) => img.layer !== "behind")
                  .map((overlayImg, index) => (
                    <div
                      key={overlayImg.id}
                      data-draggable-element="image"
                      className="absolute cursor-move select-none"
                      style={{
                        left: `${overlayImg.x}%`,
                        top: `${overlayImg.y}%`,
                        transform: `translate(-50%, -50%) rotate(${overlayImg.rotation ?? 0}deg)`,
                        width: `${overlayImg.width}%`,
                        height: `${overlayImg.height}%`,
                        zIndex: 100 + index,
                        outline:
                          activeScreenshotId === screenshot.id &&
                          selectedElement?.type === "image" &&
                          selectedElement?.id === overlayImg.id
                            ? "2px dashed rgba(255,255,255,0.8)"
                            : "none",
                        outlineOffset: "4px",
                      }}
                      onMouseDown={(e) => {
                        if (activeScreenshotId === screenshot.id) {
                          handleElementMouseDown(e, "image", overlayImg.id);
                        }
                      }}
                    >
                      <img
                        src={overlayImg.src}
                        alt="Overlay"
                        className="w-full h-full object-contain pointer-events-none"
                        style={{
                          filter: overlayImg.shadow?.enabled
                            ? `drop-shadow(${overlayImg.shadow.offsetX}px ${overlayImg.shadow.offsetY}px ${overlayImg.shadow.blur}px ${overlayImg.shadow.color})`
                            : undefined,
                        }}
                      />
                      {activeScreenshotId === screenshot.id &&
                        selectedElement?.type === "image" &&
                        selectedElement?.id === overlayImg.id && (
                          <>
                            <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-neutral-400 rounded-full shadow-sm" />
                            <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-neutral-400 rounded-full shadow-sm" />
                            <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-white border-2 border-neutral-400 rounded-full shadow-sm" />
                            <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-white border-2 border-neutral-400 rounded-full shadow-sm" />
                          </>
                        )}
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
