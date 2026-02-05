/**
 * useLocalStorage Hook
 *
 * Custom hook for persisting editor state to localStorage.
 * Handles serialization, deserialization, and auto-save functionality.
 */

import { useEffect, useCallback, useRef } from "react";
import type { Project } from "../types";

/**
 * Editor state that gets persisted to localStorage
 */
export interface PersistedEditorState {
  /** Editor version for migration support */
  version: number;
  /** All projects */
  projects: Project[];
  /** Active project ID */
  activeProjectId: string;
  /** Timestamp of last save */
  lastSaved: number;
}

/** Current schema version for migration support */
const CURRENT_VERSION = 2;

/** localStorage key for editor state */
const STORAGE_KEY = "app-screenshot-editor-state";

/** Debounce delay for auto-save (ms) */
const AUTO_SAVE_DELAY = 1000;

/**
 * Loads persisted state from localStorage.
 *
 * @returns Persisted state or null if not found/invalid
 */
export const loadPersistedState = (): PersistedEditorState | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const parsed = JSON.parse(stored) as PersistedEditorState;

    // Version check - if old version, return null to reset
    if (parsed.version !== CURRENT_VERSION) {
      console.warn(
        `Editor state version mismatch: ${parsed.version} !== ${CURRENT_VERSION}. Resetting state.`,
      );
      return null;
    }

    // Basic validation
    if (!parsed.projects || !Array.isArray(parsed.projects)) {
      return null;
    }

    return parsed;
  } catch (error) {
    console.error("Failed to load editor state from localStorage:", error);
    return null;
  }
};

/**
 * Saves state to localStorage.
 *
 * @param state - State to persist
 */
export const savePersistedState = (state: PersistedEditorState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save editor state to localStorage:", error);
  }
};

/**
 * Clears persisted state from localStorage.
 */
export const clearPersistedState = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear editor state from localStorage:", error);
  }
};

interface UseEditorPersistenceOptions {
  /** All projects */
  projects: Project[];
  /** Active project ID */
  activeProjectId: string;
}

/**
 * useEditorPersistence - Auto-saves editor state to localStorage
 *
 * Debounces saves to avoid excessive writes during rapid changes.
 *
 * @param options - Current editor state values
 */
export const useEditorPersistence = ({
  projects,
  activeProjectId,
}: UseEditorPersistenceOptions): void => {
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isInitialMount = useRef(true);

  const saveState = useCallback(() => {
    const state: PersistedEditorState = {
      version: CURRENT_VERSION,
      projects,
      activeProjectId,
      lastSaved: Date.now(),
    };
    savePersistedState(state);
  }, [projects, activeProjectId]);

  // Debounced auto-save on state changes
  useEffect(() => {
    // Skip initial mount to avoid overwriting loaded state
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Schedule new save
    saveTimeoutRef.current = setTimeout(saveState, AUTO_SAVE_DELAY);

    // Cleanup on unmount
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [saveState]);

  // Save immediately on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveState();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [saveState]);
};
