/**
 * ExportSection Component
 *
 * Export size selection and export button section.
 */

import { useEffect, useState } from "react";
import type { ExportSize } from "../../types";
import {
  CUSTOM_EXPORT_SIZE_ID,
  CUSTOM_EXPORT_SIZE_MAX,
  CUSTOM_EXPORT_SIZE_MIN,
} from "../../constants";
import { SidebarSection } from "./SidebarSection";
import { SelectionButton } from "./SelectionButton";
import { STYLES } from "./constants";

interface ExportSectionProps {
  /** Available export sizes */
  exportSizes: ExportSize[];
  /** Currently selected export size ID */
  selectedSizeId: string;
  /** Number of screenshots to export */
  screenshotCount: number;
  /** Handler for size selection */
  onSizeSelect: (sizeId: string) => void;
  /** Dimensions used for the custom size option */
  customSize: { width: number; height: number };
  /** Handler for custom size changes */
  onCustomSizeChange: (size: { width: number; height: number }) => void;
  /** Handler for export action */
  onExport: () => void;
}

const clampDimension = (value: number) =>
  Math.min(
    CUSTOM_EXPORT_SIZE_MAX,
    Math.max(CUSTOM_EXPORT_SIZE_MIN, Math.round(value)),
  );

interface DimensionInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
}

/**
 * DimensionInput - Pixel input that keeps a draft while typing
 * and commits a clamped value on blur or Enter.
 */
const DimensionInput = ({ label, value, onChange }: DimensionInputProps) => {
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const commit = () => {
    const parsed = Number(draft);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setDraft(String(value));
      return;
    }
    const next = clampDimension(parsed);
    setDraft(String(next));
    if (next !== value) onChange(next);
  };

  return (
    <label className="flex-1 space-y-1">
      <span className="block text-xs text-gray-400">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        min={CUSTOM_EXPORT_SIZE_MIN}
        max={CUSTOM_EXPORT_SIZE_MAX}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.currentTarget.blur();
        }}
        className={STYLES.sizeInput}
      />
    </label>
  );
};

/**
 * ExportSection - Export size and action section
 *
 * Displays export size options and the export button
 * with screenshot count.
 *
 * @param props - Component props
 *
 * @example
 * <ExportSection
 *   exportSizes={exportSizes}
 *   selectedSizeId={exportSizeId}
 *   screenshotCount={screenshots.length}
 *   onSizeSelect={setExportSizeId}
 *   customSize={customExportSize}
 *   onCustomSizeChange={setCustomExportSize}
 *   onExport={handleExport}
 * />
 */
export const ExportSection = ({
  exportSizes,
  selectedSizeId,
  screenshotCount,
  onSizeSelect,
  customSize,
  onCustomSizeChange,
  onExport,
}: ExportSectionProps) => (
  <SidebarSection title="Export">
    {/* Size options */}
    <div className={STYLES.buttonList}>
      {exportSizes.map((size) => (
        <SelectionButton
          key={size.id}
          label={size.label}
          isSelected={selectedSizeId === size.id}
          onClick={() => onSizeSelect(size.id)}
        />
      ))}
      <SelectionButton
        label={`Custom (${customSize.width} × ${customSize.height})`}
        isSelected={selectedSizeId === CUSTOM_EXPORT_SIZE_ID}
        onClick={() => onSizeSelect(CUSTOM_EXPORT_SIZE_ID)}
      />
    </div>

    {/* Custom size inputs */}
    {selectedSizeId === CUSTOM_EXPORT_SIZE_ID && (
      <div className="mt-3 flex items-end gap-2">
        <DimensionInput
          label="Width (px)"
          value={customSize.width}
          onChange={(width) => onCustomSizeChange({ ...customSize, width })}
        />
        <span className="pb-2 text-sm text-gray-500">×</span>
        <DimensionInput
          label="Height (px)"
          value={customSize.height}
          onChange={(height) => onCustomSizeChange({ ...customSize, height })}
        />
      </div>
    )}

    {/* Export button */}
    <button onClick={onExport} className={STYLES.primaryButton}>
      Export All ({screenshotCount})
    </button>
  </SidebarSection>
);
