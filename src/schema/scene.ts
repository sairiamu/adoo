import { z } from "zod";
import { ElementSchema } from "./elements";

export const FillSchema = z.object({
  type: z.enum(["solid", "gradient", "media"]).default("solid"),
  color: z.string().default("{brand.colors.bg}"),
  gradient: z
    .object({
      type: z.enum(["linear", "radial"]).default("linear"),
      colors: z.array(z.string()).default(["#0f172a", "#1e293b"]),
      angle: z.number().default(90),
    })
    .optional(),
  assetId: z.string().optional(),
});

export const TransitionOutSchema = z.object({
  type: z.enum(["none", "fade", "slide", "zoom", "wipe"]).default("none"),
  duration: z.number().default(15),
});

export const SceneSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  name: z.string().default("Scene 1"),
  durationInFrames: z.number().default(150),
  background: FillSchema.default({ type: "solid", color: "{brand.colors.bg}" }),
  elements: z.array(ElementSchema).default([]),
  transitionOut: TransitionOutSchema.default({ type: "none", duration: 15 }),
});

export type Fill = z.infer<typeof FillSchema>;
export type TransitionOut = z.infer<typeof TransitionOutSchema>;
export type Scene = z.infer<typeof SceneSchema>;
