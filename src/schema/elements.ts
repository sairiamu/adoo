import { z } from "zod";
import { AnimSchema, KeyframeSchema } from "./animation";

const baseElementFields = {
  id: z.string().default(() => crypto.randomUUID()),
  name: z.string().default("Element"),
  x: z.number().default(0),
  y: z.number().default(0),
  width: z.number().default(100),
  height: z.number().default(100),
  rotation: z.number().default(0),
  opacity: z.number().default(1),
  locked: z.boolean().default(false),
  hidden: z.boolean().default(false),
  startFrame: z.number().default(0),
  durationInFrames: z.number().default(90),
  animations: z
    .object({
      in: AnimSchema.optional(),
      out: AnimSchema.optional(),
      loop: AnimSchema.optional(),
    })
    .default({}),
  keyframes: z.array(KeyframeSchema).default([]),
};

export const TextElementSchema = z.object({
  ...baseElementFields,
  type: z.literal("text"),
  content: z.string().default("Text"),
  font: z.string().default("{brand.fonts.body}"),
  size: z.number().default(48),
  weight: z.union([z.string(), z.number()]).default("normal"),
  color: z.string().default("{brand.colors.text}"),
  align: z.enum(["left", "center", "right", "justify"]).default("left"),
  lineHeight: z.number().default(1.2),
  letterSpacing: z.number().default(0),
  stroke: z
    .object({
      color: z.string().default("#000000"),
      width: z.number().default(0),
    })
    .optional(),
  shadow: z
    .object({
      color: z.string().default("rgba(0,0,0,0.5)"),
      blur: z.number().default(4),
      offsetX: z.number().default(0),
      offsetY: z.number().default(2),
    })
    .optional(),
  backgroundBox: z
    .object({
      color: z.string().default("#000000"),
      padding: z.number().default(8),
      radius: z.number().default(4),
    })
    .optional(),
});

export const ImageElementSchema = z.object({
  ...baseElementFields,
  type: z.literal("image"),
  assetId: z.string().default(""),
  fit: z.enum(["cover", "contain", "fill"]).default("cover"),
  crop: z
    .object({
      x: z.number().default(0),
      y: z.number().default(0),
      width: z.number().default(100),
      height: z.number().default(100),
    })
    .optional(),
  filters: z
    .object({
      brightness: z.number().default(1),
      contrast: z.number().default(1),
      blur: z.number().default(0),
      grayscale: z.number().default(0),
    })
    .default({ brightness: 1, contrast: 1, blur: 0, grayscale: 0 }),
  kenBurns: z
    .object({
      startScale: z.number().default(1),
      endScale: z.number().default(1.1),
      startPanX: z.number().default(0),
      startPanY: z.number().default(0),
      endPanX: z.number().default(0),
      endPanY: z.number().default(0),
    })
    .optional(),
});

export const VideoElementSchema = z.object({
  ...baseElementFields,
  type: z.literal("video"),
  assetId: z.string().default(""),
  fit: z.enum(["cover", "contain", "fill"]).default("cover"),
  trimStart: z.number().default(0),
  trimEnd: z.number().default(0),
  volume: z.number().default(1),
  playbackRate: z.number().default(1),
  filters: z
    .object({
      brightness: z.number().default(1),
      contrast: z.number().default(1),
      blur: z.number().default(0),
      grayscale: z.number().default(0),
    })
    .default({ brightness: 1, contrast: 1, blur: 0, grayscale: 0 }),
});

export const ShapeElementSchema = z.object({
  ...baseElementFields,
  type: z.literal("shape"),
  shapeType: z.enum(["rect", "ellipse", "line", "polygon"]).default("rect"),
  fill: z.string().default("{brand.colors.primary}"),
  stroke: z
    .object({
      color: z.string().default("#000000"),
      width: z.number().default(0),
    })
    .optional(),
  radius: z.number().default(0),
});

export const IconElementSchema = z.object({
  ...baseElementFields,
  type: z.literal("icon"),
  iconId: z.string().default("star"),
  color: z.string().default("{brand.colors.accent}"),
  size: z.number().default(48),
});

// Forward declaration for Group element children using z.lazy
export const ElementSchema: z.ZodType<any> = z.lazy(() =>
  z.discriminatedUnion("type", [
    TextElementSchema,
    ImageElementSchema,
    VideoElementSchema,
    ShapeElementSchema,
    IconElementSchema,
    GroupElementSchema,
  ])
);

export const GroupElementSchema = z.object({
  ...baseElementFields,
  type: z.literal("group"),
  children: z.array(ElementSchema).default([]),
});

export type TextElement = z.infer<typeof TextElementSchema>;
export type ImageElement = z.infer<typeof ImageElementSchema>;
export type VideoElement = z.infer<typeof VideoElementSchema>;
export type ShapeElement = z.infer<typeof ShapeElementSchema>;
export type IconElement = z.infer<typeof IconElementSchema>;
export type GroupElement = z.infer<typeof GroupElementSchema>;
export type Element = z.infer<typeof ElementSchema>;
