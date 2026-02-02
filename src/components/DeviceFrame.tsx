import { useMemo } from "react";
import { useEditor } from "../context/EditorContext";
import type { Screenshot } from "../types";

interface DeviceFrameProps {
  screenshot: Screenshot;
}

export const DeviceFrame = ({ screenshot }: DeviceFrameProps) => {
  const { selectedDevice, selectedColor } = useEditor();

  // Device detection helpers
  const isSamsungDevice = selectedDevice.id.startsWith("samsung-");
  const isSamsungTablet = selectedDevice.id.includes("tab");

  return useMemo(
    () => (
      <div
        className="relative w-full shadow-2xl"
        style={{
          aspectRatio: `${selectedDevice.width} / ${selectedDevice.height}`,
          background: selectedColor.frameColors
            ? `linear-gradient(135deg, ${selectedColor.frameColors.join(", ")})`
            : selectedColor.frame,
          borderRadius: selectedDevice.frameRadius.outer,
          padding: "1.2%",
          boxShadow:
            "inset 0 0 4px 1px rgba(255,255,255,0.3), inset 0 0 0 2px rgba(0,0,0,0.2), 0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          border: "1px solid rgba(0,0,0,0.1)",
        }}
      >
        {/* Screen */}
        <div
          className="relative w-full h-full overflow-hidden"
          style={{
            backgroundColor: "#000",
            borderRadius: selectedDevice.frameRadius.inner,
          }}
        >
          {screenshot.screenshotSrc ? (
            <img
              src={screenshot.screenshotSrc}
              alt="Screenshot"
              className="w-full h-full object-fill"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#1c1c1e]">
              <span className="text-gray-600 text-[10px]">No image</span>
            </div>
          )}

          {/* Dynamic Island - iPhone only */}
          {selectedDevice.hasIsland && !isSamsungDevice && (
            <div
              className="absolute left-1/2 -translate-x-1/2 bg-black z-20"
              style={{
                top: "1.8%",
                width: "28%",
                height: "3.2%",
                borderRadius: "50px",
              }}
            />
          )}

          {/* Notch for older iPhones - iPhone only */}
          {!selectedDevice.hasIsland && selectedDevice.notchWidth > 0 && !isSamsungDevice && (
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 bg-black z-20"
              style={{
                width: "35%",
                height: "3.5%",
                borderRadius: "0 0 20px 20px",
              }}
            />
          )}

          {/* Punch-hole camera - Samsung phones (top center) */}
          {isSamsungDevice && !isSamsungTablet && (
            <div
              className="absolute left-1/2 -translate-x-1/2 bg-black z-20 rounded-full"
              style={{
                top: "2%",
                width: "2.5%",
                aspectRatio: "1",
              }}
            />
          )}

          {/* Punch-hole camera - Samsung tablets (top, offset left) */}
          {isSamsungDevice && isSamsungTablet && (
            <div
              className="absolute bg-black z-20 rounded-full"
              style={{
                top: "1.5%",
                left: "35%",
                width: "1.8%",
                aspectRatio: "1",
              }}
            />
          )}
        </div>

        {/* iPhone buttons */}
        {!isSamsungDevice && (
          <>
            {/* Side button (right) */}
            <div
              className="absolute -right-[0.8%] top-[18%] w-[0.8%] h-[8%] rounded-r-xs"
              style={{
                background: selectedColor.frameColors
                  ? `linear-gradient(to right, ${selectedColor.frameColors[2]}, ${selectedColor.frameColors[0]})`
                  : selectedColor.frame,
                boxShadow:
                  "inset 1px 0 2px rgba(255,255,255,0.3), 2px 0 4px rgba(0,0,0,0.2)",
              }}
            />

            {/* Silent switch (left) */}
            <div
              className="absolute -left-[0.8%] top-[15%] w-[0.8%] h-[4%] rounded-l-xs"
              style={{
                background: selectedColor.frameColors
                  ? `linear-gradient(to left, ${selectedColor.frameColors[2]}, ${selectedColor.frameColors[0]})`
                  : selectedColor.frame,
                boxShadow:
                  "inset -1px 0 2px rgba(255,255,255,0.3), -2px 0 4px rgba(0,0,0,0.2)",
              }}
            />
            {/* Volume up (left) */}
            <div
              className="absolute -left-[0.8%] top-[21%] w-[0.8%] h-[6%] rounded-l-xs"
              style={{
                background: selectedColor.frameColors
                  ? `linear-gradient(to left, ${selectedColor.frameColors[2]}, ${selectedColor.frameColors[0]})`
                  : selectedColor.frame,
                boxShadow:
                  "inset -1px 0 2px rgba(255,255,255,0.3), -2px 0 4px rgba(0,0,0,0.2)",
              }}
            />
            {/* Volume down (left) */}
            <div
              className="absolute -left-[0.8%] top-[28%] w-[0.8%] h-[6%] rounded-l-xs"
              style={{
                background: selectedColor.frameColors
                  ? `linear-gradient(to left, ${selectedColor.frameColors[2]}, ${selectedColor.frameColors[0]})`
                  : selectedColor.frame,
                boxShadow:
                  "inset -1px 0 2px rgba(255,255,255,0.3), -2px 0 4px rgba(0,0,0,0.2)",
              }}
            />
          </>
        )}

        {/* Samsung buttons - all on right side */}
        {isSamsungDevice && (
          <>
            {/* Power button (right) */}
            <div
              className="absolute -right-[0.8%] top-[22%] w-[0.8%] h-[5%] rounded-r-xs"
              style={{
                background: selectedColor.frameColors
                  ? `linear-gradient(to right, ${selectedColor.frameColors[2]}, ${selectedColor.frameColors[0]})`
                  : selectedColor.frame,
                boxShadow:
                  "inset 1px 0 2px rgba(255,255,255,0.3), 2px 0 4px rgba(0,0,0,0.2)",
              }}
            />
            {/* Volume up (right) */}
            <div
              className="absolute -right-[0.8%] top-[29%] w-[0.8%] h-[6%] rounded-r-xs"
              style={{
                background: selectedColor.frameColors
                  ? `linear-gradient(to right, ${selectedColor.frameColors[2]}, ${selectedColor.frameColors[0]})`
                  : selectedColor.frame,
                boxShadow:
                  "inset 1px 0 2px rgba(255,255,255,0.3), 2px 0 4px rgba(0,0,0,0.2)",
              }}
            />
            {/* Volume down (right) */}
            <div
              className="absolute -right-[0.8%] top-[36%] w-[0.8%] h-[6%] rounded-r-xs"
              style={{
                background: selectedColor.frameColors
                  ? `linear-gradient(to right, ${selectedColor.frameColors[2]}, ${selectedColor.frameColors[0]})`
                  : selectedColor.frame,
                boxShadow:
                  "inset 1px 0 2px rgba(255,255,255,0.3), 2px 0 4px rgba(0,0,0,0.2)",
              }}
            />
          </>
        )}
      </div>
    ),
    [screenshot.screenshotSrc, selectedDevice, selectedColor],
  );
};
