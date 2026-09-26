"use server";

import { randomUUID } from "node:crypto";

import { revalidateTag, updateTag } from "next/cache";

import { projectService } from "@/lib/container/project.container";

import {
  requireAuthenticatedUser,
} from "@/features/auth/lib/requireAuthenticatedUser";

import type  {Project, Lang, ProjectInput, ProjectUpdateInput } from "@/features/interfaces/project";

import { generateSlug } from "@/lib/slusify";

type ProjectActionResponse = 
| {
      success: true;
      message: string;
      projectId?: string;
    }
  | {
      success: false;
      message: string;
  };

function invalidateSlugCaches(
  slug: Lang | null | undefined,
): void {
  if (slug?.en) {
    updateTag(
      `projects:slug:${slug.en}`,
    );
  }

  if (slug?.fr) {
    updateTag(
      `projects:slug:${slug.fr}`,
    );
  }
}

function invalidateProjectCaches(
  project: Partial<Project>,
): void {
  updateTag("project");
  updateTag("project:published");

  if (project.uid) {
    updateTag(
      `project:author:${project.uid}`,
    );
  }

  if (project.categoryId) {
    updateTag(
      `project:category:${project.categoryId}`,
    );
  }

  invalidateSlugCaches(
    project.slug,
  );
}

function createArticleSlugs(
  title: Lang,
): Lang {
  const temporaryId = randomUUID();

  const englishSlug = generateSlug(title.en);

  const frenchSlug = generateSlug(title.fr);

  return {
    en: englishSlug || `draft-${temporaryId}`,

    fr: frenchSlug || `draft-${temporaryId}`,
  };
}

/*
 * -------------------------------------------
 * Errors
 * -------------------------------------------
 */

function getProjectErrorMessage(
  error: unknown,
): string {
  if (!(error instanceof Error)) {
    return "Unable to process article.";
  }

  switch (error.message) {
    case "Unauthenticated":
    case "Invalid session":
      return "Your session has expired. Please sign in again.";

    case "Unauthorized":
      return "You are not authorized to modify this article.";

    case "Article not found":
      return "Article not found.";

    case "Category not found":
      return "The selected category does not exist.";

    case "User not found":
      return "The authenticated user could not be found.";

    case "Article with this slug already exists":
      return "An article with this title already exists.";

    case "Only JPG, PNG, and WEBP images are supported.":
      return error.message;

    case "Cover image must not exceed 5 MB.":
      return error.message;

    default:
      return error.message;
  }
}
export async function createProjectAction(
  data: ProjectInput
): Promise<ProjectActionResponse> {

  try {

    const { userId } = await requireAuthenticatedUser();
  
    const slug = createArticleSlugs(data.title)
  
    const project = await projectService.createProject(
      userId, {
        title: data.title,
        slug,
        categoryId: data.categoryId,
        content: {
          en: data.content?.en,
          fr: data.content?.fr,
        },
        coverImage: data.coverImage ?? null,
        details: {
          en: data.details?.en,
          fr: data.details?.fr,
        },
        tech_stack: data.tech_stack,
        live_url: data.live_url || null,
  
        github_url: data.github_url || null
      }      
    )

    invalidateProjectCaches(
      project,
    );

    if (!project.id) {
      throw new Error(
        "Created project has no id",
      );
    }
     return {
      success: true,
      message: "Draft saved successfully.",
      projectId: project.id,
    };

  } catch (error) {
    console.error(
      "createProjectAction failed:",
      error,
    );

    return {
      success: false,
      message:
        getProjectErrorMessage(
          error,
        ),
    };
  }
}

export async function updateProjectAction(
  id: string,
  data: ProjectUpdateInput
): Promise<ProjectActionResponse> {
  if (!id.trim()) {
    return {
      success: false,
      message:
        "Project ID is required.",
    };
  }

  try {
    const { userId } = await requireAuthenticatedUser();

    const oldProject = await projectService.getProjectById(userId, id);

     if (!oldProject) {
      return {
        success: false,
        message: "Project not found.",
      };
    }
     const title = data.title ?? oldProject.title;

    const slug = createArticleSlugs(title);

     const payload = {
      ...oldProject,
      ...data,
      slug,
    }

    await projectService.updateProject(
      userId,
      id,
      payload,
    );

    updateTag("projects");
        updateTag(
          "projects:published",
        );
        updateTag(
          `projects:author:${userId}`,
        );
    
        if ( oldProject.categoryId ) {
          updateTag(
            `projects:category:${oldProject.categoryId}`,
          );
        }
    
        if ( data.categoryId) {
          updateTag(
            `projects:category:${data.categoryId}`,
          );
        }
    
        invalidateSlugCaches( oldProject.slug );
    
        if (data.slug) {
          invalidateSlugCaches(
            data.slug,
          );
        }
    
        return {
          success: true,
          message:
            "Project updated successfully.",
          projectId:
            id,
        };
  } catch (error) {
    console.error(
      "updateProjectAction failed:",
      error,
    );

    return {
      success: false,
      message:
        getProjectErrorMessage(
          error,
        ),
    };
  }
}

export async function publishProjectAction(
  projectId: string,
): Promise<ProjectActionResponse> {
  try {
    if (!projectId) {
      return {
        success: false,
        message: "Project id is required.",
      };
    }

    const { userId } =
      await requireAuthenticatedUser();

    await projectService.publishProject(
      userId,
      projectId,
    );

    revalidateTag(
      "projects",
      "max",
    );

    revalidateTag(
      `projects:id:${projectId}`,
      "max",
    );

    return {
      success: true,
      message: "Project published successfully.",
    };
  } catch (error) {
    console.error(
      "publishProjectAction failed:",
      error,
    );

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to publish project.",
    };
  }
}

export async function deleteProjectAction(
  projectId: string,
): Promise<ProjectActionResponse> {
  try {
    if (!projectId) {
      return {
        success: false,
        message: "Project id is required.",
      };
    }

    const { userId } = await requireAuthenticatedUser();

    await projectService.deleteProject(
      userId,
      projectId,
    );

    revalidateTag(
      "projects",
      "max",
    );

    revalidateTag(
      `projects:id:${projectId}`,
      "max",
    );

    return {
      success: true,
      message: "Project deleted successfully.",
    };
  } catch (error) {
    console.error(
      "deleteProjectAction failed:",
      error,
    );

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete project.",
    };
  }
}

export async function restoreProjectAction(
  projectId: string,
): Promise<ProjectActionResponse> {
  try {
    if (!projectId) {
      return {
        success: false,
        message: "Project id is required.",
      };
    }

    const { userId } = await requireAuthenticatedUser();

    const project = await projectService.getProjectById(
      userId,
      projectId,
    );

    if (!project) {
      return {
        success: false,
        message: "Project not found.",
      };
    }

    await projectService.restoreProject(
      userId,
      projectId,
    );

    revalidateTag(
      "projects",
      "max",
    );

    revalidateTag(
      `projects:id:${projectId}`,
      "max",
    );

    return {
      success: true,
      message: "Project restored successfully.",
    };
  } catch (error) {
    console.error(
      "restoreProjectAction failed:",
      error,
    );

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to restore project.",
    };
  }
}