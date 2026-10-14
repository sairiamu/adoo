import React from "react";
import { TextElement as TextElementType, Brand } from "../../schema";
import { resolveBrandTokens } from "../utils";

interface TextElementProps {
  element: TextElementType;
  brand: Brand;
}

export const TextElement: React.FC<TextElementProps> = ({ element, brand }) => {
  const resolvedColor = resolveBrandTokens(element.color, brand);
  const resolvedFont = resolveBrandTokens(element.font, brand);

  const style: React.CSSProperties = {
    position: "absolute",
    left: element.x,
    top: element.y,
    width: element.width,
    height: element.height,
    transform: `rotate(${element.rotation}deg)`,
    opacity: element.opacity,
    fontFamily: resolvedFont,
    fontSize: `${element.size}px`,
    fontWeight: element.weight as any,
    color: resolvedColor,
    textAlign: element.align,
    lineHeight: element.lineHeight,
    letterSpacing: `${element.letterSpacing}px`,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    boxSizing: "border-box",
  };

  return <div style={style}>{element.content}</div>;
};
