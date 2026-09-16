/**
 * BackgroundDecorations Component
 *
 * Non-interactive SVG blob/wave decorations for screenshot backgrounds.
 */

import type { Screenshot } from "../../types";
import { resolveDecorations } from "../../lib/background-decorations";
import type { SplitSide } from "../../lib/theme-split";
import { Z_INDEX } from "./constants";

interface BackgroundDecorationsProps {
  screenshot: Screenshot;
  side?: SplitSide;
  clipPath?: string;
}

export const BackgroundDecorations = ({
  screenshot,
  side = "light",
  clipPath,
}: BackgroundDecorationsProps) => {
  const resolved = resolveDecorations(screenshot, side);
  if (!resolved) return null;

  const scale = resolved.scale;
  const transform = `translate(50 50) scale(${scale}) translate(-50 -50)`;

  return (
    <svg
      className="absolute inset-0 pointer-events-none"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{
        zIndex: Z_INDEX.decorations,
        clipPath,
        opacity: resolved.opacity,
      }}
    >
      <g transform={transform}>
        {resolved.shapes.map((shape, index) =>
          shape.kind === "fill" ? (
            <path
              key={index}
              d={shape.d}
              fill={shape.fill}
              opacity={shape.opacity}
            />
          ) : (
            <path
              key={index}
              d={shape.d}
              fill="none"
              stroke={shape.stroke}
              strokeWidth={shape.strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={shape.opacity}
            />
          ),
        )}
      </g>
    </svg>
  );
};
