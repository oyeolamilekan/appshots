/**
 * DeviceFrame Module
 *
 * A collection of components for rendering realistic device mockups.
 * Supports iPhone and Samsung devices with accurate frame designs,
 * camera elements, and physical buttons.
 *
 * @module DeviceFrame
 *
 * @example
 * // Basic usage
 * import { DeviceFrame } from './components/DeviceFrame';
 *
 * <DeviceFrame screenshot={screenshotData} />
 *
 * @example
 * // Using individual components
 * import {
 *   DeviceFrame,
 *   ScreenContent,
 *   CameraElement,
 *   IPhoneButtons,
 *   SamsungButtons,
 * } from './components/DeviceFrame';
 */

// Main component
export { DeviceFrame } from "./DeviceFrame";

// Sub-components (for advanced customization)
export { ScreenContent } from "./ScreenContent";
export {
  CameraElement,
  DynamicIsland,
  Notch,
  PunchHoleCamera,
} from "./CameraElements";
export { DeviceButton, IPhoneButtons, SamsungButtons } from "./DeviceButtons";

// Utilities and constants
export { SHADOWS } from "./constants";
export { getFrameBackground, getButtonBackground } from "./utils";
