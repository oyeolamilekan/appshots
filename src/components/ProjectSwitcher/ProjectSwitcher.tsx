/**
 * ProjectSwitcher Component
 *
 * Dropdown component for managing projects. Allows users to:
 * - View all projects
 * - Switch between projects
 * - Create new projects
 * - Rename existing projects
 * - Delete projects
 */

import { useState, useRef, useEffect } from "react";
import {
  FolderOpen,
  Plus,
  ChevronDown,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";
import { useEditor } from "../../context/EditorContext";
import type { Project } from "../../types";

/**
 * ProjectItem - Individual project in the list
 */
interface ProjectItemProps {
  project: Project;
  isActive: boolean;
  onSelect: () => void;
  onRename: (name: string) => void;
  onDelete: () => void;
  canDelete: boolean;
}

const ProjectItem = ({
  project,
  isActive,
  onSelect,
  onRename,
  onDelete,
  canDelete,
}: ProjectItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(project.name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editName.trim()) {
      onRename(editName.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      setEditName(project.name);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 px-3 py-2">
        <input
          ref={inputRef}
          type="text"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          className="flex-1 px-2 py-1 text-sm bg-zinc-800 border border-zinc-600 rounded text-white focus:outline-none focus:border-violet-500"
        />
        <button
          onClick={handleSave}
          className="p-1 hover:bg-zinc-700 rounded text-green-400"
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setEditName(project.name);
            setIsEditing(false);
          }}
          className="p-1 hover:bg-zinc-700 rounded text-red-400"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`group flex items-center justify-between px-3 py-2 cursor-pointer transition-colors ${
        isActive
          ? "bg-violet-600/20 text-violet-400"
          : "hover:bg-zinc-800 text-zinc-300"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <FolderOpen className="w-4 h-4 flex-shrink-0" />
        <span className="truncate text-sm">{project.name}</span>
        <span className="text-xs text-zinc-500">
          ({project.screenshots.length})
        </span>
      </div>

      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          className="p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-white"
          title="Rename project"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        {canDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-1 hover:bg-zinc-700 rounded text-zinc-400 hover:text-red-400"
            title="Delete project"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};

/**
 * ProjectSwitcher - Main dropdown component
 */
export const ProjectSwitcher = () => {
  const {
    projects,
    activeProjectId,
    activeProject,
    createProject,
    renameProject,
    deleteProject,
    switchProject,
  } = useEditor();

  const [isOpen, setIsOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const newProjectInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setIsCreating(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus new project input when creating
  useEffect(() => {
    if (isCreating && newProjectInputRef.current) {
      newProjectInputRef.current.focus();
    }
  }, [isCreating]);

  const handleCreateProject = () => {
    if (newProjectName.trim()) {
      createProject(newProjectName.trim());
      setNewProjectName("");
      setIsCreating(false);
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCreateProject();
    } else if (e.key === "Escape") {
      setIsCreating(false);
      setNewProjectName("");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-white text-sm transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          <FolderOpen className="w-4 h-4 text-violet-400 flex-shrink-0" />
          <span className="truncate">{activeProject.name}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-zinc-400 flex-shrink-0 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-zinc-900 border border-zinc-700 rounded-lg shadow-xl z-50 overflow-hidden">
          {/* Header */}
          <div className="px-3 py-2 border-b border-zinc-800">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
              Projects
            </span>
          </div>

          {/* Project list */}
          <div className="max-h-64 overflow-y-auto">
            {projects.map((project) => (
              <ProjectItem
                key={project.id}
                project={project}
                isActive={project.id === activeProjectId}
                onSelect={() => {
                  switchProject(project.id);
                  setIsOpen(false);
                }}
                onRename={(name) => renameProject(project.id, name)}
                onDelete={() => deleteProject(project.id)}
                canDelete={projects.length > 1}
              />
            ))}
          </div>

          {/* Create new project */}
          <div className="border-t border-zinc-800">
            {isCreating ? (
              <div className="p-2 flex items-center gap-2">
                <input
                  ref={newProjectInputRef}
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Project name"
                  className="flex-1 px-2 py-1.5 text-sm bg-zinc-800 border border-zinc-600 rounded text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500"
                />
                <button
                  onClick={handleCreateProject}
                  disabled={!newProjectName.trim()}
                  className="p-1.5 bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-700 disabled:text-zinc-500 rounded text-white transition-colors"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setIsCreating(false);
                    setNewProjectName("");
                  }}
                  className="p-1.5 hover:bg-zinc-700 rounded text-zinc-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsCreating(true)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-violet-400 hover:bg-zinc-800 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New Project
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectSwitcher;
