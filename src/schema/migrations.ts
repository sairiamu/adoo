import { Project } from "./project";

export const CURRENT_SCHEMA_VERSION = 1;

export type MigrationFn = (project: any) => any;

/**
 * Migration pipeline.
 * Key is the target version (e.g., migrating from version 1 to 2 uses key 2).
 * Ready with an empty pipeline.
 */
export const migrations: Record<number, MigrationFn> = {
  // Example future migration:
  // 2: (project) => ({ ...project, version: 2 })
};

export function migrateProject(data: unknown): Project {
  let project = data as any;
  if (!project || typeof project !== "object") {
    throw new Error("Invalid project data for migration");
  }

  let version = typeof project.version === "number" ? project.version : 1;

  while (version < CURRENT_SCHEMA_VERSION) {
    const nextVersion = version + 1;
    const migration = migrations[nextVersion];
    if (migration) {
      project = migration(project);
    } else {
      project.version = nextVersion;
    }
    version = nextVersion;
  }

  return project as Project;
}
