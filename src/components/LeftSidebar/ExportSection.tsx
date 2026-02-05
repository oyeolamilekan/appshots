/**
 * ExportSection Component
 *
 * Export size selection and export button section.
 */

import type { ExportSize } from "../../types";
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
  /** Handler for export action */
  onExport: () => void;
}

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
 *   onExport={handleExport}
 * />
 */
export const ExportSection = ({
  exportSizes,
  selectedSizeId,
  screenshotCount,
  onSizeSelect,
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
    </div>

    {/* Export button */}
    <button onClick={onExport} className={STYLES.primaryButton}>
      Export All ({screenshotCount})
    </button>
  </SidebarSection>
);
