import type {
  Screenshot,
  DeviceSpec,
  DeviceColor,
  ExportSize,
  DeviceInstance,
} from "../types";
import { gradientPresets } from "../constants";
import { drawRichText } from "./rich-text-canvas";
import { getDeviceColorById, getDeviceSpecById } from "./device-instances";
import { getRenderableDevicesForScreenshot } from "./device-overflow";
import JSZip from "jszip";

interface ExportOptions {
  screenshots: Screenshot[];
  exportSize: ExportSize;
  previewDimensions: { width: number; height: number };
  headlineFontSize: number;
  subheadlineFontSize: number;
}

/**
 * Convert data URL to Blob
 */
const dataURLtoBlob = (dataURL: string): Blob => {
  const arr = dataURL.split(",");
  const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
};

/**
 * Download a single file
 */
const downloadFile = (dataURL: string, filename: string) => {
  const link = document.createElement("a");
  link.download = filename;
  link.href = dataURL;
  link.click();
};

/**
 * Download multiple files as ZIP
 */
const downloadAsZip = async (files: { name: string; data: string }[]) => {
  const zip = new JSZip();
  
  for (const file of files) {
    const blob = dataURLtoBlob(file.data);
    zip.file(file.name, blob);
  }
  
  const content = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(content);
  
  const link = document.createElement("a");
  link.download = "appstore-screenshots.zip";
  link.href = url;
  link.click();
  
  // Clean up
  URL.revokeObjectURL(url);
};

// --- 3D Export Helpers ---

const EXPORT_EDGE_DEPTH = 16; // Must match DeviceFrame3D EDGE_DEPTH

interface Point2D {
  x: number;
  y: number;
}

const lerp3d = (a: number, b: number, t: number): number => a + (b - a) * t;

/**
 * Project a 3D point to 2D with perspective.
 * Matches CSS: perspective + transform: rotateY(ry) rotateX(rx)
 */
const project3DPoint = (
  x: number,
  y: number,
  z: number,
  ryRad: number,
  rxRad: number,
  perspective: number,
  cx: number,
  cy: number,
): Point2D => {
  const cosY = Math.cos(ryRad);
  const sinY = Math.sin(ryRad);
  const cosX = Math.cos(rxRad);
  const sinX = Math.sin(rxRad);

  // CSS: transform: rotateY(ry) rotateX(rx) → matrix RY * RX
  // Apply rotateX first (affects y, z), then rotateY (affects x, z)
  const y1 = y * cosX - z * sinX;
  const z1 = y * sinX + z * cosX;

  const px = x * cosY + z1 * sinY;
  const py = y1;
  const pz = -x * sinY + z1 * cosY;

  // CSS perspective: scale = d / (d - z)
  const scale = perspective / (perspective - pz);
  return { x: cx + px * scale, y: cy + py * scale };
};

/**
 * Get projected corners [TL, TR, BR, BL] for a rectangle at given Z.
 */
const getProjectedCorners = (
  halfW: number,
  halfH: number,
  z: number,
  ryRad: number,
  rxRad: number,
  perspective: number,
  cx: number,
  cy: number,
): Point2D[] => [
  project3DPoint(-halfW, -halfH, z, ryRad, rxRad, perspective, cx, cy),
  project3DPoint(halfW, -halfH, z, ryRad, rxRad, perspective, cx, cy),
  project3DPoint(halfW, halfH, z, ryRad, rxRad, perspective, cx, cy),
  project3DPoint(-halfW, halfH, z, ryRad, rxRad, perspective, cx, cy),
];

/**
 * Trace a projected rounded-rect path on the canvas.
 * Projects points along the rounded rect boundary from 3D local coords to 2D.
 */
const traceProjectedRoundedRect = (
  ctx: CanvasRenderingContext2D,
  halfW: number,
  halfH: number,
  radius: number,
  z: number,
  ryRad: number,
  rxRad: number,
  perspective: number,
  cx: number,
  cy: number,
) => {
  const r = Math.min(radius, halfW, halfH);
  const segs = 20; // points per corner arc

  ctx.beginPath();
  // Start after top-left corner
  let p = project3DPoint(-halfW + r, -halfH, z, ryRad, rxRad, perspective, cx, cy);
  ctx.moveTo(p.x, p.y);

  // Top edge → top-right corner
  p = project3DPoint(halfW - r, -halfH, z, ryRad, rxRad, perspective, cx, cy);
  ctx.lineTo(p.x, p.y);
  for (let i = 1; i <= segs; i++) {
    const a = -Math.PI / 2 + (Math.PI / 2) * (i / segs);
    p = project3DPoint(halfW - r + r * Math.cos(a), -halfH + r + r * Math.sin(a), z, ryRad, rxRad, perspective, cx, cy);
    ctx.lineTo(p.x, p.y);
  }

  // Right edge → bottom-right corner
  p = project3DPoint(halfW, halfH - r, z, ryRad, rxRad, perspective, cx, cy);
  ctx.lineTo(p.x, p.y);
  for (let i = 1; i <= segs; i++) {
    const a = (Math.PI / 2) * (i / segs);
    p = project3DPoint(halfW - r + r * Math.cos(a), halfH - r + r * Math.sin(a), z, ryRad, rxRad, perspective, cx, cy);
    ctx.lineTo(p.x, p.y);
  }

  // Bottom edge → bottom-left corner
  p = project3DPoint(-halfW + r, halfH, z, ryRad, rxRad, perspective, cx, cy);
  ctx.lineTo(p.x, p.y);
  for (let i = 1; i <= segs; i++) {
    const a = Math.PI / 2 + (Math.PI / 2) * (i / segs);
    p = project3DPoint(-halfW + r + r * Math.cos(a), halfH - r + r * Math.sin(a), z, ryRad, rxRad, perspective, cx, cy);
    ctx.lineTo(p.x, p.y);
  }

  // Left edge → top-left corner
  p = project3DPoint(-halfW, -halfH + r, z, ryRad, rxRad, perspective, cx, cy);
  ctx.lineTo(p.x, p.y);
  for (let i = 1; i <= segs; i++) {
    const a = Math.PI + (Math.PI / 2) * (i / segs);
    p = project3DPoint(-halfW + r + r * Math.cos(a), -halfH + r + r * Math.sin(a), z, ryRad, rxRad, perspective, cx, cy);
    ctx.lineTo(p.x, p.y);
  }

  ctx.closePath();
};

/**
 * Draw an image onto a projected quadrilateral using a 2D grid subdivision.
 * No per-cell clipping — relies on the outer clip (projected rounded rect)
 * for boundary. Each cell uses source-rect drawImage for clean rendering.
 */
const drawPerspectiveImage = (
  ctx: CanvasRenderingContext2D,
  img: HTMLCanvasElement,
  corners: Point2D[],
  gridX: number = 40,
  gridY: number = 60,
) => {
  const [tl, tr, br, bl] = corners;
  const srcW = img.width;
  const srcH = img.height;

  for (let yi = 0; yi < gridY; yi++) {
    for (let xi = 0; xi < gridX; xi++) {
      const u0 = xi / gridX;
      const u1 = (xi + 1) / gridX;
      const v0 = yi / gridY;
      const v1 = (yi + 1) / gridY;

      // Bilinear interpolation for 3 cell corners
      const p00x = (1 - v0) * ((1 - u0) * tl.x + u0 * tr.x) + v0 * ((1 - u0) * bl.x + u0 * br.x);
      const p00y = (1 - v0) * ((1 - u0) * tl.y + u0 * tr.y) + v0 * ((1 - u0) * bl.y + u0 * br.y);
      const p10x = (1 - v0) * ((1 - u1) * tl.x + u1 * tr.x) + v0 * ((1 - u1) * bl.x + u1 * br.x);
      const p10y = (1 - v0) * ((1 - u1) * tl.y + u1 * tr.y) + v0 * ((1 - u1) * bl.y + u1 * br.y);
      const p01x = (1 - v1) * ((1 - u0) * tl.x + u0 * tr.x) + v1 * ((1 - u0) * bl.x + u0 * br.x);
      const p01y = (1 - v1) * ((1 - u0) * tl.y + u0 * tr.y) + v1 * ((1 - u0) * bl.y + u0 * br.y);

      // Source rect for this cell (with 1px overlap to prevent seams)
      const sx = Math.max(0, srcW * u0 - 0.5);
      const sy = Math.max(0, srcH * v0 - 0.5);
      const sw = Math.min(srcW - sx, srcW * (u1 - u0) + 1);
      const sh = Math.min(srcH - sy, srcH * (v1 - v0) + 1);

      const a = (p10x - p00x) / (srcW * (u1 - u0));
      const b = (p01x - p00x) / (srcH * (v1 - v0));
      const c = (p10y - p00y) / (srcW * (u1 - u0));
      const d = (p01y - p00y) / (srcH * (v1 - v0));
      const e = p00x - a * srcW * u0 - b * srcH * v0;
      const f = p00y - c * srcW * u0 - d * srcH * v0;

      ctx.save();
      ctx.setTransform(a, c, b, d, e, f);
      ctx.drawImage(img, sx, sy, sw, sh, sx, sy, sw, sh);
      ctx.restore();
    }
  }
};

/**
 * Render the flat device (frame, screen, buttons, camera) to an offscreen canvas.
 */
const renderDeviceToOffscreen = async (
  deviceWidthPx: number,
  deviceHeightPx: number,
  frameRadius: number,
  bezelThickness: number,
  selectedDevice: DeviceSpec,
  selectedColor: DeviceColor,
  screenshotSrc: string | null,
  scaleX: number,
  isSamsung: boolean,
): Promise<HTMLCanvasElement> => {
  const offscreen = document.createElement("canvas");
  offscreen.width = Math.ceil(deviceWidthPx);
  offscreen.height = Math.ceil(deviceHeightPx);
  const ctx = offscreen.getContext("2d")!;

  const dX = 0;
  const dY = 0;
  const dW = deviceWidthPx;
  const dH = deviceHeightPx;

  // --- Draw frame ---
  ctx.save();
  if (selectedColor.frameColors) {
    const gradient = ctx.createLinearGradient(dX, dY, dX + dW, dY + dH);
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
  ctx.roundRect(dX, dY, dW, dH, frameRadius);
  ctx.fill();

  ctx.strokeStyle = "rgba(0,0,0,0.1)";
  ctx.lineWidth = 1 * scaleX;
  ctx.stroke();

  ctx.beginPath();
  ctx.roundRect(
    dX + 1 * scaleX,
    dY + 1 * scaleX,
    dW - 2 * scaleX,
    dH - 2 * scaleX,
    frameRadius,
  );
  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.lineWidth = 2 * scaleX;
  ctx.stroke();

  ctx.beginPath();
  ctx.roundRect(
    dX + 3 * scaleX,
    dY + 3 * scaleX,
    dW - 6 * scaleX,
    dH - 6 * scaleX,
    frameRadius,
  );
  ctx.strokeStyle = "rgba(0,0,0,0.2)";
  ctx.lineWidth = 2 * scaleX;
  ctx.stroke();
  ctx.restore();

  // --- Screen ---
  const screenX = dX + bezelThickness;
  const screenY = dY + bezelThickness;
  const screenW = dW - bezelThickness * 2;
  const screenH = dH - bezelThickness * 2;
  const screenRadius = frameRadius - bezelThickness;

  ctx.fillStyle = "#1c1c1e";
  ctx.beginPath();
  ctx.roundRect(screenX, screenY, screenW, screenH, screenRadius);
  ctx.fill();

  // --- Screenshot image ---
  if (screenshotSrc) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise<void>((resolve) => {
      img.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(screenX, screenY, screenW, screenH, screenRadius);
        ctx.clip();
        ctx.drawImage(img, screenX, screenY, screenW, screenH);
        ctx.restore();
        resolve();
      };
      img.onerror = () => resolve();
      img.src = screenshotSrc;
    });
  }

  // --- Camera elements ---
  if (selectedDevice.hasIsland) {
    const islandWidth = screenW * 0.28;
    const islandHeight = screenH * 0.032;
    const islandX = screenX + (screenW - islandWidth) / 2;
    const islandY = screenY + screenH * 0.018;
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
  } else if (selectedDevice.notchWidth > 0) {
    const notchWidth = screenW * 0.35;
    const notchHeight = screenH * 0.035;
    const notchX = screenX + (screenW - notchWidth) / 2;
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
  } else if (isSamsung) {
    const isTablet = selectedDevice.id.includes("tab");
    const camSize = screenW * (isTablet ? 0.018 : 0.025);
    const camX = isTablet
      ? screenX + screenW * 0.35
      : screenX + (screenW - camSize) / 2;
    const camY = screenY + screenH * (isTablet ? 0.015 : 0.02);
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(
      camX + camSize / 2,
      camY + camSize / 2,
      camSize / 2,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }

  return offscreen;
};

const parseFrameRadius = (radius: string): [number, number] => {
  const [xPct, yPct] = radius.split("/").map((s) => parseFloat(s) / 100);
  return [xPct, yPct];
};

const drawDeviceInstance = async (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  device: DeviceInstance,
  scaleX: number,
  renderX: number = device.x,
) => {
  const selectedDevice = getDeviceSpecById(device.deviceId);
  const selectedColor = getDeviceColorById(selectedDevice.id, device.colorId);

  const deviceWidthPx = canvas.width * (device.scale / 100);
  const deviceHeightPx =
    deviceWidthPx * (selectedDevice.height / selectedDevice.width);
  const deviceX = canvas.width * (renderX / 100) - deviceWidthPx / 2;
  const deviceY = canvas.height * (device.y / 100);

  const [outerRadiusXPct, outerRadiusYPct] = parseFrameRadius(
    selectedDevice.frameRadius.outer,
  );
  const cornerRadiusX = deviceWidthPx * outerRadiusXPct;
  const cornerRadiusY = deviceHeightPx * outerRadiusYPct;
  const frameRadius = Math.min(cornerRadiusX, cornerRadiusY);
  const bezelThickness = deviceWidthPx * 0.012;
  const isSamsungDevice = selectedDevice.id.startsWith("samsung-");

  if (device.style === "3d") {
    const rotYDeg = device.rotateY ?? -15;
    const rotXDeg = device.rotateX ?? 5;
    const ryRad = (rotYDeg * Math.PI) / 180;
    const rxRad = (rotXDeg * Math.PI) / 180;
    const perspective = 1200 * scaleX;
    const edgeDepth = EXPORT_EDGE_DEPTH * scaleX;

    const halfW = deviceWidthPx / 2;
    const halfH = deviceHeightPx / 2;
    const deviceCenterX = deviceX + halfW;
    const deviceCenterY = deviceY + halfH;

    const offscreen = await renderDeviceToOffscreen(
      deviceWidthPx,
      deviceHeightPx,
      frameRadius,
      bezelThickness,
      selectedDevice,
      selectedColor,
      device.screenshotSrc,
      scaleX,
      isSamsungDevice,
    );

    const SLICE_COUNT = 40;
    const halfEdge = edgeDepth / 2;

    if (device.shadow?.enabled) {
      ctx.save();
      ctx.shadowColor = device.shadow.color;
      ctx.shadowBlur = device.shadow.blur * scaleX;
      ctx.shadowOffsetX = device.shadow.offsetX * scaleX;
      ctx.shadowOffsetY = device.shadow.offsetY * scaleX;
      ctx.fillStyle = "rgba(0,0,0,0.01)";
      traceProjectedRoundedRect(
        ctx,
        halfW,
        halfH,
        frameRadius,
        halfEdge,
        ryRad,
        rxRad,
        perspective,
        deviceCenterX,
        deviceCenterY,
      );
      ctx.fill();
      ctx.restore();
    }

    for (let i = 0; i < SLICE_COUNT; i++) {
      const t = i / (SLICE_COUNT - 1);
      const z = lerp3d(-halfEdge, halfEdge, t);

      if (i === SLICE_COUNT - 1) {
        ctx.save();
        traceProjectedRoundedRect(
          ctx,
          halfW,
          halfH,
          frameRadius,
          z,
          ryRad,
          rxRad,
          perspective,
          deviceCenterX,
          deviceCenterY,
        );
        ctx.clip();
        const corners = getProjectedCorners(
          halfW,
          halfH,
          z,
          ryRad,
          rxRad,
          perspective,
          deviceCenterX,
          deviceCenterY,
        );
        drawPerspectiveImage(ctx, offscreen, corners, 40, 60);
        ctx.restore();
      } else {
        ctx.save();

        if (selectedColor.frameColors) {
          const gradient = ctx.createLinearGradient(
            deviceCenterX - halfW,
            deviceCenterY - halfH,
            deviceCenterX + halfW,
            deviceCenterY + halfH,
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
        traceProjectedRoundedRect(
          ctx,
          halfW,
          halfH,
          frameRadius,
          z,
          ryRad,
          rxRad,
          perspective,
          deviceCenterX,
          deviceCenterY,
        );
        ctx.fill();

        const darkness = (1 - t) * 0.28;
        ctx.fillStyle = `rgba(0, 0, 0, ${darkness})`;
        traceProjectedRoundedRect(
          ctx,
          halfW,
          halfH,
          frameRadius,
          z,
          ryRad,
          rxRad,
          perspective,
          deviceCenterX,
          deviceCenterY,
        );
        ctx.fill();

        ctx.restore();
      }
    }

    const btnWidthPx = deviceWidthPx * 0.006;

    const draw3DButton = (
      side: "left" | "right",
      topPct: number,
      heightPct: number,
    ) => {
      const isRight = side === "right";
      const btnH = deviceHeightPx * heightPct;
      const btnTopY = -halfH + deviceHeightPx * topPct;
      const btnBotY = btnTopY + btnH;
      const btnZFront = halfEdge + 2;
      const btnXInner = isRight ? halfW - 1 : -halfW + 1;
      const btnXOuter = isRight ? halfW + btnWidthPx : -halfW - btnWidthPx;

      const p0 = project3DPoint(
        btnXInner,
        btnTopY,
        btnZFront,
        ryRad,
        rxRad,
        perspective,
        deviceCenterX,
        deviceCenterY,
      );
      const p1 = project3DPoint(
        btnXOuter,
        btnTopY,
        btnZFront,
        ryRad,
        rxRad,
        perspective,
        deviceCenterX,
        deviceCenterY,
      );
      const p2 = project3DPoint(
        btnXOuter,
        btnBotY,
        btnZFront,
        ryRad,
        rxRad,
        perspective,
        deviceCenterX,
        deviceCenterY,
      );
      const p3 = project3DPoint(
        btnXInner,
        btnBotY,
        btnZFront,
        ryRad,
        rxRad,
        perspective,
        deviceCenterX,
        deviceCenterY,
      );

      ctx.save();
      if (selectedColor.frameColors) {
        const gradient = ctx.createLinearGradient(p0.x, p0.y, p1.x, p1.y);
        gradient.addColorStop(0, selectedColor.frameColors[1]);
        gradient.addColorStop(1, selectedColor.frameColors[2]);
        ctx.fillStyle = gradient;
      } else {
        ctx.fillStyle = selectedColor.frame;
      }
      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      ctx.lineTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineTo(p3.x, p3.y);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.fill();

      ctx.strokeStyle = "rgba(0,0,0,0.12)";
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.restore();
    };

    if (isSamsungDevice) {
      draw3DButton("right", 0.22, 0.05);
      draw3DButton("right", 0.29, 0.06);
      draw3DButton("right", 0.36, 0.06);
    } else {
      draw3DButton("right", 0.18, 0.08);
      draw3DButton("left", 0.15, 0.04);
      draw3DButton("left", 0.21, 0.06);
      draw3DButton("left", 0.28, 0.06);
    }

    return;
  }

  ctx.save();
  const deviceCenterX = deviceX + deviceWidthPx / 2;
  const deviceCenterY = deviceY + deviceHeightPx / 2;
  ctx.translate(deviceCenterX, deviceCenterY);
  ctx.rotate((device.rotation * Math.PI) / 180);
  ctx.translate(-deviceCenterX, -deviceCenterY);

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

  if (isSamsungDevice) {
    drawButton(
      deviceX + deviceWidthPx,
      deviceY + deviceHeightPx * 0.22,
      btnWidth,
      deviceHeightPx * 0.05,
      true,
    );
    drawButton(
      deviceX + deviceWidthPx,
      deviceY + deviceHeightPx * 0.29,
      btnWidth,
      deviceHeightPx * 0.06,
      true,
    );
    drawButton(
      deviceX + deviceWidthPx,
      deviceY + deviceHeightPx * 0.36,
      btnWidth,
      deviceHeightPx * 0.06,
      true,
    );
  } else {
    drawButton(
      deviceX + deviceWidthPx,
      deviceY + deviceHeightPx * 0.18,
      btnWidth,
      deviceHeightPx * 0.08,
      true,
    );
    drawButton(
      deviceX - btnWidth,
      deviceY + deviceHeightPx * 0.15,
      btnWidth,
      deviceHeightPx * 0.04,
      false,
    );
    drawButton(
      deviceX - btnWidth,
      deviceY + deviceHeightPx * 0.21,
      btnWidth,
      deviceHeightPx * 0.06,
      false,
    );
    drawButton(
      deviceX - btnWidth,
      deviceY + deviceHeightPx * 0.28,
      btnWidth,
      deviceHeightPx * 0.06,
      false,
    );
  }

  ctx.save();
  if (device.shadow?.enabled) {
    ctx.shadowColor = device.shadow.color;
    ctx.shadowBlur = device.shadow.blur * scaleX;
    ctx.shadowOffsetX = device.shadow.offsetX * scaleX;
    ctx.shadowOffsetY = device.shadow.offsetY * scaleX;
  }
  if (selectedColor.frameColors) {
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

  ctx.strokeStyle = "rgba(0,0,0,0.1)";
  ctx.lineWidth = 1 * scaleX;
  ctx.stroke();

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

  const screenX = deviceX + bezelThickness;
  const screenY = deviceY + bezelThickness;
  const screenWidthPx = deviceWidthPx - bezelThickness * 2;
  const screenHeightPx = deviceHeightPx - bezelThickness * 2;
  const screenRadius = frameRadius - bezelThickness;

  ctx.fillStyle = "#1c1c1e";
  ctx.beginPath();
  ctx.roundRect(screenX, screenY, screenWidthPx, screenHeightPx, screenRadius);
  ctx.fill();

  const screenshotSrc = device.screenshotSrc;
  if (screenshotSrc) {
    const img = new Image();
    img.crossOrigin = "anonymous";
    await new Promise<void>((resolve) => {
      img.onload = () => {
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(screenX, screenY, screenWidthPx, screenHeightPx, screenRadius);
        ctx.clip();
        ctx.drawImage(img, screenX, screenY, screenWidthPx, screenHeightPx);
        ctx.restore();
        resolve();
      };
      img.onerror = () => resolve();
      img.src = screenshotSrc;
    });
  }

  if (selectedDevice.hasIsland) {
    const islandWidth = screenWidthPx * 0.28;
    const islandHeight = screenHeightPx * 0.032;
    const islandX = screenX + (screenWidthPx - islandWidth) / 2;
    const islandY = screenY + screenHeightPx * 0.018;
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.roundRect(islandX, islandY, islandWidth, islandHeight, islandHeight / 2);
    ctx.fill();
  } else if (selectedDevice.notchWidth > 0) {
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
  } else if (isSamsungDevice) {
    const isTablet = selectedDevice.id.includes("tab");
    const camSize = screenWidthPx * (isTablet ? 0.018 : 0.025);
    const camX = isTablet
      ? screenX + screenWidthPx * 0.35
      : screenX + (screenWidthPx - camSize) / 2;
    const camY = screenY + screenHeightPx * (isTablet ? 0.015 : 0.02);
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(
      camX + camSize / 2,
      camY + camSize / 2,
      camSize / 2,
      0,
      Math.PI * 2,
    );
    ctx.fill();
  }

  ctx.restore();
};

export const exportScreenshots = async ({
  screenshots,
  exportSize,
  previewDimensions,
  headlineFontSize,
  subheadlineFontSize,
}: ExportOptions) => {
  // Wait for fonts to be loaded before exporting
  await document.fonts.ready;

  const exportedFiles: { name: string; data: string }[] = [];

  for (let i = 0; i < screenshots.length; i++) {
    const screenshot = screenshots[i];
    const filename = `appstore-screenshot-${i + 1}.png`;

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

    const renderableDevices = getRenderableDevicesForScreenshot(screenshots, i);
    for (const { device, localX } of renderableDevices) {
      await drawDeviceInstance(ctx, canvas, device, scaleX, localX);
    }

    const fontFamily = `'${screenshot.fontFamily}', sans-serif`;
    const exportHeadlineFontSize = (headlineFontSize / 3) * scaleX;
    const exportSubheadlineFontSize = (subheadlineFontSize / 3) * scaleX;
    const lineHeight = 1.1;
    const headlineMaxWidth =
      canvas.width * (screenshot.headlineWidth / 100) - paddingX;
    const subheadlineMaxWidth =
      canvas.width * (screenshot.subheadlineWidth / 100) - paddingX;
    const headlineX = canvas.width * (screenshot.headlineX / 100);
    const headlineTextY = canvas.height * (screenshot.headlineY / 100);

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

    // Draw overlay images in front of device
    await drawOverlayImages("front");

    // Add to exported files
    const dataURL = canvas.toDataURL("image/png");
    exportedFiles.push({ name: filename, data: dataURL });
  }

  // Download: single file directly, multiple files as ZIP
  if (exportedFiles.length === 1) {
    downloadFile(exportedFiles[0].data, exportedFiles[0].name);
  } else if (exportedFiles.length > 1) {
    await downloadAsZip(exportedFiles);
  }
};
