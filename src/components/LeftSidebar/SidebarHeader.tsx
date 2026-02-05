/**
 * SidebarHeader Component
 *
 * Header section with app title and description.
 */

import { STYLES } from "./constants";

/**
 * SidebarHeader - App title and tagline
 *
 * Displays the application name and brief description
 * at the top of the sidebar.
 *
 * @example
 * <SidebarHeader />
 */
export const SidebarHeader = () => (
  <div className={STYLES.header}>
    <h1 className="text-lg font-semibold">App Store Editor</h1>
    <p className="text-xs text-gray-400 mt-1">Create beautiful screenshots</p>
  </div>
);
