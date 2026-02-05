/**
 * RichTextEditor Utility Functions
 *
 * Helper functions for text formatting and state management.
 */

import type { ActiveStyles } from "./types";

/**
 * Checks if the editor content is empty.
 *
 * @param html - HTML content to check
 * @returns True if content is empty or only contains a line break
 *
 * @example
 * isContentEmpty("") // true
 * isContentEmpty("<br>") // true
 * isContentEmpty("Hello") // false
 */
export const isContentEmpty = (html: string | undefined): boolean => {
  if (!html) return true;
  return html === "<br>" || html.trim() === "";
};

/**
 * Gets the current active styles from document commands.
 *
 * @returns ActiveStyles object with current formatting state
 *
 * @example
 * const styles = getActiveStyles();
 * if (styles.bold) console.log("Text is bold");
 */
export const getActiveStyles = (): ActiveStyles => ({
  bold: document.queryCommandState("bold"),
  italic: document.queryCommandState("italic"),
  underline: document.queryCommandState("underline"),
  alignLeft: document.queryCommandState("justifyLeft"),
  alignCenter: document.queryCommandState("justifyCenter"),
  alignRight: document.queryCommandState("justifyRight"),
});

/**
 * Executes a document formatting command.
 *
 * @param command - The execCommand command name
 * @param value - Optional value for the command
 *
 * @example
 * executeCommand("bold") // Toggle bold
 * executeCommand("foreColor", "#ff0000") // Set text color
 */
export const executeCommand = (command: string, value?: string): void => {
  document.execCommand(command, false, value);
};
