import { devices } from "../constants";
import type {
  DeviceColor,
  DeviceInstance,
  DeviceSpec,
  DeviceStyle,
  ShadowConfig,
} from "../types";

type LegacyDeviceFields = {
  devices?: unknown;
  activeDeviceId?: unknown;
  screenshotSrc?: string | null;
  deviceScale?: number;
  deviceOffsetY?: number;
  deviceRotation?: number;
  deviceShadow?: ShadowConfig;
  deviceStyle?: DeviceStyle;
  device3dRotateY?: number;
  device3dRotateX?: number;
};

const createId = () => Math.random().toString(36).substring(2, 9);

export const DEFAULT_DEVICE_SHADOW: ShadowConfig = {
  enabled: true,
  color: "#000000",
  blur: 50,
  offsetX: 0,
  offsetY: 25,
};

export const getDeviceSpecById = (deviceId: string): DeviceSpec =>
  devices.find((device) => device.id === deviceId) ?? devices[0];

export const getDeviceColorById = (
  deviceId: string,
  colorId: string,
): DeviceColor => {
  const device = getDeviceSpecById(deviceId);
  return device.colors.find((color) => color.id === colorId) ?? device.colors[0];
};

export const createDeviceInstance = (
  overrides: Partial<DeviceInstance> = {},
): DeviceInstance => {
  const defaultDevice = getDeviceSpecById(overrides.deviceId ?? devices[0].id);
  const defaultColor = getDeviceColorById(
    defaultDevice.id,
    overrides.colorId ?? defaultDevice.colors[0].id,
  );

  return {
    id: overrides.id ?? createId(),
    deviceId: defaultDevice.id,
    colorId: defaultColor.id,
    screenshotSrc: overrides.screenshotSrc ?? null,
    x: overrides.x ?? 50,
    y: overrides.y ?? 30,
    scale: overrides.scale ?? 85,
    rotation: overrides.rotation ?? 0,
    shadow: {
      ...DEFAULT_DEVICE_SHADOW,
      ...overrides.shadow,
    },
    style: overrides.style ?? "flat",
    rotateY: overrides.rotateY ?? -15,
    rotateX: overrides.rotateX ?? 5,
  };
};

export const cloneDeviceInstance = (
  device: DeviceInstance,
  overrides: Partial<DeviceInstance> = {},
): DeviceInstance =>
  createDeviceInstance({
    ...device,
    ...overrides,
    id: overrides.id,
    shadow: {
      ...device.shadow,
      ...overrides.shadow,
    },
  });

const isDeviceInstance = (value: unknown): value is Partial<DeviceInstance> =>
  typeof value === "object" && value !== null;

export const ensureDeviceInstances = (
  screenshot: LegacyDeviceFields,
  fallbackDeviceId: string = devices[0].id,
  fallbackColorId: string = devices[0].colors[0].id,
): { devices: DeviceInstance[]; activeDeviceId: string } => {
  const fallbackDevice = getDeviceSpecById(fallbackDeviceId);
  const fallbackColor = getDeviceColorById(fallbackDevice.id, fallbackColorId);

  const normalizedDevices = Array.isArray(screenshot.devices)
    ? screenshot.devices
        .filter(isDeviceInstance)
        .map((device) =>
          createDeviceInstance({
            id: typeof device.id === "string" ? device.id : undefined,
            deviceId:
              typeof device.deviceId === "string"
                ? device.deviceId
                : fallbackDevice.id,
            colorId:
              typeof device.colorId === "string"
                ? device.colorId
                : fallbackColor.id,
            screenshotSrc:
              typeof device.screenshotSrc === "string" ? device.screenshotSrc : null,
            x: typeof device.x === "number" ? device.x : undefined,
            y: typeof device.y === "number" ? device.y : undefined,
            scale: typeof device.scale === "number" ? device.scale : undefined,
            rotation:
              typeof device.rotation === "number" ? device.rotation : undefined,
            shadow: device.shadow,
            style:
              device.style === "3d" || device.style === "flat"
                ? device.style
                : undefined,
            rotateY:
              typeof device.rotateY === "number" ? device.rotateY : undefined,
            rotateX:
              typeof device.rotateX === "number" ? device.rotateX : undefined,
          }),
        )
    : [];

  const devicesList =
    normalizedDevices.length > 0
      ? normalizedDevices
      : [
          createDeviceInstance({
            deviceId: fallbackDevice.id,
            colorId: fallbackColor.id,
            screenshotSrc: screenshot.screenshotSrc ?? null,
            scale:
              typeof screenshot.deviceScale === "number"
                ? screenshot.deviceScale
                : undefined,
            y:
              typeof screenshot.deviceOffsetY === "number"
                ? screenshot.deviceOffsetY
                : undefined,
            rotation:
              typeof screenshot.deviceRotation === "number"
                ? screenshot.deviceRotation
                : undefined,
            shadow: screenshot.deviceShadow,
            style:
              screenshot.deviceStyle === "3d" || screenshot.deviceStyle === "flat"
                ? screenshot.deviceStyle
                : undefined,
            rotateY:
              typeof screenshot.device3dRotateY === "number"
                ? screenshot.device3dRotateY
                : undefined,
            rotateX:
              typeof screenshot.device3dRotateX === "number"
                ? screenshot.device3dRotateX
                : undefined,
          }),
        ];

  const activeDeviceId =
    typeof screenshot.activeDeviceId === "string" &&
    devicesList.some((device) => device.id === screenshot.activeDeviceId)
      ? screenshot.activeDeviceId
      : devicesList[0].id;

  return { devices: devicesList, activeDeviceId };
};
