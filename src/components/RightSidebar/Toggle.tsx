/**
 * Toggle Component
 *
 * Toggle switch for boolean settings.
 */

import { STYLES } from "./constants";
import type { ToggleProps } from "./types";

/**
 * Toggle - On/off switch with label
 *
 * @param props - Component props
 *
 * @example
 * <Toggle
 *   label="Device Shadow"
 *   enabled={shadowEnabled}
 *   onChange={(enabled) => setShadowEnabled(enabled)}
 * />
 */
export const Toggle = ({ label, enabled, onChange }: ToggleProps) => (
  <div className="flex items-center justify-between">
    <span className={STYLES.label}>{label}</span>
    <button
      onClick={() => onChange(!enabled)}
      className={`${STYLES.toggle} ${enabled ? STYLES.toggleActive : STYLES.toggleInactive}`}
    >
      <div
        className={`${STYLES.toggleKnob} ${enabled ? STYLES.toggleKnobActive : STYLES.toggleKnobInactive}`}
      />
    </button>
  </div>
);
