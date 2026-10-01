/**
 * Position Presets
 *
 * Device layout presets shared by the editor sidebar and the MCP server.
 * Kept free of React/DOM imports so it can be consumed from Node.
 */

import type { DeviceInstance } from "../types";

export interface PositionPreset {
  /** Stable preset id used by the sidebar and the MCP spec */
  id: string;
  /** Human readable label */
  label: string;
  /** Device instance fields applied when the preset is selected */
  settings: Partial<DeviceInstance>;
}

export const positionPresets: PositionPreset[] = [
  {
    id: "centered",
    label: "Centered",
    settings: { scale: 65, y: 35, rotation: 0, style: "flat" },
  },
  {
    id: "bleed-bottom",
    label: "Bleed Bottom",
    settings: { scale: 70, y: 45, rotation: 0, style: "flat" },
  },
  {
    id: "bleed-top",
    label: "Bleed Top",
    settings: { scale: 70, y: 15, rotation: 0, style: "flat" },
  },
  {
    id: "float-center",
    label: "Float Center",
    settings: { scale: 55, y: 30, rotation: 0, style: "flat" },
  },
  {
    id: "tilt-left",
    label: "Tilt Left",
    settings: { scale: 60, y: 35, rotation: -15, style: "flat" },
  },
  {
    id: "tilt-right",
    label: "Tilt Right",
    settings: { scale: 60, y: 35, rotation: 15, style: "flat" },
  },
  {
    id: "perspective",
    label: "Perspective",
    settings: {
      scale: 60,
      y: 35,
      rotation: 0,
      style: "3d",
      rotateY: -20,
      rotateX: 5,
    },
  },
  {
    id: "float-bottom",
    label: "Float Bottom",
    settings: { scale: 50, y: 50, rotation: 0, style: "flat" },
  },
];

export const positionPresetIds = positionPresets.map((preset) => preset.id);

export const getPositionPreset = (id: string): PositionPreset | undefined =>
  positionPresets.find((preset) => preset.id === id);
