import { z } from "zod";
import { SceneSchema } from "./scene";
import { TrackSchema } from "./track";

export const ProjectKindSchema = z.enum(["reel", "ad", "poster", "animation"]);

export const AssetRefSchema = z.object({
  assetId: z.string(),
});

export const BrandSchema = z.object({
  colors: z
    .record(z.string(), z.string())
    .default({
      primary: "#3b82f6",
      accent: "#f59e0b",
      bg: "#0f172a",
      text: "#f8fafc",
    }),
  fonts: z
    .object({
      heading: z.string().default("Inter"),
      body: z.string().default("Inter"),
    })
    .default({ heading: "Inter", body: "Inter" }),
  logo: AssetRefSchema.optional(),
}).default({
  colors: {
    primary: "#3b82f6",
    accent: "#f59e0b",
    bg: "#0f172a",
    text: "#f8fafc",
  },
  fonts: {
    heading: "Inter",
    body: "Inter",
  },
});

export const ProjectMetaSchema = z.object({
  name: z.string().default("Untitled Project"),
  kind: ProjectKindSchema.default("reel"),
  width: z.number().default(1080),
  height: z.number().default(1920),
  fps: z.number().default(30),
  createdAt: z.string().default(() => new Date().toISOString()),
  updatedAt: z.string().default(() => new Date().toISOString()),
}).default(() => ({
  name: "Untitled Project",
  kind: "reel" as ProjectKind,
  width: 1080,
  height: 1920,
  fps: 30,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}));

export const ProjectSchema = z.object({
  version: z.number().default(1),
  meta: ProjectMetaSchema,
  brand: BrandSchema,
  audio: z.array(TrackSchema).default([]),
  scenes: z.array(SceneSchema).default([]),
});

export type ProjectKind = z.infer<typeof ProjectKindSchema>;
export type AssetRef = z.infer<typeof AssetRefSchema>;
export type Brand = z.infer<typeof BrandSchema>;
export type ProjectMeta = z.infer<typeof ProjectMetaSchema>;
export type Project = z.infer<typeof ProjectSchema>;
