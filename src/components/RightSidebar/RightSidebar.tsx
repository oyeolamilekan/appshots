/**
 * RightSidebar Component
 *
 * Main sidebar containing position presets, layout, content, appearance, and overlay image controls.
 *
 * Features:
 * - Position presets for quick device positioning
 * - Device layout controls (size, position, rotation, shadow)
 * - Text content editors (headline, subheadline)
 * - Appearance settings (background, colors, fonts)
 * - Overlay image management
 */

import { useEditor } from "../../context/EditorContext";
import { gradientPresets } from "../../constants";
import { DeviceInstancesSection } from "./DeviceInstancesSection";
import { ScreenshotImageSection } from "./ScreenshotImageSection";
import { PositionPresets } from "./PositionPresets";
import { LayoutSection } from "./LayoutSection";
import { ContentSection } from "./ContentSection";
import { AppearanceSection } from "./AppearanceSection";
import { OverlayImagesSection } from "./OverlayImagesSection";
import { STYLES } from "./constants";

/**
 * RightSidebar - Main properties sidebar
 *
 * Provides all editing controls for the active screenshot.
 *
 * @example
 * <RightSidebar />
 */
export const RightSidebar = () => {
  const {
    activeScreenshot,
    activeDevice,
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
    addDevice,
    selectDevice,
    removeDevice,
    bringDeviceForward,
    sendDeviceBackward,
    bringImageForward,
    sendImageBackward,
  } = useEditor();

  return (
    <aside className={STYLES.sidebar}>
      <div className={STYLES.content}>
        <DeviceInstancesSection
          screenshot={activeScreenshot}
          onAddDevice={addDevice}
          onSelectDevice={selectDevice}
          onRemoveDevice={removeDevice}
          onBringForward={bringDeviceForward}
          onSendBackward={sendDeviceBackward}
        />

        <ScreenshotImageSection
          device={activeDevice}
          fileInputRef={fileInputRef}
          onFileUpload={handleFileUpload}
        />

        <PositionPresets
          device={activeDevice}
          onUpdateDevice={(updates) =>
            updateActiveScreenshot({
              devices: activeScreenshot.devices.map((device) =>
                device.id === activeDevice.id ? { ...device, ...updates } : device,
              ),
            })
          }
        />

        <LayoutSection
          device={activeDevice}
          screenshot={activeScreenshot}
          headlineFontSize={headlineFontSize}
          subheadlineFontSize={subheadlineFontSize}
          onUpdateDevice={(updates) =>
            updateActiveScreenshot({
              devices: activeScreenshot.devices.map((device) =>
                device.id === activeDevice.id ? { ...device, ...updates } : device,
              ),
            })
          }
          onUpdateScreenshot={updateActiveScreenshot}
          onHeadlineSizeChange={setHeadlineFontSize}
          onSubheadlineSizeChange={setSubheadlineFontSize}
        />

        <ContentSection
          screenshot={activeScreenshot}
          onUpdateScreenshot={updateActiveScreenshot}
        />

        <AppearanceSection
          screenshot={activeScreenshot}
          gradientPresets={gradientPresets}
          onUpdateScreenshot={updateActiveScreenshot}
          onOpenFontPicker={() => setIsFontPickerOpen(true)}
        />

        <OverlayImagesSection
          screenshot={activeScreenshot}
          selectedElement={selectedElement}
          overlayImageInputRef={overlayImageInputRef}
          onSelectElement={setSelectedElement}
          onAddImage={addOverlayImage}
          onRemoveImage={removeOverlayImage}
          onUpdateSize={updateOverlayImageSize}
          onUpdateLayer={updateOverlayImageLayer}
          onUpdateRotation={updateOverlayImageRotation}
          onUpdateShadow={updateOverlayImageShadow}
          onBringForward={bringImageForward}
          onSendBackward={sendImageBackward}
        />
      </div>
    </aside>
  );
};
