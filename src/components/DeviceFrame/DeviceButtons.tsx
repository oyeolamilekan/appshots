/**
 * Device Button Components
 *
 * Components for rendering physical device buttons (power, volume, etc.)
 * Supports both iPhone and Samsung button layouts.
 */

import type { DeviceColor } from "../../types";
import { SHADOWS } from "./constants";
import { getButtonBackground } from "./utils";

interface DeviceButtonProps {
  /** Button position on the device frame */
  position: "left" | "right";
  /** CSS top position (e.g., "18%") */
  top: string;
  /** CSS height (e.g., "8%") */
  height: string;
  /** Device color configuration for styling */
  color: DeviceColor;
}

/**
 * DeviceButton - Reusable device button component
 *
 * Renders a single physical button on the device frame.
 * Automatically applies correct styling based on position.
 *
 * @param props - Component props
 * @param props.position - 'left' or 'right' side of device
 * @param props.top - Vertical position as CSS percentage
 * @param props.height - Button height as CSS percentage
 * @param props.color - Device color for gradient/solid styling
 *
 * @example
 * // Power button on right side
 * <DeviceButton position="right" top="18%" height="8%" color={deviceColor} />
 */
export const DeviceButton = ({
  position,
  top,
  height,
  color,
}: DeviceButtonProps) => {
  const isRight = position === "right";

  return (
    <div
      className={`absolute ${isRight ? "-right-[0.8%]" : "-left-[0.8%]"} w-[0.8%] ${isRight ? "rounded-r-xs" : "rounded-l-xs"}`}
      style={{
        top,
        height,
        background: getButtonBackground(color, position),
        boxShadow: isRight ? SHADOWS.buttonRight : SHADOWS.buttonLeft,
      }}
    />
  );
};

interface DeviceButtonsProps {
  /** Device color configuration */
  color: DeviceColor;
}

/**
 * IPhoneButtons - iPhone button layout
 *
 * Renders the standard iPhone button configuration:
 * - Right side: Side button (power)
 * - Left side: Silent switch, Volume up, Volume down
 *
 * @param props - Component props
 * @param props.color - Device color for button styling
 */
export const IPhoneButtons = ({ color }: DeviceButtonsProps) => (
  <>
    {/* Side button (power) - right */}
    <DeviceButton position="right" top="18%" height="8%" color={color} />
    {/* Silent switch - left */}
    <DeviceButton position="left" top="15%" height="4%" color={color} />
    {/* Volume up - left */}
    <DeviceButton position="left" top="21%" height="6%" color={color} />
    {/* Volume down - left */}
    <DeviceButton position="left" top="28%" height="6%" color={color} />
  </>
);

/**
 * SamsungButtons - Samsung button layout
 *
 * Renders the standard Samsung button configuration:
 * - Right side: Power button, Volume up, Volume down
 * (Samsung devices have all buttons on the right side)
 *
 * @param props - Component props
 * @param props.color - Device color for button styling
 */
export const SamsungButtons = ({ color }: DeviceButtonsProps) => (
  <>
    {/* Power button - right */}
    <DeviceButton position="right" top="22%" height="5%" color={color} />
    {/* Volume up - right */}
    <DeviceButton position="right" top="29%" height="6%" color={color} />
    {/* Volume down - right */}
    <DeviceButton position="right" top="36%" height="6%" color={color} />
  </>
);
