import React, { useState, useEffect } from "react";
import { Player } from "@remotion/player";
import { ProjectComp } from "./remotion/ProjectComp";
import { ProjectSchema, Project } from "./schema";
import sampleJson from "../templates/sample.json";
import { ThemeProvider, useTheme, UIKit, Button } from "./ui";

function MainApp() {
  const { theme, toggleTheme } = useTheme();
  const [view, setView] = useState<"preview" | "uikit">(() => {
    return window.location.pathname === "/ui-kit" ? "uikit" : "preview";
  });

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname === "/ui-kit") {
        setView("uikit");
      } else {
        setView("preview");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateTo = (newView: "preview" | "uikit") => {
    setView(newView);
    const path = newView === "uikit" ? "/ui-kit" : "/";
    window.history.pushState({}, "", path);
  };

  const project = ProjectSchema.parse(sampleJson) as Project;
  const totalFrames = project.scenes.reduce(
    (acc, scene) => acc + scene.durationInFrames,
    0
  );

  if (view === "uikit") {
    return <UIKit onBackToEditor={() => navigateTo("preview")} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 font-sans relative" style={{ backgroundColor: "var(--clay-surface)", color: "var(--clay-text)" }}>
      {/* Top Navbar */}
      <div className="absolute top-6 right-6 flex gap-4 items-center">
        <Button variant="flat" onClick={() => navigateTo("uikit")}>
          Open UI Kit (/ui-kit)
        </Button>
        <Button onClick={toggleTheme}>
          Theme: {theme === "light" ? "Light" : "Dark"}
        </Button>
      </div>

      <header className="mb-6 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight">Adoo Video Engine Preview</h1>
        <p className="text-sm text-[var(--clay-muted)] mt-1">
          Live Remotion Player rendering{" "}
          <span className="font-bold text-[var(--clay-text)]">{project.meta.name}</span>
        </p>
      </header>

      <div className="shadow-2xl rounded-xl overflow-hidden border border-[var(--clay-300)] bg-black">
        <Player
          component={ProjectComp}
          inputProps={{ project }}
          durationInFrames={Math.max(totalFrames, 1)}
          fps={project.meta.fps}
          compositionWidth={project.meta.width}
          compositionHeight={project.meta.height}
          style={{
            width: "360px",
            height: "640px",
          }}
          controls
          autoPlay
          loop
        />
      </div>

      <footer className="mt-6 text-sm text-[var(--clay-muted)]">
        Project resolution: {project.meta.width}x{project.meta.height} @ {project.meta.fps}fps |{" "}
        {project.scenes.length} scenes loaded from <code className="text-[var(--clay-text)]">templates/sample.json</code>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}
