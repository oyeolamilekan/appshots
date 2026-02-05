/**
 * SidebarSection Component
 *
 * Reusable section container with title.
 */

import { STYLES } from "./constants";

interface SidebarSectionProps {
  /** Section title text */
  title: string;
  /** Section content */
  children: React.ReactNode;
}

/**
 * SidebarSection - Titled section container
 *
 * Wraps content in a styled section with uppercase title.
 *
 * @param props - Component props
 * @param props.title - Section heading text
 * @param props.children - Section content
 *
 * @example
 * <SidebarSection title="Device">
 *   <DeviceList ... />
 * </SidebarSection>
 */
export const SidebarSection = ({ title, children }: SidebarSectionProps) => (
  <section className={STYLES.section}>
    <h2 className={STYLES.sectionTitle}>{title}</h2>
    {children}
  </section>
);
