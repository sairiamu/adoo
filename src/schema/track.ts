import { z } from "zod";

export const TrackKindSchema = z.enum(["music", "voice", "sfx"]);

export const TrackSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  assetId: z.string().default(""),
  startFrame: z.number().default(0),
  trimStart: z.number().default(0),
  trimEnd: z.number().default(0),
  volume: z.number().default(1),
  fadeIn: z.number().default(0),
  fadeOut: z.number().default(0),
  kind: TrackKindSchema.default("music"),
});

export type TrackKind = z.infer<typeof TrackKindSchema>;
export type Track = z.infer<typeof TrackSchema>;
