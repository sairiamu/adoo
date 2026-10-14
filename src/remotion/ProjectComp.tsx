import React from "react";
import { Project } from "../schema";
import { Sequence } from "remotion";
import { SceneRenderer } from "./SceneRenderer";
import sampleJson from "../../templates/sample.json";

interface ProjectCompProps {
  project?: Project;
}

export const ProjectComp: React.FC<ProjectCompProps> = ({
  project = sampleJson as unknown as Project,
}) => {
  let cumulativeFrames = 0;

  return (
    <div style={{ flex: 1, backgroundColor: "#000", position: "relative", width: "100%", height: "100%" }}>
      {project.scenes.map((scene) => {
        const fromFrame = cumulativeFrames;
        cumulativeFrames += scene.durationInFrames;

        return (
          <Sequence
            key={scene.id}
            from={fromFrame}
            durationInFrames={scene.durationInFrames}
          >
            <SceneRenderer scene={scene} brand={project.brand} />
          </Sequence>
        );
      })}
    </div>
  );
};
