import React from "react";
import { Scene, Brand, Element } from "../schema";
import { Sequence } from "remotion";
import { resolveBrandTokens } from "./utils";
import { TextElement } from "./elements/TextElement";
import { ShapeElement } from "./elements/ShapeElement";
import { ImageElement } from "./elements/ImageElement";
import { VideoElement } from "./elements/VideoElement";

interface SceneRendererProps {
  scene: Scene;
  brand: Brand;
}

export const SceneRenderer: React.FC<SceneRendererProps> = ({ scene, brand }) => {
  let backgroundStyle: React.CSSProperties = {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: resolveBrandTokens(scene.background.color, brand),
  };

  if (scene.background.type === "gradient" && scene.background.gradient) {
    const { type, colors, angle } = scene.background.gradient;
    const resolvedColors = colors.map((c) => resolveBrandTokens(c, brand));
    if (type === "linear") {
      backgroundStyle.background = `linear-gradient(${angle}deg, ${resolvedColors.join(", ")})`;
    } else {
      backgroundStyle.background = `radial-gradient(circle, ${resolvedColors.join(", ")})`;
    }
  }

  const renderElement = (element: Element) => {
    switch (element.type) {
      case "text":
        return <TextElement element={element} brand={brand} />;
      case "image":
        return <ImageElement element={element} brand={brand} />;
      case "video":
        return <VideoElement element={element} brand={brand} />;
      case "shape":
        return <ShapeElement element={element} brand={brand} />;
      case "icon":
        return (
          <div
            style={{
              position: "absolute",
              left: element.x,
              top: element.y,
              width: element.width,
              height: element.height,
              transform: `rotate(${element.rotation}deg)`,
              opacity: element.opacity,
              color: resolveBrandTokens(element.color, brand),
              fontSize: `${element.size}px`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ★
          </div>
        );
      case "group":
        return (
          <div
            style={{
              position: "absolute",
              left: element.x,
              top: element.y,
              width: element.width,
              height: element.height,
              transform: `rotate(${element.rotation}deg)`,
              opacity: element.opacity,
            }}
          >
            {element.children.map((child: Element) => (
              <React.Fragment key={child.id}>{renderElement(child)}</React.Fragment>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }}>
      <div style={backgroundStyle} />
      {scene.elements.map((element) => (
        <Sequence
          key={element.id}
          from={element.startFrame}
          durationInFrames={element.durationInFrames}
        >
          {renderElement(element)}
        </Sequence>
      ))}
    </div>
  );
};
