/**
 * FontPickerFooter Component
 *
 * Footer section with cancel button.
 */

import { STYLES } from "./constants";

interface FontPickerFooterProps {
  /** Handler for cancel button click */
  onCancel: () => void;
}

/**
 * FontPickerFooter - Modal footer with cancel button
 *
 * @param props - Component props
 * @param props.onCancel - Handler to cancel and close modal
 *
 * @example
 * <FontPickerFooter onCancel={() => setIsOpen(false)} />
 */
export const FontPickerFooter = ({ onCancel }: FontPickerFooterProps) => (
  <div className="p-4 border-t border-white/10 flex justify-end bg-[#1e1e1e] rounded-b-xl">
    <button onClick={onCancel} className={STYLES.cancelButton}>
      Cancel
    </button>
  </div>
);
