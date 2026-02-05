/**
 * RightSidebar Types
 *
 * TypeScript interfaces for RightSidebar components.
 */

import type { ShadowConfig, ImageOverlay } from "../../types";

/**
 * Selected element in the canvas
 */
export interface SelectedElement {
  type: "headline" | "subheadline" | "image";
  id?: string;
}

/**
 * Props for the SidebarSection component
 */
export interface SidebarSectionProps {
  title: string;
  children: React.ReactNode;
}

/**
 * Props for RangeSlider component
 */
export interface RangeSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
  showValue?: boolean;
}

/**
 * Props for Toggle component
 */
export interface ToggleProps {
  label: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

/**
 * Props for ShadowControls component
 */
export interface ShadowControlsProps {
  shadow: ShadowConfig;
  onToggle: () => void;
  onColorChange: (color: string) => void;
  onBlurChange: (blur: number) => void;
  onOffsetYChange: (offsetY: number) => void;
}

/**
 * Props for OverlayImageItem component
 */
export interface OverlayImageItemProps {
  image: ImageOverlay;
  index: number;
  totalCount: number;
  isSelected: boolean;
  onSelect: () => void;
  onRemove: () => void;
  onMoveForward: () => void;
  onMoveBackward: () => void;
}

/**
 * Props for OverlayImageProperties component
 */
export interface OverlayImagePropertiesProps {
  image: ImageOverlay;
  onSizeChange: (size: number) => void;
  onRotationChange: (rotation: number) => void;
  onLayerChange: (layer: "behind" | "front") => void;
  onShadowToggle: () => void;
  onShadowColorChange: (color: string) => void;
  onShadowBlurChange: (blur: number) => void;
  onShadowOffsetYChange: (offsetY: number) => void;
}
