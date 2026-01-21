import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

// Load Google Fonts
const loadGoogleFonts = () => {
  const link = document.createElement("link");
  link.href =
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Roboto:wght@400;500;700;900&family=Poppins:wght@400;600;700;800&family=Montserrat:wght@400;600;700;800&family=Playfair+Display:wght@400;600;700&family=Lato:wght@400;700;900&family=Oswald:wght@400;600;700&family=Raleway:wght@400;600;700;800&family=Open+Sans:wght@400;600;700;800&family=Nunito:wght@400;600;700;800&display=swap";
  link.rel = "stylesheet";
  document.head.appendChild(link);
};

export const Route = createFileRoute("/")({
  component: App,
});

type DeviceColor = {
  id: string;
  label: string;
  frame: string;
  screen: string;
};

type DeviceSpec = {
  id: string;
  label: string;
  width: number;
  height: number;
  screenInset: { top: number; right: number; bottom: number; left: number };
  cornerRadius: number;
  notchWidth: number;
  notchHeight: number;
  hasIsland: boolean;
  colors: DeviceColor[];
};

type GradientPreset = {
  id: string;
  label: string;
  from: string;
  to: string;
};

type ImageOverlay = {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

type Screenshot = {
  id: string;
  headline: string;
  subheadline: string;
  screenshotSrc: string | null;
  backgroundColor: string;
  backgroundMode: "solid" | "gradient";
  gradientPresetId: string;
  textColor: string;
  headlineX: number;
  headlineY: number;
  headlineWidth: number;
  subheadlineX: number;
  subheadlineY: number;
  subheadlineWidth: number;
  fontFamily: string;
  overlayImages: ImageOverlay[];
};

type FontOption = {
  id: string;
  label: string;
  value: string;
  weight: string;
};

const fontOptions: FontOption[] = [
  { id: "inter", label: "Inter", value: "Inter", weight: "400;600;700;800" },
  { id: "roboto", label: "Roboto", value: "Roboto", weight: "400;500;700;900" },
  {
    id: "poppins",
    label: "Poppins",
    value: "Poppins",
    weight: "400;600;700;800",
  },
  {
    id: "montserrat",
    label: "Montserrat",
    value: "Montserrat",
    weight: "400;600;700;800",
  },
  {
    id: "playfair",
    label: "Playfair Display",
    value: "Playfair Display",
    weight: "400;600;700",
  },
  { id: "lato", label: "Lato", value: "Lato", weight: "400;700;900" },
  { id: "oswald", label: "Oswald", value: "Oswald", weight: "400;600;700" },
  {
    id: "raleway",
    label: "Raleway",
    value: "Raleway",
    weight: "400;600;700;800",
  },
  {
    id: "open-sans",
    label: "Open Sans",
    value: "Open Sans",
    weight: "400;600;700;800",
  },
  { id: "nunito", label: "Nunito", value: "Nunito", weight: "400;600;700;800" },
];

const devices: DeviceSpec[] = [
  {
    id: "iphone-15-pro-max",
    label: "iPhone 15 Pro Max",
    width: 1290,
    height: 2796,
    screenInset: { top: 20, right: 20, bottom: 20, left: 20 },
    cornerRadius: 110,
    notchWidth: 250,
    notchHeight: 70,
    hasIsland: true,
    colors: [
      {
        id: "black",
        label: "Black Titanium",
        frame: "#1c1c1e",
        screen: "#000",
      },
      { id: "natural", label: "Natural", frame: "#c5b9a8", screen: "#000" },
      { id: "blue", label: "Blue", frame: "#3d4a5c", screen: "#000" },
      { id: "white", label: "White", frame: "#f5f5f7", screen: "#000" },
    ],
  },
  {
    id: "iphone-15-pro",
    label: "iPhone 15 Pro",
    width: 1179,
    height: 2556,
    screenInset: { top: 18, right: 18, bottom: 18, left: 18 },
    cornerRadius: 100,
    notchWidth: 230,
    notchHeight: 65,
    hasIsland: true,
    colors: [
      {
        id: "black",
        label: "Black Titanium",
        frame: "#1c1c1e",
        screen: "#000",
      },
      { id: "natural", label: "Natural", frame: "#c5b9a8", screen: "#000" },
      { id: "blue", label: "Blue", frame: "#3d4a5c", screen: "#000" },
      { id: "white", label: "White", frame: "#f5f5f7", screen: "#000" },
    ],
  },
  {
    id: "iphone-14",
    label: "iPhone 14",
    width: 1170,
    height: 2532,
    screenInset: { top: 18, right: 18, bottom: 18, left: 18 },
    cornerRadius: 95,
    notchWidth: 210,
    notchHeight: 60,
    hasIsland: false,
    colors: [
      { id: "midnight", label: "Midnight", frame: "#1c1c1e", screen: "#000" },
      { id: "purple", label: "Purple", frame: "#e5ddea", screen: "#000" },
      { id: "blue", label: "Blue", frame: "#a7c1d9", screen: "#000" },
      { id: "red", label: "Red", frame: "#fc0324", screen: "#000" },
    ],
  },
];

const gradientPresets: GradientPreset[] = [
  { id: "purple", label: "Purple", from: "#a78bfa", to: "#818cf8" },
  { id: "blue", label: "Blue", from: "#60a5fa", to: "#3b82f6" },
  { id: "green", label: "Green", from: "#4ade80", to: "#22c55e" },
  { id: "orange", label: "Orange", from: "#fb923c", to: "#f97316" },
  { id: "pink", label: "Pink", from: "#f472b6", to: "#ec4899" },
  { id: "teal", label: "Teal", from: "#2dd4bf", to: "#14b8a6" },
];

const exportSizes = [
  { id: "6.7", label: '6.7" Display', width: 1290, height: 2796 },
  { id: "6.5", label: '6.5" Display', width: 1284, height: 2778 },
  { id: "5.5", label: '5.5" Display', width: 1242, height: 2208 },
];

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

function App() {
  const [selectedDeviceId, setSelectedDeviceId] = useState(devices[0].id);
  const [selectedColorId, setSelectedColorId] = useState(
    devices[0].colors[0].id,
  );
  const [exportSizeId, setExportSizeId] = useState(exportSizes[0].id);
  const [screenshots, setScreenshots] = useState<Screenshot[]>([
    {
      id: generateId(),
      headline: "1M+\nhappy users",
      subheadline: "Turn your beautiful vision\ninto reality",
      screenshotSrc: null,
      backgroundColor: "#a78bfa",
      backgroundMode: "solid",
      gradientPresetId: "purple",
      textColor: "#ffffff",
      headlineX: 50,
      headlineY: 8,
      headlineWidth: 90,
      subheadlineX: 50,
      subheadlineY: 22,
      subheadlineWidth: 90,
      fontFamily: "inter",
      overlayImages: [],
    },
  ]);
  const [selectedElement, setSelectedElement] = useState<{
    type: "headline" | "subheadline" | "image";
    imageId?: string;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const dragStartElementPos = useRef({ x: 0, y: 0 });
  const overlayImageInputRef = useRef<HTMLInputElement>(null);
  const [activeScreenshotId, setActiveScreenshotId] = useState(
    screenshots[0].id,
  );
  const [headlineFontSize, setHeadlineFontSize] = useState(72);
  const [subheadlineFontSize, setSubheadlineFontSize] = useState(42);
  const [deviceScale, setDeviceScale] = useState(65);
  const [deviceOffsetY, setDeviceOffsetY] = useState(35);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Load Google Fonts on mount
  useEffect(() => {
    loadGoogleFonts();
  }, []);

  const selectedDevice =
    devices.find((d) => d.id === selectedDeviceId) ?? devices[0];
  const selectedColor =
    selectedDevice.colors.find((c) => c.id === selectedColorId) ??
    selectedDevice.colors[0];
  const activeScreenshot =
    screenshots.find((s) => s.id === activeScreenshotId) ?? screenshots[0];
  const exportSize =
    exportSizes.find((s) => s.id === exportSizeId) ?? exportSizes[0];

  const updateActiveScreenshot = (updates: Partial<Screenshot>) => {
    setScreenshots((prev) =>
      prev.map((s) => (s.id === activeScreenshotId ? { ...s, ...updates } : s)),
    );
  };

  const addScreenshot = () => {
    const newScreenshot: Screenshot = {
      id: generateId(),
      headline: "Your headline",
      subheadline: "Your subheadline here",
      screenshotSrc: null,
      backgroundColor: "#a78bfa",
      backgroundMode: "solid",
      gradientPresetId: "purple",
      textColor: "#ffffff",
      headlineX: 50,
      headlineY: 8,
      headlineWidth: 90,
      subheadlineX: 50,
      subheadlineY: 22,
      subheadlineWidth: 90,
      fontFamily: "inter",
      overlayImages: [],
    };
    setScreenshots((prev) => [...prev, newScreenshot]);
    setActiveScreenshotId(newScreenshot.id);
  };

  const getSelectedFont = () => {
    const font = fontOptions.find((f) => f.id === activeScreenshot.fontFamily);
    return font
      ? `'${font.value}', sans-serif`
      : `'${fontOptions[0].value}', sans-serif`;
  };

  const handleElementMouseDown = (
    e: React.MouseEvent,
    elementType: "headline" | "subheadline" | "image",
    imageId?: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedElement({ type: elementType, imageId });
    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };

    if (elementType === "headline") {
      dragStartElementPos.current = {
        x: activeScreenshot.headlineX,
        y: activeScreenshot.headlineY,
      };
    } else if (elementType === "subheadline") {
      dragStartElementPos.current = {
        x: activeScreenshot.subheadlineX,
        y: activeScreenshot.subheadlineY,
      };
    } else if (elementType === "image" && imageId) {
      const image = activeScreenshot.overlayImages.find(
        (img) => img.id === imageId,
      );
      if (image) {
        dragStartElementPos.current = { x: image.x, y: image.y };
      }
    }
  };

  const handleElementMouseMove = (
    e: React.MouseEvent,
    containerRect: DOMRect,
  ) => {
    if (!isDragging || !selectedElement) return;

    const deltaX =
      ((e.clientX - dragStartPos.current.x) / containerRect.width) * 100;
    const deltaY =
      ((e.clientY - dragStartPos.current.y) / containerRect.height) * 100;

    const newX = Math.max(
      0,
      Math.min(100, dragStartElementPos.current.x + deltaX),
    );
    const newY = Math.max(
      0,
      Math.min(100, dragStartElementPos.current.y + deltaY),
    );

    if (selectedElement.type === "headline") {
      updateActiveScreenshot({ headlineX: newX, headlineY: newY });
    } else if (selectedElement.type === "subheadline") {
      updateActiveScreenshot({ subheadlineX: newX, subheadlineY: newY });
    } else if (selectedElement.type === "image" && selectedElement.imageId) {
      const updatedImages = activeScreenshot.overlayImages.map((img) =>
        img.id === selectedElement.imageId ? { ...img, x: newX, y: newY } : img,
      );
      updateActiveScreenshot({ overlayImages: updatedImages });
    }
  };

  const handleElementMouseUp = () => {
    setIsDragging(false);
  };

  const addOverlayImage = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        const img = new Image();
        img.onload = () => {
          const aspectRatio = img.width / img.height;
          const newImage: ImageOverlay = {
            id: generateId(),
            src: result,
            x: 50,
            y: 50,
            width: 20,
            height: 20 / aspectRatio,
          };
          updateActiveScreenshot({
            overlayImages: [...activeScreenshot.overlayImages, newImage],
          });
          setSelectedElement({ type: "image", imageId: newImage.id });
        };
        img.src = result;
      }
    };
    reader.readAsDataURL(file);
  };

  const removeOverlayImage = (imageId: string) => {
    const updatedImages = activeScreenshot.overlayImages.filter(
      (img) => img.id !== imageId,
    );
    updateActiveScreenshot({ overlayImages: updatedImages });
    if (selectedElement?.imageId === imageId) {
      setSelectedElement(null);
    }
  };

  const updateOverlayImageSize = (imageId: string, width: number) => {
    const image = activeScreenshot.overlayImages.find(
      (img) => img.id === imageId,
    );
    if (image) {
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const updatedImages = activeScreenshot.overlayImages.map((i) =>
          i.id === imageId ? { ...i, width, height: width / aspectRatio } : i,
        );
        updateActiveScreenshot({ overlayImages: updatedImages });
      };
      img.src = image.src;
    }
  };

  const bringImageForward = (imageId: string) => {
    const images = [...activeScreenshot.overlayImages];
    const index = images.findIndex((img) => img.id === imageId);
    if (index < images.length - 1) {
      const temp = images[index];
      images[index] = images[index + 1];
      images[index + 1] = temp;
      updateActiveScreenshot({ overlayImages: images });
    }
  };

  const sendImageBackward = (imageId: string) => {
    const images = [...activeScreenshot.overlayImages];
    const index = images.findIndex((img) => img.id === imageId);
    if (index > 0) {
      const temp = images[index];
      images[index] = images[index - 1];
      images[index - 1] = temp;
      updateActiveScreenshot({ overlayImages: images });
    }
  };

  const bringImageToFront = (imageId: string) => {
    const images = [...activeScreenshot.overlayImages];
    const index = images.findIndex((img) => img.id === imageId);
    if (index < images.length - 1) {
      const [image] = images.splice(index, 1);
      images.push(image);
      updateActiveScreenshot({ overlayImages: images });
    }
  };

  const sendImageToBack = (imageId: string) => {
    const images = [...activeScreenshot.overlayImages];
    const index = images.findIndex((img) => img.id === imageId);
    if (index > 0) {
      const [image] = images.splice(index, 1);
      images.unshift(image);
      updateActiveScreenshot({ overlayImages: images });
    }
  };

  const removeScreenshot = (id: string) => {
    if (screenshots.length <= 1) return;
    const newScreenshots = screenshots.filter((s) => s.id !== id);
    setScreenshots(newScreenshots);
    if (activeScreenshotId === id) {
      setActiveScreenshotId(newScreenshots[0].id);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        updateActiveScreenshot({ screenshotSrc: result });
      }
    };
    reader.readAsDataURL(file);
  };

  const getBackgroundStyle = (screenshot: Screenshot) => {
    if (screenshot.backgroundMode === "gradient") {
      const preset =
        gradientPresets.find((p) => p.id === screenshot.gradientPresetId) ??
        gradientPresets[0];
      return `linear-gradient(180deg, ${preset.from}, ${preset.to})`;
    }
    return screenshot.backgroundColor;
  };

  const handleExport = async () => {
    // Wait for fonts to be loaded before exporting
    await document.fonts.ready;

    for (const screenshot of screenshots) {
      const canvas = document.createElement("canvas");
      canvas.width = exportSize.width;
      canvas.height = exportSize.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) continue;

      // Calculate scale: preview width is approximately canvas.width / 3
      // because preview uses fontSize/3 and displays at roughly 1/3 size
      const exportScale = canvas.width / 1290;

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
      const fontOption =
        fontOptions.find((f) => f.id === screenshot.fontFamily) ||
        fontOptions[0];
      const fontFamily = `'${fontOption.value}', sans-serif`;

      // Font sizes - use the full font size, scaled for export resolution
      const exportHeadlineFontSize = headlineFontSize * exportScale;
      const exportSubheadlineFontSize = subheadlineFontSize * exportScale;
      const lineHeight = 1.1;

      // Text max widths based on percentage (same as preview)
      // The preview uses width as percentage, and we need to match that exactly
      const headlineMaxWidth = canvas.width * (screenshot.headlineWidth / 100);
      const subheadlineMaxWidth =
        canvas.width * (screenshot.subheadlineWidth / 100);

      // Word wrap function that respects max width - matches CSS behavior
      const wrapText = (text: string, maxWidth: number): string[] => {
        const lines: string[] = [];
        // First split by explicit newlines
        const paragraphs = text.split("\n");

        for (const paragraph of paragraphs) {
          if (paragraph === "") {
            lines.push("");
            continue;
          }

          const words = paragraph.split(" ");
          let currentLine = "";

          for (const word of words) {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            const metrics = ctx.measureText(testLine);

            if (metrics.width > maxWidth && currentLine) {
              lines.push(currentLine);
              currentLine = word;
            } else {
              currentLine = testLine;
            }
          }

          if (currentLine) {
            lines.push(currentLine);
          }
        }

        return lines;
      };

      // Draw headline
      ctx.fillStyle = screenshot.textColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "top";

      const headlineX = canvas.width * (screenshot.headlineX / 100);
      let headlineTextY = canvas.height * (screenshot.headlineY / 100);

      // Set font before wrapping to ensure correct measurement
      const headlineFont = `700 ${exportHeadlineFontSize}px ${fontFamily}`;
      ctx.font = headlineFont;

      const headlineLines = wrapText(screenshot.headline, headlineMaxWidth);

      headlineLines.forEach((line) => {
        ctx.fillText(line, headlineX, headlineTextY);
        headlineTextY += exportHeadlineFontSize * lineHeight;
      });

      // Draw subheadline
      const subheadlineX = canvas.width * (screenshot.subheadlineX / 100);
      let subheadlineTextY = canvas.height * (screenshot.subheadlineY / 100);

      // Set font before wrapping to ensure correct measurement
      const subheadlineFont = `600 ${exportSubheadlineFontSize}px ${fontFamily}`;
      ctx.font = subheadlineFont;

      const subheadlineLines = wrapText(
        screenshot.subheadline,
        subheadlineMaxWidth,
      );

      subheadlineLines.forEach((line) => {
        ctx.fillText(line, subheadlineX, subheadlineTextY);
        subheadlineTextY += exportSubheadlineFontSize * lineHeight;
      });

      // Draw overlay images
      for (const overlayImg of screenshot.overlayImages) {
        const img = new Image();
        await new Promise<void>((resolve) => {
          img.onload = () => {
            const imgX =
              canvas.width * (overlayImg.x / 100) -
              (canvas.width * (overlayImg.width / 100)) / 2;
            const imgY =
              canvas.height * (overlayImg.y / 100) -
              (canvas.height * (overlayImg.height / 100)) / 2;
            const imgWidth = canvas.width * (overlayImg.width / 100);
            const imgHeight = canvas.height * (overlayImg.height / 100);
            ctx.drawImage(img, imgX, imgY, imgWidth, imgHeight);
            resolve();
          };
          img.onerror = () => resolve();
          img.src = overlayImg.src;
        });
      }

      // Draw device - use same percentage-based positioning as preview
      const deviceWidthPx = canvas.width * (deviceScale / 100);
      const deviceHeightPx =
        deviceWidthPx * (selectedDevice.height / selectedDevice.width);
      const deviceX = (canvas.width - deviceWidthPx) / 2;
      const deviceY = canvas.height * (deviceOffsetY / 100);

      // Corner radius - 14% of width / 6.5% of height (same as CSS borderRadius: "14%/6.5%")
      const cornerRadiusX = deviceWidthPx * 0.14;
      const cornerRadiusY = deviceHeightPx * 0.065;
      const frameRadius = Math.min(cornerRadiusX, cornerRadiusY);

      // Bezel/padding is 1.5% of device width (same as CSS padding: "1.5%")
      const bezelThickness = deviceWidthPx * 0.015;

      // Draw device frame with shadow
      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 50 * exportScale;
      ctx.shadowOffsetY = 25 * exportScale;
      ctx.fillStyle = selectedColor.frame;
      ctx.beginPath();
      ctx.roundRect(
        deviceX,
        deviceY,
        deviceWidthPx,
        deviceHeightPx,
        frameRadius,
      );
      ctx.fill();
      ctx.restore();

      // Inner bezel edge (1.2% inset with darker color)
      const innerInset = deviceWidthPx * 0.012;
      ctx.fillStyle = "#1a1a1a";
      ctx.beginPath();
      ctx.roundRect(
        deviceX + innerInset,
        deviceY + innerInset,
        deviceWidthPx - innerInset * 2,
        deviceHeightPx - innerInset * 2,
        frameRadius - innerInset,
      );
      ctx.fill();

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
      if (!selectedDevice.hasIsland && selectedDevice.notchWidth > 0) {
        const notchWidth = screenWidthPx * 0.35;
        const notchHeight = screenHeightPx * 0.035;
        const notchX = screenX + (screenWidthPx - notchWidth) / 2;
        const notchY = screenY;
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.roundRect(notchX, notchY, notchWidth, notchHeight, [
          0,
          0,
          20 * exportScale,
          20 * exportScale,
        ]);
        ctx.fill();
      }

      // Download
      const link = document.createElement("a");
      link.download = `appstore-screenshot-${screenshots.indexOf(screenshot) + 1}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      await new Promise((r) => setTimeout(r, 500));
    }
  };

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-white overflow-hidden">
      {/* Left Sidebar */}
      <aside className="w-72 shrink-0 border-r border-white/10 bg-[#141414] flex flex-col">
        <div className="p-4 border-b border-white/10">
          <h1 className="text-lg font-semibold">App Store Editor</h1>
          <p className="text-xs text-gray-400 mt-1">
            Create beautiful screenshots
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Device Section */}
          <section className="rounded-lg bg-[#1e1e1e] p-3">
            <h2 className="text-xs font-medium text-gray-300 uppercase tracking-wider mb-3">
              Device
            </h2>
            <div className="space-y-2">
              {devices.map((device) => (
                <button
                  key={device.id}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                    selectedDeviceId === device.id
                      ? "bg-violet-600 text-white"
                      : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
                  }`}
                  onClick={() => {
                    setSelectedDeviceId(device.id);
                    setSelectedColorId(device.colors[0].id);
                  }}
                >
                  {device.label}
                </button>
              ))}
            </div>
            <div className="mt-3">
              <p className="text-xs text-gray-400 mb-2">Color</p>
              <div className="flex flex-wrap gap-2">
                {selectedDevice.colors.map((color) => (
                  <button
                    key={color.id}
                    className={`w-7 h-7 rounded-full border-2 transition-all ${
                      selectedColorId === color.id
                        ? "border-violet-500 scale-110"
                        : "border-transparent"
                    }`}
                    style={{ backgroundColor: color.frame }}
                    onClick={() => setSelectedColorId(color.id)}
                    title={color.label}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Layout Section */}
          <section className="rounded-lg bg-[#1e1e1e] p-3">
            <h2 className="text-xs font-medium text-gray-300 uppercase tracking-wider mb-3">
              Layout
            </h2>
            <div className="space-y-3">
              <label className="block">
                <span className="text-xs text-gray-400">
                  Device Size: {deviceScale}%
                </span>
                <input
                  type="range"
                  min="40"
                  max="90"
                  value={deviceScale}
                  onChange={(e) => setDeviceScale(Number(e.target.value))}
                  className="w-full mt-1 accent-violet-500"
                />
              </label>
              <label className="block">
                <span className="text-xs text-gray-400">
                  Device Position: {deviceOffsetY}%
                </span>
                <input
                  type="range"
                  min="20"
                  max="60"
                  value={deviceOffsetY}
                  onChange={(e) => setDeviceOffsetY(Number(e.target.value))}
                  className="w-full mt-1 accent-violet-500"
                />
              </label>
              <label className="block">
                <span className="text-xs text-gray-400">
                  Headline Size: {headlineFontSize}px
                </span>
                <input
                  type="range"
                  min="32"
                  max="120"
                  value={headlineFontSize}
                  onChange={(e) => setHeadlineFontSize(Number(e.target.value))}
                  className="w-full mt-1 accent-violet-500"
                />
              </label>
              <label className="block">
                <span className="text-xs text-gray-400">
                  Subheadline Size: {subheadlineFontSize}px
                </span>
                <input
                  type="range"
                  min="20"
                  max="72"
                  value={subheadlineFontSize}
                  onChange={(e) =>
                    setSubheadlineFontSize(Number(e.target.value))
                  }
                  className="w-full mt-1 accent-violet-500"
                />
              </label>
            </div>
          </section>

          {/* Export Section */}
          <section className="rounded-lg bg-[#1e1e1e] p-3">
            <h2 className="text-xs font-medium text-gray-300 uppercase tracking-wider mb-3">
              Export
            </h2>
            <div className="space-y-2">
              {exportSizes.map((size) => (
                <button
                  key={size.id}
                  className={`w-full rounded-md px-3 py-2 text-left text-sm transition-colors ${
                    exportSizeId === size.id
                      ? "bg-violet-600 text-white"
                      : "bg-[#2a2a2a] text-gray-300 hover:bg-[#333]"
                  }`}
                  onClick={() => setExportSizeId(size.id)}
                >
                  {size.label}
                </button>
              ))}
            </div>
            <button
              onClick={handleExport}
              className="w-full mt-3 bg-violet-600 hover:bg-violet-700 text-white font-medium py-2.5 rounded-lg transition-colors"
            >
              Export All ({screenshots.length})
            </button>
          </section>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Toolbar */}
        <div className="h-14 border-b border-white/10 bg-[#141414] flex items-center px-4 gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={addScreenshot}
              className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium px-3 py-1.5 rounded-md transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Screenshot
            </button>
          </div>
          <div className="flex-1" />
          <span className="text-xs text-gray-400">
            {screenshots.length} screenshot{screenshots.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Preview Area - Horizontal Scroll */}
        <div
          ref={canvasContainerRef}
          className="flex-1 overflow-x-auto overflow-y-hidden bg-[#0a0a0a] p-6"
        >
          <div className="flex gap-4 h-full min-w-max">
            {screenshots.map((screenshot) => (
              <div
                key={screenshot.id}
                onClick={(e) => {
                  if (activeScreenshotId !== screenshot.id) {
                    setActiveScreenshotId(screenshot.id);
                    setSelectedElement(null);
                  }
                }}
                onMouseMove={(e) => {
                  if (activeScreenshotId === screenshot.id) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    handleElementMouseMove(e, rect);
                  }
                }}
                onMouseUp={handleElementMouseUp}
                onMouseLeave={handleElementMouseUp}
                onMouseDown={(event) => {
                  // Only deselect if clicking directly on the background, not on elements
                  if (
                    activeScreenshotId === screenshot.id &&
                    !(event.target as HTMLElement).closest(
                      "[data-draggable-element]",
                    )
                  ) {
                    setSelectedElement(null);
                  }
                }}
                className={`relative h-full aspect-[9/19.5] rounded-xl overflow-hidden cursor-pointer transition-all ${
                  activeScreenshotId === screenshot.id
                    ? "ring-2 ring-violet-500 ring-offset-2 ring-offset-[#0a0a0a]"
                    : "opacity-70 hover:opacity-100"
                }`}
                style={{ background: getBackgroundStyle(screenshot) }}
              >
                {/* Remove button */}
                {screenshots.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeScreenshot(screenshot.id);
                    }}
                    className="absolute top-2 right-2 w-6 h-6 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white z-10"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}

                {/* Content */}
                <div className="absolute inset-0 select-none">
                  {/* Overlay Images - Draggable */}
                  {screenshot.overlayImages.map((overlayImg, index) => (
                    <div
                      key={overlayImg.id}
                      data-draggable-element="image"
                      className="absolute cursor-move transition-all select-none"
                      style={{
                        left: `${overlayImg.x}%`,
                        top: `${overlayImg.y}%`,
                        transform: "translate(-50%, -50%)",
                        width: `${overlayImg.width}%`,
                        height: `${overlayImg.height}%`,
                        zIndex: index + 1,
                        outline:
                          activeScreenshotId === screenshot.id &&
                          selectedElement?.type === "image" &&
                          selectedElement?.imageId === overlayImg.id
                            ? "2px dashed rgba(255,255,255,0.8)"
                            : "none",
                        outlineOffset: "4px",
                      }}
                      onMouseDown={(e) => {
                        if (activeScreenshotId === screenshot.id) {
                          handleElementMouseDown(e, "image", overlayImg.id);
                        }
                      }}
                    >
                      <img
                        src={overlayImg.src}
                        alt="Overlay"
                        className="w-full h-full object-contain pointer-events-none"
                        draggable={false}
                      />
                      {activeScreenshotId === screenshot.id &&
                        selectedElement?.type === "image" &&
                        selectedElement?.imageId === overlayImg.id && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeOverlayImage(overlayImg.id);
                            }}
                            className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-xs z-10"
                          >
                            ×
                          </button>
                        )}
                    </div>
                  ))}

                  {/* Headline - Draggable */}
                  <div
                    data-draggable-element="headline"
                    className="absolute cursor-move text-center font-bold transition-all select-none"
                    style={{
                      left: `${screenshot.headlineX}%`,
                      top: `${screenshot.headlineY}%`,
                      transform: "translateX(-50%)",
                      width: `${screenshot.headlineWidth}%`,
                      fontSize: `${headlineFontSize / 3}px`,
                      lineHeight: 1.1,
                      color: screenshot.textColor,
                      fontFamily: getSelectedFont(),
                      outline:
                        activeScreenshotId === screenshot.id &&
                        selectedElement?.type === "headline"
                          ? "2px dashed rgba(255,255,255,0.8)"
                          : "none",
                      outlineOffset: "4px",
                      background:
                        activeScreenshotId === screenshot.id &&
                        selectedElement?.type === "headline"
                          ? "rgba(255,255,255,0.1)"
                          : "transparent",
                      padding: "8px",
                      borderRadius: "8px",
                    }}
                    onMouseDown={(e) => {
                      if (activeScreenshotId === screenshot.id) {
                        handleElementMouseDown(e, "headline");
                      }
                    }}
                  >
                    {screenshot.headline}
                  </div>

                  {/* Subheadline - Draggable */}
                  <div
                    data-draggable-element="subheadline"
                    className="absolute cursor-move text-center font-semibold transition-all select-none"
                    style={{
                      left: `${screenshot.subheadlineX}%`,
                      top: `${screenshot.subheadlineY}%`,
                      transform: "translateX(-50%)",
                      width: `${screenshot.subheadlineWidth}%`,
                      fontSize: `${subheadlineFontSize / 3}px`,
                      lineHeight: 1.1,
                      color: screenshot.textColor,
                      fontFamily: getSelectedFont(),
                      outline:
                        activeScreenshotId === screenshot.id &&
                        selectedElement?.type === "subheadline"
                          ? "2px dashed rgba(255,255,255,0.8)"
                          : "none",
                      outlineOffset: "4px",
                      background:
                        activeScreenshotId === screenshot.id &&
                        selectedElement?.type === "subheadline"
                          ? "rgba(255,255,255,0.1)"
                          : "transparent",
                      padding: "8px",
                      borderRadius: "8px",
                    }}
                    onMouseDown={(e) => {
                      if (activeScreenshotId === screenshot.id) {
                        handleElementMouseDown(e, "subheadline");
                      }
                    }}
                  >
                    {screenshot.subheadline}
                  </div>

                  {/* Device */}
                  <div
                    className="absolute left-1/2 -translate-x-1/2"
                    style={{
                      width: `${deviceScale}%`,
                      top: `${deviceOffsetY}%`,
                    }}
                  >
                    {/* iPhone Frame */}
                    <div
                      className="relative w-full shadow-2xl"
                      style={{
                        aspectRatio: `${selectedDevice.width} / ${selectedDevice.height}`,
                        backgroundColor: selectedColor.frame,
                        borderRadius: "14%/6.5%",
                        padding: "1.5%",
                        boxShadow:
                          "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.1) inset",
                      }}
                    >
                      {/* Inner bezel edge */}
                      <div
                        className="absolute inset-[1.2%] rounded-[13%/6%]"
                        style={{
                          backgroundColor: "#1a1a1a",
                          boxShadow: "0 0 0 1px rgba(0,0,0,0.8) inset",
                        }}
                      />
                      {/* Screen */}
                      <div
                        className="relative w-full h-full overflow-hidden"
                        style={{
                          backgroundColor: "#000",
                          borderRadius: "12.5%/5.8%",
                        }}
                      >
                        {screenshot.screenshotSrc ? (
                          <img
                            src={screenshot.screenshotSrc}
                            alt="Screenshot"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-[#1c1c1e]">
                            <span className="text-gray-600 text-[10px]">
                              No image
                            </span>
                          </div>
                        )}

                        {/* Dynamic Island */}
                        {selectedDevice.hasIsland && (
                          <div
                            className="absolute left-1/2 -translate-x-1/2 bg-black"
                            style={{
                              top: "1.8%",
                              width: "28%",
                              height: "3.2%",
                              borderRadius: "50px",
                            }}
                          />
                        )}

                        {/* Notch for older iPhones */}
                        {!selectedDevice.hasIsland &&
                          selectedDevice.notchWidth > 0 && (
                            <div
                              className="absolute top-0 left-1/2 -translate-x-1/2 bg-black"
                              style={{
                                width: "35%",
                                height: "3.5%",
                                borderRadius: "0 0 20px 20px",
                              }}
                            />
                          )}
                      </div>

                      {/* Side button (right) */}
                      <div
                        className="absolute -right-[0.8%] top-[18%] w-[0.8%] h-[8%] rounded-r-sm"
                        style={{ backgroundColor: selectedColor.frame }}
                      />

                      {/* Volume buttons (left) */}
                      <div
                        className="absolute -left-[0.8%] top-[15%] w-[0.8%] h-[4%] rounded-l-sm"
                        style={{ backgroundColor: selectedColor.frame }}
                      />
                      <div
                        className="absolute -left-[0.8%] top-[21%] w-[0.8%] h-[6%] rounded-l-sm"
                        style={{ backgroundColor: selectedColor.frame }}
                      />
                      <div
                        className="absolute -left-[0.8%] top-[28%] w-[0.8%] h-[6%] rounded-l-sm"
                        style={{ backgroundColor: selectedColor.frame }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Editor Panel */}
        <div className="h-48 border-t border-white/10 bg-[#141414] p-4 overflow-y-auto">
          <div className="grid grid-cols-4 gap-4 max-w-4xl">
            {/* Headline */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Headline
              </label>
              <textarea
                value={activeScreenshot.headline}
                onChange={(e) =>
                  updateActiveScreenshot({ headline: e.target.value })
                }
                className="w-full bg-[#2a2a2a] text-white text-sm rounded-md px-3 py-2 resize-none h-20 outline-none focus:ring-1 focus:ring-violet-500"
                placeholder="Enter headline..."
              />
            </div>

            {/* Subheadline */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Subheadline
              </label>
              <textarea
                value={activeScreenshot.subheadline}
                onChange={(e) =>
                  updateActiveScreenshot({ subheadline: e.target.value })
                }
                className="w-full bg-[#2a2a2a] text-white text-sm rounded-md px-3 py-2 resize-none h-20 outline-none focus:ring-1 focus:ring-violet-500"
                placeholder="Enter subheadline..."
              />
            </div>

            {/* Background */}
            <div>
              <label className="block text-xs text-gray-400 mb-1">
                Background
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      updateActiveScreenshot({ backgroundMode: "solid" })
                    }
                    className={`flex-1 text-xs py-1.5 rounded-md ${
                      activeScreenshot.backgroundMode === "solid"
                        ? "bg-violet-600 text-white"
                        : "bg-[#2a2a2a] text-gray-300"
                    }`}
                  >
                    Solid
                  </button>
                  <button
                    onClick={() =>
                      updateActiveScreenshot({ backgroundMode: "gradient" })
                    }
                    className={`flex-1 text-xs py-1.5 rounded-md ${
                      activeScreenshot.backgroundMode === "gradient"
                        ? "bg-violet-600 text-white"
                        : "bg-[#2a2a2a] text-gray-300"
                    }`}
                  >
                    Gradient
                  </button>
                </div>
                {activeScreenshot.backgroundMode === "solid" ? (
                  <input
                    type="color"
                    value={activeScreenshot.backgroundColor}
                    onChange={(e) =>
                      updateActiveScreenshot({
                        backgroundColor: e.target.value,
                      })
                    }
                    className="w-full h-8 rounded-md cursor-pointer"
                  />
                ) : (
                  <div className="grid grid-cols-3 gap-1">
                    {gradientPresets.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() =>
                          updateActiveScreenshot({
                            gradientPresetId: preset.id,
                          })
                        }
                        className={`h-6 rounded-md ${
                          activeScreenshot.gradientPresetId === preset.id
                            ? "ring-2 ring-white"
                            : ""
                        }`}
                        style={{
                          background: `linear-gradient(135deg, ${preset.from}, ${preset.to})`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Font & Screenshot */}
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Font Style
                </label>
                <select
                  value={activeScreenshot.fontFamily}
                  onChange={(e) =>
                    updateActiveScreenshot({ fontFamily: e.target.value })
                  }
                  className="w-full bg-[#2a2a2a] text-white text-sm rounded-md px-3 py-2 outline-none focus:ring-1 focus:ring-violet-500"
                >
                  {fontOptions.map((font) => (
                    <option key={font.id} value={font.id}>
                      {font.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Screenshot
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full bg-[#2a2a2a] hover:bg-[#333] text-gray-300 text-sm py-2 rounded-md transition-colors"
                >
                  {activeScreenshot.screenshotSrc
                    ? "Change Image"
                    : "Upload Image"}
                </button>
              </div>
            </div>

            {/* Text Color & Position Info */}
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Text Color
                </label>
                <input
                  type="color"
                  value={activeScreenshot.textColor}
                  onChange={(e) =>
                    updateActiveScreenshot({ textColor: e.target.value })
                  }
                  className="w-full h-8 rounded-md cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Headline Width: {activeScreenshot.headlineWidth}%
                </label>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={activeScreenshot.headlineWidth}
                  onChange={(e) =>
                    updateActiveScreenshot({
                      headlineWidth: Number(e.target.value),
                    })
                  }
                  className="w-full accent-violet-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Subheadline Width: {activeScreenshot.subheadlineWidth}%
                </label>
                <input
                  type="range"
                  min="30"
                  max="100"
                  value={activeScreenshot.subheadlineWidth}
                  onChange={(e) =>
                    updateActiveScreenshot({
                      subheadlineWidth: Number(e.target.value),
                    })
                  }
                  className="w-full accent-violet-500"
                />
              </div>
            </div>

            {/* Overlay Images */}
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-gray-400 mb-1">
                  Overlay Images
                </label>
                <input
                  ref={overlayImageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) addOverlayImage(file);
                    e.target.value = "";
                  }}
                  className="hidden"
                />
                <button
                  onClick={() => overlayImageInputRef.current?.click()}
                  className="w-full bg-[#2a2a2a] hover:bg-[#333] text-gray-300 text-sm py-2 rounded-md transition-colors"
                >
                  + Add Image
                </button>
              </div>
              {activeScreenshot.overlayImages.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-gray-500">
                    {activeScreenshot.overlayImages.length} image(s) added
                  </p>
                  {selectedElement?.type === "image" &&
                    selectedElement.imageId && (
                      <>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Image Size:{" "}
                            {Math.round(
                              activeScreenshot.overlayImages.find(
                                (img) => img.id === selectedElement.imageId,
                              )?.width || 0,
                            )}
                            %
                          </label>
                          <input
                            type="range"
                            min="5"
                            max="80"
                            value={
                              activeScreenshot.overlayImages.find(
                                (img) => img.id === selectedElement.imageId,
                              )?.width || 20
                            }
                            onChange={(e) =>
                              updateOverlayImageSize(
                                selectedElement.imageId!,
                                Number(e.target.value),
                              )
                            }
                            className="w-full accent-violet-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-gray-400 mb-1">
                            Layer Order
                          </label>
                          <div className="grid grid-cols-2 gap-1">
                            <button
                              onClick={() =>
                                bringImageToFront(selectedElement.imageId!)
                              }
                              className="bg-[#2a2a2a] hover:bg-[#333] text-gray-300 text-xs py-1.5 rounded transition-colors"
                            >
                              To Front
                            </button>
                            <button
                              onClick={() =>
                                sendImageToBack(selectedElement.imageId!)
                              }
                              className="bg-[#2a2a2a] hover:bg-[#333] text-gray-300 text-xs py-1.5 rounded transition-colors"
                            >
                              To Back
                            </button>
                            <button
                              onClick={() =>
                                bringImageForward(selectedElement.imageId!)
                              }
                              className="bg-[#2a2a2a] hover:bg-[#333] text-gray-300 text-xs py-1.5 rounded transition-colors"
                            >
                              Forward
                            </button>
                            <button
                              onClick={() =>
                                sendImageBackward(selectedElement.imageId!)
                              }
                              className="bg-[#2a2a2a] hover:bg-[#333] text-gray-300 text-xs py-1.5 rounded transition-colors"
                            >
                              Backward
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
