import { z } from "zod";

export const AssetKindSchema = z.enum(["image", "video", "audio", "font"]);

export const AssetSchema = z.object({
  id: z.string().default(() => crypto.randomUUID()),
  kind: AssetKindSchema,
  name: z.string().default("Untitled Asset"),
  path: z.string().default(""),
  mime: z.string().default("application/octet-stream"),
  size: z.number().default(0),
  width: z.number().optional(),
  height: z.number().optional(),
  durationSec: z.number().optional(),
  thumbnail: z.string().optional(),
  proxy: z.string().optional(),
  waveform: z.array(z.number()).optional(),
});

export type AssetKind = z.infer<typeof AssetKindSchema>;
export type Asset = z.infer<typeof AssetSchema>;
