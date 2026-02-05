/**
 * RightSidebar Module
 *
 * Sidebar component with layout, content, and appearance controls.
 *
 * @module RightSidebar
 *
 * @example
 * // Basic usage
 * import { RightSidebar } from './components/RightSidebar';
 *
 * <RightSidebar />
 *
 * @example
 * // Using individual components
 * import {
 *   LayoutSection,
 *   ContentSection,
 *   AppearanceSection,
 *   RangeSlider,
 *   Toggle,
 * } from './components/RightSidebar';
 */

// Main component
export { RightSidebar } from "./RightSidebar";

// Section components
export { LayoutSection } from "./LayoutSection";
export { ContentSection } from "./ContentSection";
export { AppearanceSection } from "./AppearanceSection";
export { OverlayImagesSection } from "./OverlayImagesSection";

// Sub-components
export { SidebarSection } from "./SidebarSection";
export { RangeSlider } from "./RangeSlider";
export { Toggle } from "./Toggle";
export { ShadowControls } from "./ShadowControls";
export { BackgroundPicker } from "./BackgroundPicker";
export { OverlayImageItem } from "./OverlayImageItem";
export { OverlayImageProperties } from "./OverlayImageProperties";

// Types
export type {
  SelectedElement,
  SidebarSectionProps,
  RangeSliderProps,
  ToggleProps,
  ShadowControlsProps,
  OverlayImageItemProps,
  OverlayImagePropertiesProps,
} from "./types";

// Constants
export { STYLES, SLIDER_RANGES } from "./constants";
