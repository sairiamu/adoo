import React from "react";
import { ThemeProvider, UIKit, JsonEditor, BrowserRouter, Routes, Route } from "./ui";
import { HomeScreen } from "./workspace/HomeScreen";
import { EditorShell } from "./editor/EditorShell";
import { ProjectSchema, Project } from "./schema";
import sampleJson from "../templates/sample.json";

export function App() {
  const sampleProject = ProjectSchema.parse(sampleJson) as Project;

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/editor/:projectId" element={<EditorShell />} />
          <Route
            path="/json"
            element={
              <JsonEditor
                currentProject={sampleProject}
                onProjectUpdate={() => {}}
                onSwitchToPreview={() => window.location.href = "/editor/sample-project"}
              />
            }
          />
          <Route path="/ui-kit" element={<UIKit onBackToEditor={() => window.location.href = "/"} />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
