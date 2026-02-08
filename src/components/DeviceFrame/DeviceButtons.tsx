/**
 * Device Button Components
 *
 * Components for rendering physical device buttons (power, volume, etc.)
 * Supports both iPhone and Samsung button layouts, with flat and 3D styles.
 */

import type { DeviceColor } from "../../types";
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
  /** Whether to render in 3D style */
  is3d?: boolean;
}

/**
 * DeviceButton - Reusable device button component
 *
 * In flat mode, renders a simple strip.
 * In 3D mode, renders a protruding button with metallic shading,
 * rounded pill shape, highlight/shadow layers, and depth.
 */
export const DeviceButton = ({
  position,
  top,
  height,
  color,
  is3d = false,
}: DeviceButtonProps) => {
  const isRight = position === "right";
  const bg = getButtonBackground(color, position);

  if (is3d) {
    // Realistic 3D button with depth and metallic shading
    return (
      <div
        className="absolute"
        style={{
          top,
          height,
          width: "0.9%",
          ...(isRight ? { right: "-0.9%" } : { left: "-0.9%" }),
          borderRadius: isRight ? "0 3px 3px 0" : "3px 0 0 3px",
          background: bg,
          transformStyle: "preserve-3d",
          transform: `translateZ(4px)`,
        }}
      >
        {/* Button body */}
        <div
          className="absolute inset-0"
          style={{
            borderRadius: "inherit",
            background: bg,
            boxShadow: isRight
              ? `inset -1px 0 1px rgba(255,255,255,0.25),
                 inset 1px 0 2px rgba(0,0,0,0.2),
                 inset 0 1px 1px rgba(255,255,255,0.15),
                 inset 0 -1px 1px rgba(0,0,0,0.15),
                 2px 0 4px rgba(0,0,0,0.3)`
              : `inset 1px 0 1px rgba(255,255,255,0.25),
                 inset -1px 0 2px rgba(0,0,0,0.2),
                 inset 0 1px 1px rgba(255,255,255,0.15),
                 inset 0 -1px 1px rgba(0,0,0,0.15),
                 -2px 0 4px rgba(0,0,0,0.3)`,
          }}
        />
        {/* Top highlight strip */}
        <div
          className="absolute"
          style={{
            top: "8%",
            bottom: "8%",
            width: "40%",
            ...(isRight ? { left: "10%" } : { right: "10%" }),
            borderRadius: "1px",
            background: "linear-gradient(to bottom, rgba(255,255,255,0.35), rgba(255,255,255,0.05))",
          }}
        />
      </div>
    );
  }

  // Flat mode — simple strip
  return (
    <div
      className={`absolute ${isRight ? "-right-[0.8%]" : "-left-[0.8%]"} w-[0.8%] ${isRight ? "rounded-r-xs" : "rounded-l-xs"}`}
      style={{
        top,
        height,
        background: bg,
        boxShadow: isRight
          ? "inset 1px 0 2px rgba(255,255,255,0.3), 2px 0 4px rgba(0,0,0,0.2)"
          : "inset -1px 0 2px rgba(255,255,255,0.3), -2px 0 4px rgba(0,0,0,0.2)",
      }}
    />
  );
};

interface DeviceButtonsProps {
  /** Device color configuration */
  color: DeviceColor;
  /** Whether to render in 3D style */
  is3d?: boolean;
}

/**
 * IPhoneButtons - iPhone button layout
 *
 * - Right side: Side button (power)
 * - Left side: Silent switch, Volume up, Volume down
 */
export const IPhoneButtons = ({ color, is3d }: DeviceButtonsProps) => (
  <>
    {/* Side button (power) - right */}
    <DeviceButton position="right" top="18%" height="8%" color={color} is3d={is3d} />
    {/* Silent switch - left */}
    <DeviceButton position="left" top="15%" height="4%" color={color} is3d={is3d} />
    {/* Volume up - left */}
    <DeviceButton position="left" top="21%" height="6%" color={color} is3d={is3d} />
    {/* Volume down - left */}
    <DeviceButton position="left" top="28%" height="6%" color={color} is3d={is3d} />
  </>
);

/**
 * SamsungButtons - Samsung button layout
 *
 * All buttons on the right side: Power, Volume up, Volume down
 */
export const SamsungButtons = ({ color, is3d }: DeviceButtonsProps) => (
  <>
    {/* Power button - right */}
    <DeviceButton position="right" top="22%" height="5%" color={color} is3d={is3d} />
    {/* Volume up - right */}
    <DeviceButton position="right" top="29%" height="6%" color={color} is3d={is3d} />
    {/* Volume down - right */}
    <DeviceButton position="right" top="36%" height="6%" color={color} is3d={is3d} />
  </>
);
