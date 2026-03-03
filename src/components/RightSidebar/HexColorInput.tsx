/**
 * HexColorInput Component
 *
 * Color picker with a swatch and editable hex text input.
 */

import { useState, useEffect, useRef } from "react";

interface HexColorInputProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
  /** Render as a small inline swatch + input (for shadow color, etc.) */
  compact?: boolean;
}

const isValidHex = (v: string) => /^#[0-9a-fA-F]{6}$/.test(v);

const normalizeHex = (v: string) => {
  let hex = v.startsWith("#") ? v : `#${v}`;
  // Expand shorthand (#abc → #aabbcc)
  if (/^#[0-9a-fA-F]{3}$/.test(hex)) {
    hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
  }
  return hex;
};

export const HexColorInput = ({
  value,
  onChange,
  className = "",
  compact = false,
}: HexColorInputProps) => {
  const [draft, setDraft] = useState(value);
  const [isFocused, setIsFocused] = useState(false);
  const colorRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isFocused) {
      setDraft(value);
    }
  }, [value, isFocused]);

  const commit = () => {
    const hex = normalizeHex(draft);
    if (isValidHex(hex)) {
      onChange(hex.toLowerCase());
    }
    setDraft(isValidHex(hex) ? hex.toLowerCase() : value);
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-1.5 ${className}`}>
        <button
          type="button"
          onClick={() => colorRef.current?.click()}
          className="w-6 h-6 rounded border border-white/10 shrink-0 cursor-pointer"
          style={{ backgroundColor: value }}
        />
        <input
          ref={colorRef}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="sr-only"
        />
        <input
          type="text"
          value={isFocused ? draft : value}
          onFocus={() => {
            setIsFocused(true);
            setDraft(value);
          }}
          onBlur={() => {
            setIsFocused(false);
            commit();
          }}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              commit();
              (e.target as HTMLInputElement).blur();
            }
          }}
          className="w-[4.5rem] bg-[#2a2a2a] text-white text-xs rounded px-1.5 py-1 border border-white/10 outline-none focus:border-white/30 font-mono"
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={() => colorRef.current?.click()}
        className="w-8 h-8 rounded-md border border-white/10 shrink-0 cursor-pointer"
        style={{ backgroundColor: value }}
      />
      <input
        ref={colorRef}
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="sr-only"
      />
      <input
        type="text"
        value={isFocused ? draft : value}
        onFocus={() => {
          setIsFocused(true);
          setDraft(value);
        }}
        onBlur={() => {
          setIsFocused(false);
          commit();
        }}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            commit();
            (e.target as HTMLInputElement).blur();
          }
        }}
        className="flex-1 bg-[#2a2a2a] text-white text-xs rounded-md px-2 py-1.5 border border-white/10 outline-none focus:border-white/30 font-mono"
      />
    </div>
  );
};
