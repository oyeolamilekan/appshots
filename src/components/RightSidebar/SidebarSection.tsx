/**
 * SidebarSection Component
 *
 * Reusable section container with title.
 */

import { STYLES } from "./constants";
import type { SidebarSectionProps } from "./types";

/**
 * SidebarSection - Titled section container
 *
 * @param props - Component props
 * @param props.title - Section heading
 * @param props.children - Section content
 *
 * @example
 * <SidebarSection title="Layout">
 *   <RangeSlider ... />
 * </SidebarSection>
 */
export const SidebarSection = ({ title, children }: SidebarSectionProps) => (
  <section className={STYLES.section}>
    <h2 className={STYLES.sectionTitle}>{title}</h2>
    {children}
  </section>
);
