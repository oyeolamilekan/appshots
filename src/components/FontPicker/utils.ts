/**
 * FontPicker Utility Functions
 *
 * Helper functions for font filtering and styling.
 */

import type { FontConfig } from "../../lib/google-fonts";

/**
 * Type alias for Google Font (re-exported for convenience)
 */
export type GoogleFont = FontConfig;

/**
 * Filters fonts based on search query.
 *
 * @param fonts - Array of Google fonts to filter
 * @param query - Search query string
 * @returns Filtered array of fonts matching the query
 *
 * @example
 * const results = filterFonts(googleFonts, "rob");
 * // Returns fonts like "Roboto", "Roboto Mono", etc.
 */
export const filterFonts = (
  fonts: FontConfig[],
  query: string,
): FontConfig[] => {
  if (!query) return fonts;
  const normalizedQuery = query.toLowerCase();
  return fonts.filter((font) =>
    font.family.toLowerCase().includes(normalizedQuery),
  );
};

/**
 * Generates CSS font-family value for a font.
 *
 * @param family - Font family name
 * @param category - Font category (fallback)
 * @returns CSS font-family string
 *
 * @example
 * getFontFamily("Roboto", "sans-serif")
 * // Returns: '"Roboto", sans-serif'
 */
export const getFontFamily = (family: string, category: string): string =>
  `"${family}", ${category}`;
