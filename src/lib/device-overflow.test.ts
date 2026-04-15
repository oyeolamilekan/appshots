import { describe, expect, it } from "vitest";
import { createDeviceInstance } from "./device-instances";
import {
  getDeviceLocalXForScreenshot,
  getRenderableDevicesForScreenshot,
  isDeviceVisibleInScreenshot,
} from "./device-overflow";

describe("getDeviceLocalXForScreenshot", () => {
  it("translates a device position into a neighboring screenshot", () => {
    expect(getDeviceLocalXForScreenshot(125, 0, 1)).toBe(25);
    expect(getDeviceLocalXForScreenshot(-20, 2, 1)).toBe(80);
  });
});

describe("isDeviceVisibleInScreenshot", () => {
  it("keeps nearby overflowed devices renderable", () => {
    const device = createDeviceInstance({ scale: 60 });

    expect(isDeviceVisibleInScreenshot(device, 20)).toBe(true);
    expect(isDeviceVisibleInScreenshot(device, 130)).toBe(true);
    expect(isDeviceVisibleInScreenshot(device, 180)).toBe(false);
  });
});

describe("getRenderableDevicesForScreenshot", () => {
  it("includes visible overflow devices from adjacent screenshots", () => {
    const screenshots = [
      {
        id: "screen-1",
        devices: [createDeviceInstance({ id: "device-a", x: 125, scale: 50 })],
      },
      {
        id: "screen-2",
        devices: [createDeviceInstance({ id: "device-b", x: 50, scale: 50 })],
      },
    ].map((screenshot) => ({
      headline: "",
      subheadline: "",
      backgroundColor: "#000000",
      backgroundMode: "solid" as const,
      gradientPresetId: null,
      textColor: "#ffffff",
      headlineX: 50,
      headlineY: 10,
      headlineWidth: 80,
      subheadlineX: 50,
      subheadlineY: 20,
      subheadlineWidth: 80,
      fontFamily: "Inter",
      overlayImages: [],
      activeDeviceId: screenshot.devices[0].id,
      ...screenshot,
    }));

    const renderables = getRenderableDevicesForScreenshot(screenshots, 1);

    expect(renderables).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          ownerScreenshotId: "screen-1",
          localX: 25,
          device: expect.objectContaining({ id: "device-a" }),
        }),
        expect.objectContaining({
          ownerScreenshotId: "screen-2",
          localX: 50,
          device: expect.objectContaining({ id: "device-b" }),
        }),
      ]),
    );
  });
});
