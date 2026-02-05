/**
 * SelectionHandles Component
 *
 * Corner handles displayed when an element is selected,
 * indicating it can be resized or manipulated.
 */

const HANDLE_POSITIONS = [
  { className: "-top-1.5 -left-1.5" },
  { className: "-top-1.5 -right-1.5" },
  { className: "-bottom-1.5 -left-1.5" },
  { className: "-bottom-1.5 -right-1.5" },
] as const;

/**
 * SelectionHandles - Corner resize handles for selected elements
 *
 * Renders four corner handles that appear when an image overlay is selected.
 * Visual indicator for drag/resize operations.
 *
 * @example
 * {isSelected && <SelectionHandles />}
 */
export const SelectionHandles = () => (
  <>
    {HANDLE_POSITIONS.map((pos, index) => (
      <div
        key={index}
        className={`absolute ${pos.className} w-3 h-3 bg-white border-2 border-neutral-400 rounded-full shadow-sm`}
      />
    ))}
  </>
);
