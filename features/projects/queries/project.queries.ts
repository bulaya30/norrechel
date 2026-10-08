import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { projectService } from "@/lib/container/project.container";
import { serializeFirestore } from "@/lib/serializers/serializeFirestore";

import type { Project } from "@/features/interfaces/project";

type SupportedLocale = "en" | "fr";

export async function getCachedProjects(): Promise<Project[]> {
  "use cache";

  cacheLife("hours");
  cacheTag("projects");

  const projects = await projectService.getProjects();

  return serializeFirestore(projects);
}

/*
 * -------------------------------------------
 * Published projects
 * -------------------------------------------
 */

export async function getCachedPublishedProjects(): Promise<Project[]> {
  "use cache";

  cacheLife("hours");
  cacheTag(
    "projects",
    "projects:published",
  );

  const projects =
    await projectService.getPublishedProjects();

  return serializeFirestore(projects);
}

/*
 * -------------------------------------------
 * Project by localized slug
 * -------------------------------------------
 */

export async function getCachedProjectBySlug(
  slug: string,
  locale: SupportedLocale,
  uid: string | null
): Promise<Project | null> {
  "use cache";

  cacheLife("hours");

  cacheTag(
    "projects",
    `projects:slug:${locale}:${slug}`,
  );

  const project = await projectService.getProjectBySlug(
    slug,
    locale,
    uid,
  );

  return serializeFirestore(project);
}

/*
 * -------------------------------------------
 * Projects by author
 * -------------------------------------------
 */

export async function getCachedProjectsByAuthor(
  uid: string,
): Promise<Project[]> {
  "use cache";

  cacheLife("hours");

  cacheTag(
    "projects",
    `projects:author:${uid}`,
  );

  const projects =
    await projectService.getProjectsByAuthor(uid);

  return serializeFirestore(projects);
}

/*
 * -------------------------------------------
 * Projects by category
 * -------------------------------------------
 */

export async function getCachedProjectsByCategory(
  categoryId: string,
): Promise<Project[]> {
  "use cache";

  cacheLife("hours");

  cacheTag(
    "projects",
    `projects:category:${categoryId}`,
  );

  const projects =
    await projectService.getProjectByCategory(
      categoryId,
    );

  return serializeFirestore(projects);
}

/*
 * -------------------------------------------
 * Project by ID
 * -------------------------------------------
 */

export async function getCachedProjectById(
  uid: string,
  id: string,
): Promise<Project | null> {
  "use cache";

  cacheLife("hours");

  cacheTag(
    "projects",
    `projects:id:${id}`,
  );

  const project =
    await projectService.getProjectById(
      uid,
      id,
    );

  return serializeFirestore(project);
}