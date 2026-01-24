import { useEditor } from "../context/EditorContext";
import { devices, exportSizes } from "../constants";

export const LeftSidebar = () => {
  const {
    selectedDeviceId,
    setSelectedDeviceId,
    selectedColorId,
    setSelectedColorId,
    selectedDevice,
    exportSizeId,
    setExportSizeId,
    handleExport,
    screenshots,
  } = useEditor();

  return (
    <aside className="w-72 shrink-0 border-r border-white/10 bg-[#141414] flex flex-col">
      <div className="p-4 border-b border-white/10">
        <h1 className="text-lg font-semibold">App Store Editor</h1>
        <p className="text-xs text-gray-400 mt-1">
          Create beautiful screenshots
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Device Section */}
        <section className="rounded-lg bg-[#1e1e1e] p-3">
          <h2 className="text-xs font-medium text-gray-300 uppercase tracking-wider mb-3">
            Device
          </h2>
          <div className="space-y-2">
            {devices.map((device) => (
              <button
                key={device.id}
                className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                  selectedDeviceId === device.id
                    ? "bg-white text-black"
                    : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
                }`}
                onClick={() => {
                  setSelectedDeviceId(device.id);
                  setSelectedColorId(device.colors[0].id);
                }}
              >
                {device.label}
              </button>
            ))}
          </div>
          <div className="mt-3">
            <p className="text-xs text-gray-400 mb-2">Color</p>
            <div className="flex flex-wrap gap-2">
              {selectedDevice.colors.map((color) => (
                <button
                  key={color.id}
                  className={`w-7 h-7 rounded-full border-2 transition-all ${
                    selectedColorId === color.id
                      ? "border-white scale-110"
                      : "border-transparent"
                  }`}
                  style={{ backgroundColor: color.frame }}
                  onClick={() => setSelectedColorId(color.id)}
                  title={color.label}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Export Section */}
        <section className="rounded-lg bg-[#1e1e1e] p-3">
          <h2 className="text-xs font-medium text-gray-300 uppercase tracking-wider mb-3">
            Export
          </h2>
          <div className="space-y-2">
            {exportSizes.map((size) => (
              <button
                key={size.id}
                className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                  exportSizeId === size.id
                    ? "bg-white text-black"
                    : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
                }`}
                onClick={() => setExportSizeId(size.id)}
              >
                {size.label}
              </button>
            ))}
          </div>
          <button
            onClick={handleExport}
            className="w-full mt-3 bg-white hover:bg-neutral-200 text-black font-medium py-2.5 rounded-lg transition-colors"
          >
            Export All ({screenshots.length})
          </button>
        </section>
      </div>
    </aside>
  );
};
