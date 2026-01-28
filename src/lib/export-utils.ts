import type { Screenshot, DeviceSpec, DeviceColor, ExportSize } from "../types";
import { gradientPresets } from "../constants";
import { drawRichText } from "./rich-text-canvas";

interface ExportOptions {
  screenshots: Screenshot[];
  selectedDevice: DeviceSpec;
  selectedColor: DeviceColor;
  exportSize: ExportSize;
  previewDimensions: { width: number; height: number };
  headlineFontSize: number;
  subheadlineFontSize: number;
}

export const exportScreenshots = async ({
  screenshots,
  selectedDevice,
  selectedColor,
  exportSize,
  previewDimensions,
  headlineFontSize,
  subheadlineFontSize,
}: ExportOptions) => {
  // Wait for fonts to be loaded before exporting
  await document.fonts.ready;

  for (const screenshot of screenshots) {
    // Get per-screenshot device settings
    const { deviceScale, deviceOffsetY, deviceRotation, deviceShadow } =
      screenshot;

    const canvas = document.createElement("canvas");
    canvas.width = exportSize.width;
    canvas.height = exportSize.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;

    // Scale factor for export - use actual preview dimensions for accurate scaling
    // This ensures export matches preview exactly
    const scaleX = canvas.width / previewDimensions.width;
    // Account for padding (4px * 2) in preview to match text wrapping
    const paddingX = 8 * scaleX;

    // Draw background
    if (screenshot.backgroundMode === "gradient") {
      const preset =
        gradientPresets.find((p) => p.id === screenshot.gradientPresetId) ??
        gradientPresets[0];
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, preset.from);
      gradient.addColorStop(1, preset.to);
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = screenshot.backgroundColor;
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Get font family
    const fontFamily = `'${screenshot.fontFamily}', sans-serif`;

    // Font sizes scaled for export
    const exportHeadlineFontSize = (headlineFontSize / 3) * scaleX;
    const exportSubheadlineFontSize = (subheadlineFontSize / 3) * scaleX;
    const lineHeight = 1.1;

    // Text max widths based on percentage (same as preview CSS width)
    // Subtract padding to ensure text wrapping matches preview exactly
    const headlineMaxWidth =
      canvas.width * (screenshot.headlineWidth / 100) - paddingX;
    const subheadlineMaxWidth =
      canvas.width * (screenshot.subheadlineWidth / 100) - paddingX;

    // Position text using same percentage positions, scaled to export canvas
    const headlineX = canvas.width * (screenshot.headlineX / 100);
    const headlineTextY = canvas.height * (screenshot.headlineY / 100);

    // Draw headline with rich text support
    drawRichText(ctx, screenshot.headline, {
      x: headlineX,
      y: headlineTextY,
      maxWidth: headlineMaxWidth,
      fontSize: exportHeadlineFontSize,
      fontFamily,
      defaultColor: screenshot.textColor,
      lineHeight,
      textAlign: "center",
      fontWeight: 700,
    });

    // Draw subheadline with rich text support
    const subheadlineX = canvas.width * (screenshot.subheadlineX / 100);
    const subheadlineTextY = canvas.height * (screenshot.subheadlineY / 100);

    drawRichText(ctx, screenshot.subheadline, {
      x: subheadlineX,
      y: subheadlineTextY,
      maxWidth: subheadlineMaxWidth,
      fontSize: exportSubheadlineFontSize,
      fontFamily,
      defaultColor: screenshot.textColor,
      lineHeight,
      textAlign: "center",
      fontWeight: 600,
    });

    // Helper to draw overlay images
    const drawOverlayImages = async (layer: "behind" | "front") => {
      const images = screenshot.overlayImages.filter(
        (img) => (img.layer ?? "front") === layer,
      );
      for (const overlayImg of images) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        await new Promise<void>((resolve) => {
          img.onload = () => {
            const containerWidth = canvas.width * (overlayImg.width / 100);
            const containerHeight = canvas.height * (overlayImg.height / 100);
            const imgAspect = img.naturalWidth / img.naturalHeight;
            const containerAspect = containerWidth / containerHeight;

            let drawWidth: number;
            let drawHeight: number;

            if (imgAspect > containerAspect) {
              drawWidth = containerWidth;
              drawHeight = containerWidth / imgAspect;
            } else {
              drawHeight = containerHeight;
              drawWidth = containerHeight * imgAspect;
            }

            const centerX = canvas.width * (overlayImg.x / 100);
            const centerY = canvas.height * (overlayImg.y / 100);
            const rotation = overlayImg.rotation ?? 0;

            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate((rotation * Math.PI) / 180);

            // Apply shadow if enabled
            if (overlayImg.shadow?.enabled) {
              ctx.shadowColor = overlayImg.shadow.color;
              ctx.shadowBlur = overlayImg.shadow.blur * scaleX;
              ctx.shadowOffsetX = overlayImg.shadow.offsetX * scaleX;
              ctx.shadowOffsetY = overlayImg.shadow.offsetY * scaleX;
            }

            const imgX = -drawWidth / 2;
            const imgY = -drawHeight / 2;

            ctx.drawImage(img, imgX, imgY, drawWidth, drawHeight);
            ctx.restore();
            resolve();
          };
          img.onerror = () => resolve();
          img.src = overlayImg.src;
        });
      }
    };

    // Draw overlay images behind device
    await drawOverlayImages("behind");

    // Draw device - use same percentage-based positioning as preview
    const deviceWidthPx = canvas.width * (deviceScale / 100);
    const deviceHeightPx =
      deviceWidthPx * (selectedDevice.height / selectedDevice.width);
    const deviceX = (canvas.width - deviceWidthPx) / 2;
    const deviceY = canvas.height * (deviceOffsetY / 100);

    // Parse frameRadius from device config (format: "14%/6.5%" -> [14, 6.5])
    const parseFrameRadius = (radius: string): [number, number] => {
      const [xPct, yPct] = radius.split("/").map((s) => parseFloat(s) / 100);
      return [xPct, yPct];
    };
    const [outerRadiusXPct, outerRadiusYPct] = parseFrameRadius(
      selectedDevice.frameRadius.outer,
    );
    const cornerRadiusX = deviceWidthPx * outerRadiusXPct;
    const cornerRadiusY = deviceHeightPx * outerRadiusYPct;
    const frameRadius = Math.min(cornerRadiusX, cornerRadiusY);

    // Bezel/padding is 1.2% of device width (matching updated UI)
    const bezelThickness = deviceWidthPx * 0.012;

    // Apply rotation around device center
    ctx.save();
    const deviceCenterX = deviceX + deviceWidthPx / 2;
    const deviceCenterY = deviceY + deviceHeightPx / 2;
    ctx.translate(deviceCenterX, deviceCenterY);
    ctx.rotate((deviceRotation * Math.PI) / 180);
    ctx.translate(-deviceCenterX, -deviceCenterY);

    // Draw device buttons
    const btnWidth = deviceWidthPx * 0.008;
    const btnRadius = 2 * scaleX;

    const drawButton = (
      x: number,
      y: number,
      w: number,
      h: number,
      isRight: boolean,
    ) => {
      ctx.save();
      if (selectedColor.frameColors) {
        const btnGradient = ctx.createLinearGradient(x, y, x + w, y);
        const c1 = selectedColor.frameColors[2];
        const c2 = selectedColor.frameColors[0];

        if (isRight) {
          btnGradient.addColorStop(0, c1);
          btnGradient.addColorStop(1, c2);
        } else {
          btnGradient.addColorStop(0, c2);
          btnGradient.addColorStop(1, c1);
        }
        ctx.fillStyle = btnGradient;
      } else {
        ctx.fillStyle = selectedColor.frame;
      }

      // Button shadows for 3D effect
      ctx.shadowColor = "rgba(0,0,0,0.2)";
      ctx.shadowBlur = 4 * scaleX;
      ctx.shadowOffsetX = isRight ? 2 * scaleX : -2 * scaleX;
      ctx.shadowOffsetY = 0;

      ctx.beginPath();
      if (isRight) {
        ctx.roundRect(x, y, w, h, [0, btnRadius, btnRadius, 0]);
      } else {
        ctx.roundRect(x, y, w, h, [btnRadius, 0, 0, btnRadius]);
      }
      ctx.fill();
      ctx.restore();
    };

    // Side button (right) - top 18%, height 8%
    drawButton(
      deviceX + deviceWidthPx,
      deviceY + deviceHeightPx * 0.18,
      btnWidth,
      deviceHeightPx * 0.08,
      true,
    );

    // Silent switch (left) - top 15%, height 4%
    drawButton(
      deviceX - btnWidth,
      deviceY + deviceHeightPx * 0.15,
      btnWidth,
      deviceHeightPx * 0.04,
      false,
    );

    // Volume up (left) - top 21%, height 6%
    drawButton(
      deviceX - btnWidth,
      deviceY + deviceHeightPx * 0.21,
      btnWidth,
      deviceHeightPx * 0.06,
      false,
    );

    // Volume down (left) - top 28%, height 6%
    drawButton(
      deviceX - btnWidth,
      deviceY + deviceHeightPx * 0.28,
      btnWidth,
      deviceHeightPx * 0.06,
      false,
    );

    // Draw device frame with shadow
    ctx.save();
    if (deviceShadow?.enabled) {
      ctx.shadowColor = deviceShadow.color;
      ctx.shadowBlur = deviceShadow.blur * scaleX;
      ctx.shadowOffsetX = deviceShadow.offsetX * scaleX;
      ctx.shadowOffsetY = deviceShadow.offsetY * scaleX;
    }

    if (selectedColor.frameColors) {
      // Create gradient for metallic look
      const gradient = ctx.createLinearGradient(
        deviceX,
        deviceY,
        deviceX + deviceWidthPx,
        deviceY + deviceHeightPx,
      );
      selectedColor.frameColors.forEach((color, index) => {
        gradient.addColorStop(
          index / (selectedColor.frameColors!.length - 1),
          color,
        );
      });
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = selectedColor.frame;
    }

    ctx.beginPath();
    ctx.roundRect(deviceX, deviceY, deviceWidthPx, deviceHeightPx, frameRadius);
    ctx.fill();

    // Add metallic shine/border effects
    // Outer subtle border
    ctx.strokeStyle = "rgba(0,0,0,0.1)";
    ctx.lineWidth = 1 * scaleX;
    ctx.stroke();

    // Inner highlight (bevel)
    ctx.beginPath();
    ctx.roundRect(
      deviceX + 1 * scaleX,
      deviceY + 1 * scaleX,
      deviceWidthPx - 2 * scaleX,
      deviceHeightPx - 2 * scaleX,
      frameRadius,
    );
    ctx.strokeStyle = "rgba(255,255,255,0.3)";
    ctx.lineWidth = 2 * scaleX;
    ctx.stroke();

    // Inner shadow
    ctx.beginPath();
    ctx.roundRect(
      deviceX + 3 * scaleX,
      deviceY + 3 * scaleX,
      deviceWidthPx - 6 * scaleX,
      deviceHeightPx - 6 * scaleX,
      frameRadius,
    );
    ctx.strokeStyle = "rgba(0,0,0,0.2)";
    ctx.lineWidth = 2 * scaleX;
    ctx.stroke();

    ctx.restore();

    // Screen area
    const screenX = deviceX + bezelThickness;
    const screenY = deviceY + bezelThickness;
    const screenWidthPx = deviceWidthPx - bezelThickness * 2;
    const screenHeightPx = deviceHeightPx - bezelThickness * 2;
    const screenRadius = frameRadius - bezelThickness;

    // Screen background
    ctx.fillStyle = "#1c1c1e";
    ctx.beginPath();
    ctx.roundRect(
      screenX,
      screenY,
      screenWidthPx,
      screenHeightPx,
      screenRadius,
    );
    ctx.fill();

    // Draw screenshot image if available
    if (screenshot.screenshotSrc) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve) => {
        img.onload = () => {
          ctx.save();
          ctx.beginPath();
          ctx.roundRect(
            screenX,
            screenY,
            screenWidthPx,
            screenHeightPx,
            screenRadius,
          );
          ctx.clip();
          ctx.drawImage(img, screenX, screenY, screenWidthPx, screenHeightPx);
          ctx.restore();
          resolve();
        };
        img.onerror = () => resolve();
        img.src = screenshot.screenshotSrc!;
      });
    }

    // Draw Dynamic Island
    if (selectedDevice.hasIsland) {
      const islandWidth = screenWidthPx * 0.28;
      const islandHeight = screenHeightPx * 0.032;
      const islandX = screenX + (screenWidthPx - islandWidth) / 2;
      const islandY = screenY + screenHeightPx * 0.018;
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.roundRect(
        islandX,
        islandY,
        islandWidth,
        islandHeight,
        islandHeight / 2,
      );
      ctx.fill();
    }
    // Draw Notch for older iPhones
    else if (selectedDevice.notchWidth > 0) {
      const notchWidth = screenWidthPx * 0.35;
      const notchHeight = screenHeightPx * 0.035;
      const notchX = screenX + (screenWidthPx - notchWidth) / 2;
      const notchY = screenY;
      ctx.fillStyle = "#000";
      ctx.beginPath();
      ctx.roundRect(notchX, notchY, notchWidth, notchHeight, [
        0,
        0,
        20 * scaleX,
        20 * scaleX,
      ]);
      ctx.fill();
    }

    // Restore rotation transform
    ctx.restore();

    // Draw overlay images in front of device
    await drawOverlayImages("front");

    // Download
    const link = document.createElement("a");
    link.download = `appstore-screenshot-${screenshots.indexOf(screenshot) + 1}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();

    await new Promise((r) => setTimeout(r, 500));
  }
};
