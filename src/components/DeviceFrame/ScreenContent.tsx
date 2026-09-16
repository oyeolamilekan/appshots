/**
 * ScreenContent Component
 *
 * Renders the content displayed on the device screen.
 * Shows either the uploaded screenshot or a placeholder message.
 */

import type { CSSProperties } from "react";

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
  /** Fraction of the image to clip from the top (hides island/notch). */
  topCrop?: number;
}

const croppedImageStyle = (topCrop: number): CSSProperties => ({
  height: `${(1 + topCrop) * 100}%`,
  marginTop: `-${topCrop * 100}%`,
  width: "100%",
  objectFit: "fill",
});

const ScreenImage = ({
  src,
  alt,
  clipPath,
  topCrop,
  placeholderClassName,
  placeholderLabel,
}: {
  src: string | null;
  alt: string;
  clipPath?: string;
  topCrop: number;
  placeholderClassName: string;
  placeholderLabel: string;
}) => {
  const cropped = topCrop > 0;
  const image = src ? (
    <img
      src={src}
      alt={alt}
      className={cropped ? "object-fill w-full" : "w-full h-full object-fill"}
      style={cropped ? croppedImageStyle(topCrop) : undefined}
    />
  ) : (
    <div
      className={`w-full h-full flex items-center justify-center ${placeholderClassName}`}
    >
      <span className="text-[10px] text-gray-400">{placeholderLabel}</span>
    </div>
  );

  if (clipPath) {
    return (
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ clipPath }}
      >
        {image}
      </div>
    );
  }

  if (cropped) {
    return <div className="w-full h-full overflow-hidden">{image}</div>;
  }

  return image;
};

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
  topCrop = 0,
}: ScreenContentProps) => {
  if (themeSplit) {
    return (
      <div className="relative w-full h-full bg-[#1c1c1e]">
        <ScreenImage
          src={screenshotSrc}
          alt="Light screenshot"
          clipPath={lightClipPath}
          topCrop={topCrop}
          placeholderClassName="bg-[#f4f4f5]"
          placeholderLabel="No light image"
        />
        <ScreenImage
          src={screenshotSrcDark}
          alt="Dark screenshot"
          clipPath={darkClipPath}
          topCrop={topCrop}
          placeholderClassName="bg-[#1c1c1e]"
          placeholderLabel="No dark image"
        />
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
      <ScreenImage
        src={screenshotSrc}
        alt="Screenshot"
        topCrop={topCrop}
        placeholderClassName="bg-[#1c1c1e]"
        placeholderLabel="No image"
      />
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center bg-[#1c1c1e]">
      <span className="text-gray-600 text-[10px]">No image</span>
    </div>
  );
};
