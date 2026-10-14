import { z } from "zod";

export const AnimPresetSchema = z.enum([
  "fadeUp",
  "pop",
  "slideLeft",
  "slideRight",
  "typewriter",
  "zoom",
  "blurIn",
  "none",
]);

export const AnimSchema = z.object({
  preset: AnimPresetSchema.default("none"),
  delay: z.number().default(0),
  duration: z.number().default(30),
  easing: z.string().default("easeOut"),
});

export const KeyframePropertySchema = z.enum(["x", "y", "scale", "rotation", "opacity"]);

export const KeyframeSchema = z.object({
  frame: z.number().default(0),
  property: KeyframePropertySchema,
  value: z.number(),
  easing: z.string().default("linear"),
});

export type AnimPreset = z.infer<typeof AnimPresetSchema>;
export type Anim = z.infer<typeof AnimSchema>;
export type KeyframeProperty = z.infer<typeof KeyframePropertySchema>;
export type Keyframe = z.infer<typeof KeyframeSchema>;
