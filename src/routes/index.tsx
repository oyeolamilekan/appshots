import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { loadGoogleFonts } from "../lib/google-fonts";
import { EditorProvider } from "../context/EditorContext";
import { EditorLayout } from "../components/EditorLayout";

const RouteComponent = () => {
  useEffect(() => {
    loadGoogleFonts();
  }, []);

  return (
    <EditorProvider>
      <EditorLayout />
    </EditorProvider>
  );
};

export const Route = createFileRoute("/")({
  component: RouteComponent,
});
