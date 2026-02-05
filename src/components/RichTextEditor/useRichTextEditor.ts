/**
 * useRichTextEditor Hook
 *
 * Custom hook managing rich text editor state and formatting.
 */

import { useRef, useEffect, useState, useCallback } from "react";
import type { ActiveStyles } from "./types";
import { DEFAULT_ACTIVE_STYLES, DEFAULT_TEXT_COLOR } from "./constants";
import { isContentEmpty, getActiveStyles, executeCommand } from "./utils";

interface UseRichTextEditorOptions {
  /** Initial/controlled HTML value */
  value: string;
  /** Callback when content changes */
  onChange: (html: string) => void;
}

interface UseRichTextEditorReturn {
  /** Ref for the contenteditable div */
  editorRef: React.RefObject<HTMLDivElement | null>;
  /** Current text color */
  textColor: string;
  /** Whether the editor is empty */
  isEmpty: boolean;
  /** Current active formatting styles */
  activeStyles: ActiveStyles;
  /** Execute a formatting command */
  execCommand: (command: string, value?: string) => void;
  /** Handle input changes */
  handleInput: () => void;
  /** Handle color picker change */
  handleColorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Trigger change callback */
  triggerChange: () => void;
  /** Update active styles from selection */
  updateActiveStyles: () => void;
}

/**
 * useRichTextEditor - Manages rich text editor state
 *
 * Handles formatting commands, selection tracking, and content synchronization.
 *
 * @param options - Hook configuration
 * @param options.value - Controlled HTML value
 * @param options.onChange - Change callback
 * @returns Editor state and handlers
 *
 * @example
 * const {
 *   editorRef,
 *   activeStyles,
 *   execCommand,
 *   handleInput,
 * } = useRichTextEditor({ value, onChange });
 */
export const useRichTextEditor = ({
  value,
  onChange,
}: UseRichTextEditorOptions): UseRichTextEditorReturn => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [textColor, setTextColor] = useState(DEFAULT_TEXT_COLOR);
  const [isEmpty, setIsEmpty] = useState(true);
  const [activeStyles, setActiveStyles] = useState<ActiveStyles>(
    DEFAULT_ACTIVE_STYLES,
  );

  // Update active styles from current selection
  const updateActiveStyles = useCallback(() => {
    setActiveStyles(getActiveStyles());
  }, []);

  // Trigger onChange callback
  const triggerChange = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setIsEmpty(isContentEmpty(html));
      onChange(html);
    }
  }, [onChange]);

  // Execute formatting command
  const execCommand = useCallback(
    (command: string, commandValue?: string) => {
      editorRef.current?.focus();
      executeCommand(command, commandValue);
      updateActiveStyles();
      triggerChange();
    },
    [updateActiveStyles, triggerChange],
  );

  // Handle input changes
  const handleInput = useCallback(() => {
    triggerChange();
    updateActiveStyles();
  }, [triggerChange, updateActiveStyles]);

  // Handle color change
  const handleColorChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const color = e.target.value;
      setTextColor(color);
      execCommand("foreColor", color);
    },
    [execCommand],
  );

  // Sync external value changes
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
      setIsEmpty(isContentEmpty(value));
    }
  }, [value]);

  // Listen for selection changes
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection && editorRef.current?.contains(selection.anchorNode)) {
        updateActiveStyles();
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () =>
      document.removeEventListener("selectionchange", handleSelectionChange);
  }, [updateActiveStyles]);

  return {
    editorRef,
    textColor,
    isEmpty,
    activeStyles,
    execCommand,
    handleInput,
    handleColorChange,
    triggerChange,
    updateActiveStyles,
  };
};
