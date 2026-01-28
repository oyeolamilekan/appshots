import { useRef, useEffect, useState, useCallback } from "react";
import {
  Bold,
  Italic,
  Underline,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Sparkles,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

interface ActiveStyles {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  alignLeft: boolean;
  alignCenter: boolean;
  alignRight: boolean;
}

export const RichTextEditor = ({
  value,
  onChange,
  placeholder = "Type something...",
  className = "",
}: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [textColor, setTextColor] = useState("#ffffff");
  const [isEmpty, setIsEmpty] = useState(true);
  const [activeStyles, setActiveStyles] = useState<ActiveStyles>({
    bold: false,
    italic: false,
    underline: false,
    alignLeft: true,
    alignCenter: false,
    alignRight: false,
  });

  // Sync external value changes
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
      setIsEmpty(!value || value === "<br>" || value.trim() === "");
    }
  }, [value]);

  // Check active styles based on current selection
  const updateActiveStyles = useCallback(() => {
    setActiveStyles({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      alignLeft: document.queryCommandState("justifyLeft"),
      alignCenter: document.queryCommandState("justifyCenter"),
      alignRight: document.queryCommandState("justifyRight"),
    });
  }, []);

  // Listen for selection changes
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection && editorRef.current?.contains(selection.anchorNode)) {
        updateActiveStyles();
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => document.removeEventListener("selectionchange", handleSelectionChange);
  }, [updateActiveStyles]);

  // Prevent toolbar clicks from stealing focus
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  // Execute formatting command
  const execCommand = (command: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    updateActiveStyles();
    triggerChange();
  };

  // Trigger onChange callback
  const triggerChange = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      setIsEmpty(!html || html === "<br>" || html.trim() === "");
      onChange(html);
    }
  };

  // Handle input changes
  const handleInput = () => {
    triggerChange();
    updateActiveStyles();
  };

  // Handle color change
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setTextColor(color);
    execCommand("foreColor", color);
  };

  // Toolbar button component
  const ToolbarButton = ({
    onClick,
    active,
    title,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    title: string;
    children: React.ReactNode;
  }) => (
    <button
      onMouseDown={handleMouseDown}
      onClick={onClick}
      title={title}
      className={`p-1.5 rounded transition-colors ${
        active
          ? "bg-blue-500/20 text-blue-400"
          : "text-gray-400 hover:text-white hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className={`rounded-lg border border-white/10 bg-[#2a2a2a] overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center gap-0.5 px-2 py-1.5 bg-[#1e1e1e] border-b border-white/10">
        {/* Text Formatting */}
        <ToolbarButton
          onClick={() => execCommand("bold")}
          active={activeStyles.bold}
          title="Bold (Ctrl+B)"
        >
          <Bold size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => execCommand("italic")}
          active={activeStyles.italic}
          title="Italic (Ctrl+I)"
        >
          <Italic size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => execCommand("underline")}
          active={activeStyles.underline}
          title="Underline (Ctrl+U)"
        >
          <Underline size={16} />
        </ToolbarButton>

        {/* Separator */}
        <div className="w-px h-4 bg-white/10 mx-1" />

        {/* Color Picker */}
        <div className="relative p-1.5 rounded transition-colors text-gray-400 hover:text-white hover:bg-white/10">
          <input
            type="color"
            value={textColor}
            onMouseDown={handleMouseDown}
            onChange={handleColorChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            title="Text Color"
          />
          <Palette size={16} />
          <div
            className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full"
            style={{ backgroundColor: textColor }}
          />
        </div>

        {/* Separator */}
        <div className="w-px h-4 bg-white/10 mx-1" />

        {/* Alignment */}
        <ToolbarButton
          onClick={() => execCommand("justifyLeft")}
          active={activeStyles.alignLeft}
          title="Align Left"
        >
          <AlignLeft size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => execCommand("justifyCenter")}
          active={activeStyles.alignCenter}
          title="Align Center"
        >
          <AlignCenter size={16} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => execCommand("justifyRight")}
          active={activeStyles.alignRight}
          title="Align Right"
        >
          <AlignRight size={16} />
        </ToolbarButton>

        {/* Separator */}
        <div className="w-px h-4 bg-white/10 mx-1" />

        {/* AI Sparkle (placeholder for future) */}
        <ToolbarButton onClick={() => {}} title="AI Assist (Coming Soon)">
          <Sparkles size={16} />
        </ToolbarButton>
      </div>

      {/* Editor */}
      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onBlur={triggerChange}
          className="min-h-[80px] px-3 py-2 text-sm text-white outline-none [&:empty]:before:content-[attr(data-placeholder)] [&:empty]:before:text-gray-500 [&:empty]:before:pointer-events-none"
          data-placeholder={placeholder}
          style={{ fontFamily: "Inter, system-ui, sans-serif" }}
        />
        {isEmpty && !editorRef.current?.innerHTML && (
          <div className="absolute top-2 left-3 text-sm text-gray-500 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
};
