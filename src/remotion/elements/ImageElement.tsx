import React from "react";
import { ImageElement as ImageElementType, Brand } from "../../schema";

interface ImageElementProps {
  element: ImageElementType;
  brand: Brand;
}

export const ImageElement: React.FC<ImageElementProps> = ({ element }) => {
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

  return (
    <img
      src={element.assetId ? element.assetId : "https://via.placeholder.com/400"}
      alt={element.name}
      style={style}
    />
  );
};
