import { ChevronDown } from "lucide-react";
import { useEditor } from "../context/EditorContext";
import { gradientPresets } from "../constants";

export const RightSidebar = () => {
  const {
    activeScreenshot,
    updateActiveScreenshot,
    headlineFontSize,
    setHeadlineFontSize,
    subheadlineFontSize,
    setSubheadlineFontSize,
    setIsFontPickerOpen,
    fileInputRef,
    handleFileUpload,
    overlayImageInputRef,
    addOverlayImage,
    selectedElement,
    setSelectedElement,
    removeOverlayImage,
    updateOverlayImageSize,
    updateOverlayImageLayer,
    updateOverlayImageRotation,
    updateOverlayImageShadow,
    bringImageForward,
    sendImageBackward,
  } = useEditor();

  return (
    <aside className="w-80 shrink-0 border-l border-white/10 bg-[#141414] overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Layout Section */}
        <section className="rounded-lg bg-[#1e1e1e] p-3">
          <h2 className="text-xs font-medium text-gray-300 uppercase tracking-wider mb-3">
            Layout
          </h2>
          <div className="space-y-3">
            <label className="block">
              <span className="text-xs text-gray-400">
                Device Size: {activeScreenshot.deviceScale}%
              </span>
              <input
                type="range"
                min="40"
                max="90"
                value={activeScreenshot.deviceScale}
                onChange={(e) =>
                  updateActiveScreenshot({
                    deviceScale: Number(e.target.value),
                  })
                }
                className="w-full mt-1 accent-white"
              />
            </label>
            <label className="block">
              <span className="text-xs text-gray-400">
                Device Position: {activeScreenshot.deviceOffsetY}%
              </span>
              <input
                type="range"
                min="20"
                max="60"
                value={activeScreenshot.deviceOffsetY}
                onChange={(e) =>
                  updateActiveScreenshot({
                    deviceOffsetY: Number(e.target.value),
                  })
                }
                className="w-full mt-1 accent-white"
              />
            </label>
            <label className="block">
              <span className="text-xs text-gray-400">
                Device Rotation: {activeScreenshot.deviceRotation}°
              </span>
              <input
                type="range"
                min="0"
                max="360"
                value={activeScreenshot.deviceRotation}
                onChange={(e) =>
                  updateActiveScreenshot({
                    deviceRotation: Number(e.target.value),
                  })
                }
                className="w-full mt-1 accent-white"
              />
            </label>
            {/* Device Shadow */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Device Shadow</span>
                <button
                  onClick={() =>
                    updateActiveScreenshot({
                      deviceShadow: {
                        ...activeScreenshot.deviceShadow,
                        enabled: !activeScreenshot.deviceShadow.enabled,
                      },
                    })
                  }
                  className={`w-8 h-4 rounded-full transition-colors ${
                    activeScreenshot.deviceShadow.enabled
                      ? "bg-white"
                      : "bg-[#333]"
                  }`}
                >
                  <div
                    className={`w-3 h-3 rounded-full bg-black transition-transform ${
                      activeScreenshot.deviceShadow.enabled
                        ? "translate-x-4"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
              {activeScreenshot.deviceShadow.enabled && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">Color</span>
                    <input
                      type="color"
                      value={activeScreenshot.deviceShadow.color}
                      onChange={(e) =>
                        updateActiveScreenshot({
                          deviceShadow: {
                            ...activeScreenshot.deviceShadow,
                            color: e.target.value,
                          },
                        })
                      }
                      className="w-6 h-6 rounded cursor-pointer"
                    />
                  </div>
                  <label className="block">
                    <span className="text-xs text-gray-500">
                      Blur: {activeScreenshot.deviceShadow.blur}px
                    </span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={activeScreenshot.deviceShadow.blur}
                      onChange={(e) =>
                        updateActiveScreenshot({
                          deviceShadow: {
                            ...activeScreenshot.deviceShadow,
                            blur: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full mt-1 accent-white"
                    />
                  </label>
                  <label className="block">
                    <span className="text-xs text-gray-500">
                      Offset Y: {activeScreenshot.deviceShadow.offsetY}px
                    </span>
                    <input
                      type="range"
                      min="-50"
                      max="50"
                      value={activeScreenshot.deviceShadow.offsetY}
                      onChange={(e) =>
                        updateActiveScreenshot({
                          deviceShadow: {
                            ...activeScreenshot.deviceShadow,
                            offsetY: Number(e.target.value),
                          },
                        })
                      }
                      className="w-full mt-1 accent-white"
                    />
                  </label>
                </>
              )}
            </div>
            <label className="block">
              <span className="text-xs text-gray-400">
                Headline Size: {headlineFontSize}px
              </span>
              <input
                type="range"
                min="32"
                max="120"
                value={headlineFontSize}
                onChange={(e) => setHeadlineFontSize(Number(e.target.value))}
                className="w-full mt-1 accent-white"
              />
            </label>
            <label className="block">
              <span className="text-xs text-gray-400">
                Subheadline Size: {subheadlineFontSize}px
              </span>
              <input
                type="range"
                min="20"
                max="72"
                value={subheadlineFontSize}
                onChange={(e) => setSubheadlineFontSize(Number(e.target.value))}
                className="w-full mt-1 accent-white"
              />
            </label>
            <label className="block">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400">Headline Width</span>
                <span className="text-xs text-neutral-400 font-medium">
                  {activeScreenshot.headlineWidth}%
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="120"
                step="5"
                value={activeScreenshot.headlineWidth}
                onChange={(e) =>
                  updateActiveScreenshot({
                    headlineWidth: Number(e.target.value),
                  })
                }
                className="w-full accent-white h-2 rounded-lg appearance-none cursor-pointer bg-[#2a2a2a]"
              />
            </label>
            <label className="block">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-400">Subheadline Width</span>
                <span className="text-xs text-neutral-400 font-medium">
                  {activeScreenshot.subheadlineWidth}%
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="120"
                step="5"
                value={activeScreenshot.subheadlineWidth}
                onChange={(e) =>
                  updateActiveScreenshot({
                    subheadlineWidth: Number(e.target.value),
                  })
                }
                className="w-full accent-white h-2 rounded-lg appearance-none cursor-pointer bg-[#2a2a2a]"
              />
            </label>
          </div>
        </section>

        {/* Content Section */}
        <section className="rounded-lg bg-[#1e1e1e] p-3">
          <h2 className="text-xs font-medium text-gray-300 uppercase tracking-wider mb-3">
            Content
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Headline
              </label>
              <textarea
                value={activeScreenshot.headline}
                onChange={(e) =>
                  updateActiveScreenshot({ headline: e.target.value })
                }
                className="w-full bg-[#2a2a2a] text-white text-sm rounded-md px-3 py-2 resize-none h-20 outline-none focus:ring-1 focus:ring-white"
                placeholder="Enter headline..."
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Subheadline
              </label>
              <textarea
                value={activeScreenshot.subheadline}
                onChange={(e) =>
                  updateActiveScreenshot({ subheadline: e.target.value })
                }
                className="w-full bg-[#2a2a2a] text-white text-sm rounded-md px-3 py-2 resize-none h-20 outline-none focus:ring-1 focus:ring-white"
                placeholder="Enter subheadline..."
              />
            </div>
          </div>
        </section>

        {/* Appearance Section */}
        <section className="rounded-lg bg-[#1e1e1e] p-3">
          <h2 className="text-xs font-medium text-gray-300 uppercase tracking-wider mb-3">
            Appearance
          </h2>
          <div className="space-y-4">
            {/* Background */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Background
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      updateActiveScreenshot({ backgroundMode: "solid" })
                    }
                    className={`flex-1 text-xs py-1.5 rounded-md ${
                      activeScreenshot.backgroundMode === "solid"
                        ? "bg-white text-black"
                        : "bg-[#2a2a2a] text-gray-300"
                    }`}
                  >
                    Solid
                  </button>
                  <button
                    onClick={() =>
                      updateActiveScreenshot({ backgroundMode: "gradient" })
                    }
                    className={`flex-1 text-xs py-1.5 rounded-md ${
                      activeScreenshot.backgroundMode === "gradient"
                        ? "bg-white text-black"
                        : "bg-[#2a2a2a] text-gray-300"
                    }`}
                  >
                    Gradient
                  </button>
                </div>
                {activeScreenshot.backgroundMode === "solid" ? (
                  <input
                    type="color"
                    value={activeScreenshot.backgroundColor}
                    onChange={(e) =>
                      updateActiveScreenshot({
                        backgroundColor: e.target.value,
                      })
                    }
                    className="w-full h-8 rounded-md cursor-pointer"
                  />
                ) : (
                  <div className="grid grid-cols-3 gap-1">
                    {gradientPresets.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() =>
                          updateActiveScreenshot({
                            gradientPresetId: preset.id,
                          })
                        }
                        className={`h-6 rounded-md ${
                          activeScreenshot.gradientPresetId === preset.id
                            ? "ring-2 ring-white"
                            : ""
                        }`}
                        style={{
                          background: `linear-gradient(135deg, ${preset.from}, ${preset.to})`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Text Color */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Text Color
              </label>
              <input
                type="color"
                value={activeScreenshot.textColor}
                onChange={(e) =>
                  updateActiveScreenshot({ textColor: e.target.value })
                }
                className="w-full h-8 rounded-md cursor-pointer"
              />
            </div>

            {/* Font Style */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Font Style
              </label>
              <button
                onClick={() => setIsFontPickerOpen(true)}
                className="w-full flex items-center justify-between bg-[#2a2a2a] hover:bg-[#333] text-white text-sm rounded-md px-3 py-2 transition-colors border border-transparent hover:border-white/10 outline-none focus:ring-1 focus:ring-white"
              >
                <span
                  style={{
                    fontFamily: `'${activeScreenshot.fontFamily}', sans-serif`,
                  }}
                >
                  {activeScreenshot.fontFamily}
                </span>
                <ChevronDown size={16} className="text-gray-400" />
              </button>
            </div>

            {/* Screenshot Image */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Screenshot Image
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full bg-[#2a2a2a] hover:bg-[#333] text-gray-300 text-sm py-2 rounded-md transition-colors"
              >
                {activeScreenshot.screenshotSrc
                  ? "Change Image"
                  : "Upload Image"}
              </button>
            </div>
          </div>
        </section>

        {/* Overlay Images Section */}
        <section className="rounded-lg bg-[#1e1e1e] p-3">
          <h2 className="text-xs font-medium text-gray-300 uppercase tracking-wider mb-3">
            Overlay Images
          </h2>
          <div className="space-y-2">
            <input
              ref={overlayImageInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) addOverlayImage(file);
                e.target.value = "";
              }}
              className="hidden"
            />
            <button
              onClick={() => overlayImageInputRef.current?.click()}
              className="w-full bg-[#2a2a2a] hover:bg-[#333] text-gray-300 text-sm py-2 rounded-md transition-colors"
            >
              + Add Image
            </button>

            {activeScreenshot.overlayImages.length > 0 && (
              <div className="space-y-2 mt-3">
                {activeScreenshot.overlayImages.map((img, index) => (
                  <div
                    key={img.id}
                    onClick={() =>
                      setSelectedElement({ type: "image", id: img.id })
                    }
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                      selectedElement?.type === "image" &&
                      selectedElement?.id === img.id
                        ? "bg-white/10 ring-1 ring-white"
                        : "bg-[#2a2a2a] hover:bg-[#333]"
                    }`}
                  >
                    <img
                      src={img.src}
                      alt={`Overlay ${index + 1}`}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-300 truncate">
                        Image {index + 1}
                      </p>
                      <p className="text-[10px] text-gray-500">
                        Layer {index + 1} of{" "}
                        {activeScreenshot.overlayImages.length}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          sendImageBackward(img.id);
                        }}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Send backward"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          bringImageForward(img.id);
                        }}
                        disabled={
                          index === activeScreenshot.overlayImages.length - 1
                        }
                        className="p-1 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        title="Bring forward"
                      >
                        <svg
                          className="w-3.5 h-3.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 10l7-7m0 0l7 7m-7-7v18"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeOverlayImage(img.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-400"
                        title="Remove"
                      >
                        <svg
                          className="w-3.5 h-3.5"
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
                    </div>
                  </div>
                ))}

                {selectedElement?.type === "image" && selectedElement.id && (
                  <div className="p-3 bg-[#2a2a2a] rounded-lg border border-white/5 space-y-3 mt-2">
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">
                        Size
                      </label>
                      <input
                        type="range"
                        min="5"
                        max="100"
                        value={
                          activeScreenshot.overlayImages.find(
                            (img) => img.id === selectedElement.id,
                          )?.width || 20
                        }
                        onChange={(e) =>
                          updateOverlayImageSize(
                            selectedElement.id!,
                            Number(e.target.value),
                          )
                        }
                        className="w-full accent-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">
                        Rotation:{" "}
                        {activeScreenshot.overlayImages.find(
                          (img) => img.id === selectedElement.id,
                        )?.rotation ?? 0}
                        °
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={
                          activeScreenshot.overlayImages.find(
                            (img) => img.id === selectedElement.id,
                          )?.rotation ?? 0
                        }
                        onChange={(e) =>
                          updateOverlayImageRotation(
                            selectedElement.id!,
                            Number(e.target.value),
                          )
                        }
                        className="w-full accent-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">
                        Layer Position
                      </label>
                      <div className="flex gap-1">
                        <button
                          onClick={() =>
                            updateOverlayImageLayer(
                              selectedElement.id!,
                              "behind",
                            )
                          }
                          className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${
                            activeScreenshot.overlayImages.find(
                              (img) => img.id === selectedElement.id,
                            )?.layer === "behind"
                              ? "bg-white text-black"
                              : "bg-[#333] text-gray-300 hover:bg-[#444]"
                          }`}
                        >
                          Behind Device
                        </button>
                        <button
                          onClick={() =>
                            updateOverlayImageLayer(
                              selectedElement.id!,
                              "front",
                            )
                          }
                          className={`flex-1 text-xs py-1.5 rounded-md transition-colors ${
                            (activeScreenshot.overlayImages.find(
                              (img) => img.id === selectedElement.id,
                            )?.layer ?? "front") === "front"
                              ? "bg-white text-black"
                              : "bg-[#333] text-gray-300 hover:bg-[#444]"
                          }`}
                        >
                          In Front
                        </button>
                      </div>
                    </div>
                    {/* Image Shadow */}
                    <div className="space-y-2 pt-2 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Shadow</span>
                        <button
                          onClick={() => {
                            const currentShadow =
                              activeScreenshot.overlayImages.find(
                                (img) => img.id === selectedElement.id,
                              )?.shadow;
                            if (currentShadow) {
                              updateOverlayImageShadow(selectedElement.id!, {
                                enabled: !currentShadow.enabled,
                              });
                            }
                          }}
                          className={`w-8 h-4 rounded-full transition-colors ${
                            activeScreenshot.overlayImages.find(
                              (img) => img.id === selectedElement.id,
                            )?.shadow?.enabled
                              ? "bg-white"
                              : "bg-[#333]"
                          }`}
                        >
                          <div
                            className={`w-3 h-3 rounded-full bg-black transition-transform ${
                              activeScreenshot.overlayImages.find(
                                (img) => img.id === selectedElement.id,
                              )?.shadow?.enabled
                                ? "translate-x-4"
                                : "translate-x-0.5"
                            }`}
                          />
                        </button>
                      </div>
                      {activeScreenshot.overlayImages.find(
                        (img) => img.id === selectedElement.id,
                      )?.shadow?.enabled && (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Color</span>
                            <input
                              type="color"
                              value={
                                activeScreenshot.overlayImages.find(
                                  (img) => img.id === selectedElement.id,
                                )?.shadow?.color ?? "#000000"
                              }
                              onChange={(e) =>
                                updateOverlayImageShadow(selectedElement.id!, {
                                  color: e.target.value,
                                })
                              }
                              className="w-6 h-6 rounded cursor-pointer"
                            />
                          </div>
                          <label className="block">
                            <span className="text-xs text-gray-500">
                              Blur:{" "}
                              {activeScreenshot.overlayImages.find(
                                (img) => img.id === selectedElement.id,
                              )?.shadow?.blur ?? 20}
                              px
                            </span>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={
                                activeScreenshot.overlayImages.find(
                                  (img) => img.id === selectedElement.id,
                                )?.shadow?.blur ?? 20
                              }
                              onChange={(e) =>
                                updateOverlayImageShadow(selectedElement.id!, {
                                  blur: Number(e.target.value),
                                })
                              }
                              className="w-full mt-1 accent-white"
                            />
                          </label>
                          <label className="block">
                            <span className="text-xs text-gray-500">
                              Offset Y:{" "}
                              {activeScreenshot.overlayImages.find(
                                (img) => img.id === selectedElement.id,
                              )?.shadow?.offsetY ?? 10}
                              px
                            </span>
                            <input
                              type="range"
                              min="-50"
                              max="50"
                              value={
                                activeScreenshot.overlayImages.find(
                                  (img) => img.id === selectedElement.id,
                                )?.shadow?.offsetY ?? 10
                              }
                              onChange={(e) =>
                                updateOverlayImageShadow(selectedElement.id!, {
                                  offsetY: Number(e.target.value),
                                })
                              }
                              className="w-full mt-1 accent-white"
                            />
                          </label>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </div>
    </aside>
  );
};
