export type DeviceColor = {
  id: string;
  label: string;
  frame: string;
  frameColors?: string[];
  screen: string;
};

export type ShadowConfig = {
  enabled: boolean;
  color: string;
  blur: number;
  offsetX: number;
  offsetY: number;
};

export type DeviceSpec = {
  id: string;
  label: string;
  width: number;
  height: number;
  screenInset: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  cornerRadius: number;
  frameRadius: {
    outer: string;
    inner: string;
  };
  notchWidth: number;
  notchHeight: number;
  hasIsland: boolean;
  colors: DeviceColor[];
};

export type GradientPreset = {
  id: string;
  label: string;
  from: string;
  to: string;
};

export type ImageOverlay = {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
  layer: "behind" | "front";
  rotation: number;
  shadow: ShadowConfig;
};

export type DeviceStyle = "flat" | "3d";

export type DeviceInstance = {
  id: string;
  deviceId: string;
  colorId: string;
  screenshotSrc: string | null;
  x: number;
  y: number;
  scale: number;
  rotation: number;
  shadow: ShadowConfig;
  style: DeviceStyle;
  rotateY: number;
  rotateX: number;
};

export type Screenshot = {
  id: string;
  headline: string;
  subheadline: string;
  backgroundColor: string;
  backgroundMode: "solid" | "gradient" | "image";
  gradientPresetId: string | null;
  textColor: string;
  headlineX: number;
  headlineY: number;
  headlineWidth: number;
  subheadlineX: number;
  subheadlineY: number;
  subheadlineWidth: number;
  fontFamily: string;
  overlayImages: ImageOverlay[];
  devices: DeviceInstance[];
  activeDeviceId: string;
};

export type SelectedElement = {
  type: "headline" | "subheadline" | "image" | "device";
  screenshotId: string;
  id?: string;
};

export type ExportSize = {
  id: string;
  label: string;
  width: number;
  height: number;
};

/**
 * Project type - groups screenshots together
 */
export type Project = {
  /** Unique project identifier */
  id: string;
  /** Project name */
  name: string;
  /** Creation timestamp */
  createdAt: number;
  /** Last update timestamp */
  updatedAt: number;
  /** Screenshots belonging to this project */
  screenshots: Screenshot[];
  /** Selected device ID for this project */
  selectedDeviceId: string;
  /** Selected device color ID */
  selectedColorId: string;
  /** Export size ID */
  exportSizeId: string;
  /** Active screenshot ID */
  activeScreenshotId: string;
  /** Headline font size */
  headlineFontSize: number;
  /** Subheadline font size */
  subheadlineFontSize: number;
};
