/**
 * useResizeObserver Hook
 *
 * Custom hook to observe element resize and update dimensions.
 */

import { useEffect, useCallback, type RefObject } from "react";

interface Dimensions {
  width: number;
  height: number;
}

interface UseResizeObserverOptions {
  /** Ref to the element to observe */
  elementRef: RefObject<HTMLElement | null>;
  /** Callback when dimensions change */
  onResize: (dimensions: Dimensions) => void;
  /** Dependencies that should trigger re-observation */
  deps?: unknown[];
}

/**
 * useResizeObserver - Observes element size changes
 *
 * Sets up a ResizeObserver on the referenced element and calls
 * the onResize callback whenever the element's size changes.
 *
 * @param options - Hook configuration
 * @param options.elementRef - Ref to observe
 * @param options.onResize - Callback with new dimensions
 * @param options.deps - Additional dependencies
 *
 * @example
 * useResizeObserver({
 *   elementRef: previewRef,
 *   onResize: setPreviewDimensions,
 *   deps: [activeScreenshotId],
 * });
 */
export const useResizeObserver = ({
  elementRef,
  onResize,
  deps = [],
}: UseResizeObserverOptions) => {
  const updateDimensions = useCallback(() => {
    if (elementRef.current) {
      const { clientWidth, clientHeight } = elementRef.current;
      onResize({ width: clientWidth, height: clientHeight });
    }
  }, [elementRef, onResize]);

  useEffect(() => {
    updateDimensions();

    const observer = new ResizeObserver(updateDimensions);
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateDimensions, elementRef, ...deps]);
};
