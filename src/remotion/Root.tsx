import { Composition, registerRoot } from "remotion";
import { ProjectComp } from "./ProjectComp";
import { ProjectSchema, Project } from "../schema";
import sampleJson from "../../templates/sample.json";

export const Root = () => {
  return (
    <>
      <Composition
        id="VideoProject"
        component={ProjectComp}
        durationInFrames={180}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          project: sampleJson as unknown as Project,
        }}
        calculateMetadata={async ({ props }) => {
          const project = ProjectSchema.parse(props.project);
          const totalFrames = project.scenes.reduce(
            (acc, scene) => acc + scene.durationInFrames,
            0
          );
          return {
            durationInFrames: Math.max(totalFrames, 1),
            fps: project.meta.fps,
            width: project.meta.width,
            height: project.meta.height,
            props: { project },
          };
        }}
      />
      <Composition
        id="StillProject"
        component={ProjectComp}
        durationInFrames={1}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{
          project: sampleJson as unknown as Project,
        }}
        calculateMetadata={async ({ props }) => {
          const project = ProjectSchema.parse(props.project);
          return {
            durationInFrames: 1,
            fps: project.meta.fps,
            width: project.meta.width,
            height: project.meta.height,
            props: { project },
          };
        }}
      />
    </>
  );
};

registerRoot(Root);
