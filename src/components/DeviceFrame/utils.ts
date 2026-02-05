/**
 * DeviceFrame Utility Functions
 *
 * Helper functions for computing styles and backgrounds
 * for device frame elements.
 */

import type { DeviceColor } from "../../types";

/**
 * Generates the background style for the device frame.
 *
 * @param color - The device color configuration
 * @returns CSS background value (gradient or solid color)
 *
 * @example
 * // With gradient colors
 * getFrameBackground({ frameColors: ['#1a1a1a', '#2a2a2a', '#3a3a3a'], frame: '#000' })
 * // Returns: "linear-gradient(135deg, #1a1a1a, #2a2a2a, #3a3a3a)"
 *
 * @example
 * // With solid color
 * getFrameBackground({ frame: '#000' })
 * // Returns: "#000"
 */
export const getFrameBackground = (color: DeviceColor): string => {
  if (color.frameColors) {
    return `linear-gradient(135deg, ${color.frameColors.join(", ")})`;
  }
  return color.frame;
};

/**
 * Generates the background style for device buttons.
 * Creates a gradient that simulates 3D lighting based on button position.
 *
 * @param color - The device color configuration
 * @param direction - Button position ('left' or 'right')
 * @returns CSS background value for the button
 *
 * @example
 * // Right-side button (light appears to come from left)
 * getButtonBackground(color, 'right')
 *
 * @example
 * // Left-side button (light appears to come from right)
 * getButtonBackground(color, 'left')
 */
export const getButtonBackground = (
  color: DeviceColor,
  direction: "left" | "right",
): string => {
  if (color.frameColors) {
    const [first, , third] = color.frameColors;
    return direction === "right"
      ? `linear-gradient(to right, ${third}, ${first})`
      : `linear-gradient(to left, ${third}, ${first})`;
  }
  return color.frame;
};
