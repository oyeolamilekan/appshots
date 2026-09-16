/**
 * ScreenContent Component
 *
 * Renders the content displayed on the device screen.
 * Shows either the uploaded screenshot or a placeholder message.
 */

interface ScreenContentProps {
  /** URL of the screenshot image, or null if no image is uploaded */
  screenshotSrc: string | null;
  /** Dark-mode screenshot, used when a light/dark split is enabled */
  screenshotSrcDark?: string | null;
  /** Whether the slide uses a light/dark split */
  themeSplit?: boolean;
  /** Clip-path for the light half in screen-local coordinates */
  lightClipPath?: string;
  /** Clip-path for the dark half in screen-local coordinates */
  darkClipPath?: string;
  /** Clip-path for the split hairline */
  hairlineClipPath?: string;
}

/**
 * Displays the device screen content.
 */
export const ScreenContent = ({
  screenshotSrc,
  screenshotSrcDark = null,
  themeSplit = false,
  lightClipPath,
  darkClipPath,
  hairlineClipPath,
}: ScreenContentProps) => {
  if (themeSplit) {
    return (
      <div className="relative w-full h-full bg-[#1c1c1e]">
        {screenshotSrc ? (
          <img
            src={screenshotSrc}
            alt="Light screenshot"
            className="absolute inset-0 w-full h-full object-fill"
            style={{ clipPath: lightClipPath }}
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center bg-[#f4f4f5]"
            style={{ clipPath: lightClipPath }}
          >
            <span className="text-gray-400 text-[10px]">No light image</span>
          </div>
        )}
        {screenshotSrcDark ? (
          <img
            src={screenshotSrcDark}
            alt="Dark screenshot"
            className="absolute inset-0 w-full h-full object-fill"
            style={{ clipPath: darkClipPath }}
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center bg-[#1c1c1e]"
            style={{ clipPath: darkClipPath }}
          >
            <span className="text-gray-600 text-[10px]">No dark image</span>
          </div>
        )}
        {hairlineClipPath && (
          <div
            className="absolute inset-0 bg-white pointer-events-none"
            style={{ clipPath: hairlineClipPath }}
          />
        )}
      </div>
    );
  }

  if (screenshotSrc) {
    return (
      <img
        src={screenshotSrc}
        alt="Screenshot"
        className="w-full h-full object-fill"
      />
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-[#1c1c1e]">
      <span className="text-gray-600 text-[10px]">No image</span>
    </div>
  );
};
