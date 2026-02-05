/**
 * ToolbarSeparator Component
 *
 * Visual separator between toolbar button groups.
 */

import { STYLES } from "./constants";

/**
 * ToolbarSeparator - Vertical divider for toolbar sections
 *
 * @example
 * <ToolbarButton ... />
 * <ToolbarSeparator />
 * <ToolbarButton ... />
 */
export const ToolbarSeparator = () => <div className={STYLES.separator} />;
