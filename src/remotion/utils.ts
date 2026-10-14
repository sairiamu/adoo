import { Brand } from "../schema";

export function resolveBrandTokens(input: any, brand: Brand): any {
  if (typeof input === "string") {
    return input.replace(/\{brand\.([a-zA-Z0-9.]+)\}/g, (match, path) => {
      const parts = path.split(".");
      let current: any = brand;
      for (const part of parts) {
        if (current && typeof current === "object" && part in current) {
          current = current[part];
        } else {
          return match;
        }
      }
      return typeof current === "string" ? current : match;
    });
  }
  if (Array.isArray(input)) {
    return input.map((item) => resolveBrandTokens(item, brand));
  }
  if (input !== null && typeof input === "object") {
    const result: any = {};
    for (const key of Object.keys(input)) {
      result[key] = resolveBrandTokens(input[key], brand);
    }
    return result;
  }
  return input;
}
