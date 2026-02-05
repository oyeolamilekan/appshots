/**
 * DeviceFrame Constants
 *
 * Centralized style constants used across DeviceFrame components.
 * These values control the visual appearance of device frames including
 * shadows, borders, and lighting effects.
 */

/**
 * Shadow presets for different device frame elements.
 * Uses CSS box-shadow syntax with multiple layers for realistic depth.
 */
export const SHADOWS = {
  /**
   * Main frame shadow - creates depth and subtle inner glow
   * - Inner white glow for highlight
   * - Inner dark border for definition
   * - Outer drop shadow for depth
   */
  frame:
    "inset 0 0 4px 1px rgba(255,255,255,0.3), inset 0 0 0 2px rgba(0,0,0,0.2), 0 25px 50px -12px rgba(0, 0, 0, 0.5)",

  /**
   * Right-side button shadow - simulates light from the left
   */
  buttonRight:
    "inset 1px 0 2px rgba(255,255,255,0.3), 2px 0 4px rgba(0,0,0,0.2)",

  /**
   * Left-side button shadow - simulates light from the right
   */
  buttonLeft:
    "inset -1px 0 2px rgba(255,255,255,0.3), -2px 0 4px rgba(0,0,0,0.2)",
} as const;

/**
 * Type for shadow keys to ensure type safety when accessing SHADOWS
 */
export type ShadowKey = keyof typeof SHADOWS;
