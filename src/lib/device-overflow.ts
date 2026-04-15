import type { DeviceInstance, Screenshot } from "../types";

const SCREEN_WIDTH_PERCENT = 100;
const VISIBILITY_BUFFER_PERCENT = 35;

export interface RenderableDevice {
  device: DeviceInstance;
  ownerScreenshotId: string;
  ownerScreenshotIndex: number;
  targetScreenshotIndex: number;
  localX: number;
}

export const getDeviceLocalXForScreenshot = (
  deviceX: number,
  ownerScreenshotIndex: number,
  targetScreenshotIndex: number,
): number =>
  deviceX +
  (ownerScreenshotIndex - targetScreenshotIndex) * SCREEN_WIDTH_PERCENT;

export const isDeviceVisibleInScreenshot = (
  device: DeviceInstance,
  localX: number,
): boolean => {
  const halfWidth = device.scale / 2;

  return (
    localX + halfWidth > -VISIBILITY_BUFFER_PERCENT &&
    localX - halfWidth < SCREEN_WIDTH_PERCENT + VISIBILITY_BUFFER_PERCENT
  );
};

export const getRenderableDevicesForScreenshot = (
  screenshots: Screenshot[],
  targetScreenshotIndex: number,
): RenderableDevice[] =>
  screenshots.flatMap((screenshot, ownerScreenshotIndex) =>
    screenshot.devices
      .map((device) => {
        const localX = getDeviceLocalXForScreenshot(
          device.x,
          ownerScreenshotIndex,
          targetScreenshotIndex,
        );

        return {
          device,
          ownerScreenshotId: screenshot.id,
          ownerScreenshotIndex,
          targetScreenshotIndex,
          localX,
        };
      })
      .filter(({ device, localX }) =>
        isDeviceVisibleInScreenshot(device, localX),
      ),
  );
