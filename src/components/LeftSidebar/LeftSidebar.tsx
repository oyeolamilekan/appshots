/**
 * LeftSidebar Component
 *
 * Main sidebar containing project switcher, device selection and export options.
 *
 * Features:
 * - Project management (create, switch, rename, delete)
 * - Device model selection
 * - Device color selection
 * - Export size selection
 * - Export all screenshots button
 */

import { useEditor } from "../../context/EditorContext";
import { devices, exportSizes } from "../../constants";
import { SidebarHeader } from "./SidebarHeader";
import { DeviceSection } from "./DeviceSection";
import { ExportSection } from "./ExportSection";
import { ProjectSwitcher } from "../ProjectSwitcher";
import { STYLES } from "./constants";

/**
 * LeftSidebar - Main settings sidebar
 *
 * Provides controls for project management, device selection,
 * color options, and export functionality.
 *
 * @example
 * <LeftSidebar />
 */
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

  // Handle device selection with default color
  const handleDeviceSelect = (deviceId: string, defaultColorId: string) => {
    setSelectedDeviceId(deviceId);
    setSelectedColorId(defaultColorId);
  };

  return (
    <aside className={STYLES.sidebar}>
      <SidebarHeader />

      {/* Project Switcher */}
      <div className="px-4 pb-4 border-b border-zinc-800">
        <ProjectSwitcher />
      </div>

      <div className={STYLES.content}>
        <DeviceSection
          devices={devices}
          selectedDeviceId={selectedDeviceId}
          selectedColorId={selectedColorId}
          selectedDevice={selectedDevice}
          onDeviceSelect={handleDeviceSelect}
          onColorSelect={setSelectedColorId}
        />

        <ExportSection
          exportSizes={exportSizes}
          selectedSizeId={exportSizeId}
          screenshotCount={screenshots.length}
          onSizeSelect={setExportSizeId}
          onExport={handleExport}
        />
      </div>
    </aside>
  );
};
