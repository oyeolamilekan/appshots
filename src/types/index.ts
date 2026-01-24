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

export type Screenshot = {
  id: string;
  headline: string;
  subheadline: string;
  screenshotSrc: string | null;
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
  deviceScale: number;
  deviceOffsetY: number;
  deviceRotation: number;
  deviceShadow: ShadowConfig;
};

export type ExportSize = {
  id: string;
  label: string;
  width: number;
  height: number;
};
