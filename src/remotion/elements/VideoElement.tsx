import React from "react";
import { VideoElement as VideoElementType, Brand } from "../../schema";
import { OffthreadVideo } from "remotion";

interface VideoElementProps {
  element: VideoElementType;
  brand: Brand;
}

export const VideoElement: React.FC<VideoElementProps> = ({ element }) => {
  const style: React.CSSProperties = {
    position: "absolute",
    left: element.x,
    top: element.y,
    width: element.width,
    height: element.height,
    transform: `rotate(${element.rotation}deg)`,
    opacity: element.opacity,
    objectFit: element.fit,
    filter: `brightness(${element.filters.brightness}) contrast(${element.filters.contrast}) blur(${element.filters.blur}px) grayscale(${element.filters.grayscale})`,
  };

  if (!element.assetId) {
    return (
      <div style={{ ...style, backgroundColor: "#000", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        [Video Placeholder]
      </div>
    );
  }

  return (
    <OffthreadVideo
      src={element.assetId}
      startFrom={element.trimStart}
      endAt={element.trimEnd > 0 ? element.trimEnd : undefined}
      volume={element.volume}
      playbackRate={element.playbackRate}
      style={style}
    />
  );
};
