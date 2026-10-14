import React from "react";
import { ShapeElement as ShapeElementType, Brand } from "../../schema";
import { resolveBrandTokens } from "../utils";

interface ShapeElementProps {
  element: ShapeElementType;
  brand: Brand;
}

export const ShapeElement: React.FC<ShapeElementProps> = ({ element, brand }) => {
  const resolvedFill = resolveBrandTokens(element.fill, brand);

  const style: React.CSSProperties = {
    position: "absolute",
    left: element.x,
    top: element.y,
    width: element.width,
    height: element.height,
    transform: `rotate(${element.rotation}deg)`,
    opacity: element.opacity,
    backgroundColor: resolvedFill,
    borderRadius: element.shapeType === "ellipse" ? "50%" : `${element.radius}px`,
    boxSizing: "border-box",
  };

  if (element.stroke && element.stroke.width > 0) {
    style.border = `${element.stroke.width}px solid ${resolveBrandTokens(element.stroke.color, brand)}`;
  }

  return <div style={style} />;
};
