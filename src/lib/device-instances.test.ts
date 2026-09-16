import { describe, expect, it } from "vitest";
import {
  DEFAULT_DEVICE_SHADOW,
  createDeviceInstance,
  ensureDeviceInstances,
  getDeviceSpecById,
  isAnonymousDevice,
} from "./device-instances";

describe("createDeviceInstance", () => {
  it("fills in the default device settings for a new instance", () => {
    const device = createDeviceInstance();

    expect(device.screenshotSrc).toBeNull();
    expect(device.x).toBe(50);
    expect(device.y).toBe(30);
    expect(device.scale).toBe(85);
    expect(device.rotation).toBe(0);
    expect(device.style).toBe("flat");
    expect(device.rotateY).toBe(-15);
    expect(device.rotateX).toBe(5);
    expect(device.shadow).toEqual(DEFAULT_DEVICE_SHADOW);
  });
});

describe("ensureDeviceInstances", () => {
  it("migrates legacy single-device screenshot fields into a device instance", () => {
    const { devices, activeDeviceId } = ensureDeviceInstances(
      {
        screenshotSrc: "data:image/png;base64,legacy",
        deviceScale: 72,
        deviceOffsetY: 42,
        deviceRotation: 12,
        deviceStyle: "3d",
        device3dRotateY: -22,
        device3dRotateX: 8,
        deviceShadow: {
          enabled: true,
          color: "#123456",
          blur: 24,
          offsetX: 3,
          offsetY: 9,
        },
      },
      "iphone-15-pro-max",
      "natural",
    );

    expect(devices).toHaveLength(1);
    expect(devices[0]).toMatchObject({
      deviceId: "iphone-15-pro-max",
      colorId: "natural",
      screenshotSrc: "data:image/png;base64,legacy",
      scale: 72,
      y: 42,
      rotation: 12,
      style: "3d",
      rotateY: -22,
      rotateX: 8,
      shadow: {
        enabled: true,
        color: "#123456",
        blur: 24,
        offsetX: 3,
        offsetY: 9,
      },
    });
    expect(activeDeviceId).toBe(devices[0].id);
  });

  it("preserves valid device arrays and falls back active selection safely", () => {
    const { devices, activeDeviceId } = ensureDeviceInstances({
      devices: [
        {
          id: "device-a",
          deviceId: "iphone-15-pro-max",
          colorId: "white",
          x: 20,
          y: 25,
        },
        {
          id: "device-b",
          deviceId: "samsung-galaxy-s24-ultra",
          colorId: "titanium-black",
          x: 70,
          y: 28,
        },
      ],
      activeDeviceId: "missing-device",
    });

    expect(devices).toHaveLength(2);
    expect(devices[0]).toMatchObject({
      id: "device-a",
      deviceId: "iphone-15-pro-max",
      colorId: "white",
      x: 20,
      y: 25,
    });
    expect(devices[1]).toMatchObject({
      id: "device-b",
      deviceId: "samsung-galaxy-s24-ultra",
      colorId: "titanium-black",
      x: 70,
      y: 28,
    });
    expect(activeDeviceId).toBe("device-a");
  });
});

describe("anonymous device", () => {
  it("recognizes the anonymous device id", () => {
    expect(isAnonymousDevice("anonymous")).toBe(true);
    expect(isAnonymousDevice("iphone-15-pro-max")).toBe(false);
  });

  it("resolves the anonymous spec with a dummy color", () => {
    const spec = getDeviceSpecById("anonymous");

    expect(spec).toMatchObject({
      id: "anonymous",
      label: "Anonymous",
      width: 1290,
      height: 2796,
      hasIsland: false,
      notchWidth: 0,
      notchHeight: 0,
      frameRadius: { outer: "12.5%/5.8%", inner: "12.5%/5.8%" },
    });
    expect(spec.colors).toEqual([
      expect.objectContaining({ id: "none", frame: "transparent" }),
    ]);
  });

  it("creates an anonymous device instance with the dummy color", () => {
    const device = createDeviceInstance({ deviceId: "anonymous" });

    expect(device).toMatchObject({
      deviceId: "anonymous",
      colorId: "none",
    });
  });
});
