import "server-only";

import { Timestamp } from "firebase-admin/firestore";

import {
  uploadImage,
  type UploadedImage,
} from "@/lib/cloudinary/uploadImage";

import ProjectRepository from "@/features/projects/repositories/project.repository";
import CategoryRepository from "@/features/categories/repositories/category.repository";
import UserRepository from "@/features/users/repositories/user.repository";
import ViewRepository from "@/features/views/repositories/view.repository";
import EngagementRepository from "@/features/engagements/repositories/engagement.repository";

import type {
  Project,
  ProjectServerInput,
  ProjectUpdateInput,
  ProjectPersistenceUpdate,
} from "@/features/interfaces/project";

import { enrichProject } from "./projectMapper";

type SupportedLocale = "en" | "fr";

export default class ProjectService {
  constructor(
    private projectRepository: ProjectRepository,
    private categoryRepository: CategoryRepository,
    private userRepository: UserRepository,
    private viewRepository: ViewRepository,
    private engagementRepository: EngagementRepository,
  ) {}

  private async uploadCoverImage(
      uid: string,
      file: File,
      projectId: string,
    ): Promise<UploadedImage> {
      if (!uid) {
        throw new Error(
          "User id is required",
        );
      }
  
      if (!file) {
        throw new Error(
          "File is required",
        );
      }
  
      if (!projectId) {
        throw new Error(
          "Article id is required",
        );
      }
  
      return uploadImage(file, {
        folder: `projects/${uid}`,
        publicId: `cover-${projectId}`,
      });
    }

  /*
   * -------------------------------------------
   * Verification
   * -------------------------------------------
   */

  private async verifyProjectOwnership(
    uid: string,
    projectId: string,
  ): Promise<Project> {
    const project =
      await this.projectRepository.findById(
        projectId,
      );

    if (!project) {
      throw new Error(
        "Project not found",
      );
    }

    if (project.uid !== uid) {
      throw new Error(
        "Unauthorized",
      );
    }

    return project;
  }

  private async verifyCategory(
    categoryId: string,
  ): Promise<void> {
    const category =
      await this.categoryRepository.findById(
        categoryId,
      );

    if (!category) {
      throw new Error(
        "Category not found",
      );
    }
  }

  /*
   * -------------------------------------------
   * Mapping
   * -------------------------------------------
   */

  private async mapProject(
    project: Project,
    includeAnalyticsData = false,
  ): Promise<Project> {
    const [
      author,
      category,
      views,
      engagements,
    ] = await Promise.all([
      project.uid
        ? this.userRepository.findById(
            project.uid,
          )
        : null,

      project.categoryId
        ? this.categoryRepository.findById(
            project.categoryId,
          )
        : null,

      project.id &&
      includeAnalyticsData
        ? this.viewRepository.findByContent(
            project.id,
          )
        : [],

      project.id &&
      includeAnalyticsData
        ? this.engagementRepository.findByContent(
            project.id,
          )
        : [],
    ]);

    return {
      ...project,

      author,
      category,

      ...(includeAnalyticsData && {
        views: views ?? [],
        engagements:
          engagements ?? [],
      }),
    };
  }

  /*
   * -------------------------------------------
   * Queries
   * -------------------------------------------
   */

  async getProjects(): Promise<Project[]> {
    const projects = await this.projectRepository.findAll();

    const activeProjects = projects.filter(
        (project) =>
          project.active !== false,
      );

    return Promise.all(
      activeProjects.map(
        (project) =>
          this.mapProject(
            project,
            true,
          ),
      ),
    );
  }

  async getPublishedProjects(): Promise<Project[]> {
    const projects = await this.projectRepository.findPublished();

    return Promise.all(
      projects.map(
        (project) =>
          this.mapProject(project),
      ),
    );
  }

  async getProjectById(
    uid: string,
    id: string,
  ): Promise<Project | null> {
    if (!uid || !id) {
      throw new Error(
        "User id and project id are required",
      );
    }

    const project = await this.verifyProjectOwnership(
        uid,
        id,
      );

    return this.mapProject(
      project,
      true,
    );
  }

  async getProjectsByAuthor(uid: string): Promise<Project[]> {
    if(!uid) {
      throw new Error(
        "User id is required",
      );
    }
    const projects = await this.projectRepository.findByUser(uid);
   
    const enrich = await Promise.all(
      projects.map((project) =>
      this.mapProject(project),)
    );

    return enrich.map(enrichProject);
  }

  async getProjectBySlug(
    slug: string,
    locale: SupportedLocale,
    uid: string | null
  ): Promise<Project | null> {
    if (!slug) {
      throw new Error(
        "Project slug is required",
      );
    }

    const project = await this.projectRepository.findBySlug(
        slug,
        locale
      );


    if(!project) {
      return null;
    }

    if(uid) {
      return this.mapProject(project);
    }

    if (
      project.active === false ||
      project.status !== "published"
    ) {
      return null;
    }

    return this.mapProject(project);
  }

  async getProjectByCategory(
    categoryId: string,
  ): Promise<Project[]> {
    if (!categoryId) {
      throw new Error(
        "Category id is required",
      );
    }
    const projects = await this.projectRepository.findByCategory(categoryId);
    const publishedProojects = 
      projects.filter(
        (project) =>
          project.active !== false &&
          project.status === "published",
      )
    return Promise.all(
      publishedProojects.map(
        (project) =>
          this.mapProject(project),
      ),
    )
  }

  /*
   * -------------------------------------------
   * Create
   * -------------------------------------------
   */

  async createProject(
    uid: string,
    project: ProjectServerInput,
  ): Promise<Project> {
    if (!uid) {
      throw new Error(
        "User id is required",
      );
    }

    if (!project) {
      throw new Error(
        "Project data is required",
      );
    }

    await this.verifyCategory(
      project.categoryId,
    );

    const {
      title,
      slug,
      content,
      details,
      tech_stack,
      categoryId,
      live_url,
      github_url,
      // cover_image,
      coverImage
    } = project;

    if (
      !title.en.trim() ||
      !title.fr.trim()
    ) {
      throw new Error(
        "English and French titles are required",
      );
    }

    if (
      !slug.en ||
      !slug.fr
    ) {
      throw new Error(
        "Project slugs are required",
      );
    }

    /*
     * Slug uniqueness should be checked
     * for both localized slugs.
     */
    const [
      existingEnglish,
      existingFrench,
    ] = await Promise.all([
      this.projectRepository.findBySlug(
        slug.en,
        "en",
      ),

      this.projectRepository.findBySlug(
        slug.fr,
        "fr",
      ),
    ]);

    if (
      existingEnglish ||
      existingFrench
    ) {
      throw new Error(
        "Project with this slug already exists",
      );
    }

    const projectId = this.projectRepository.generateId();
    let coverImageUrl: string | null = null;

    let coverImagePublicId:
      | string
      | null = null;
    
    if (coverImage) {
      const uploaded = await this.uploadCoverImage(
          uid,
          coverImage,
          projectId,
        );

      coverImageUrl = uploaded.url;

      coverImagePublicId = uploaded.publicId;
    }

    const now = Timestamp.now();

    const payload: Omit<Project, "id"> = {
      uid,

      title,
      slug,

      content: {
        en: content?.en ?? "",
        fr: content?.fr ?? "",
      },

      details: {
        en: details?.en ?? "",
        fr: details?.fr ?? "",
      },

      tech_stack: tech_stack ?? [],

      categoryId,

      live_url: live_url ?? null,

      github_url: github_url ?? null,

      status: "draft",

      active: true,

      cover_image: coverImageUrl,

      cover_image_public_id: coverImagePublicId,

      date: now,

      createdAt: now,
    };

    return this.projectRepository.create(
      payload,
      projectId,
    );
  }

  /*
   * -------------------------------------------
   * Update
   * -------------------------------------------
   */

  async updateProject(
    uid: string,
    id: string,
    data: ProjectUpdateInput,
  ): Promise<boolean> {
    if (!uid || !id) {
      throw new Error(
        "User id and project id are required",
      );
    }

    if (
      !data ||
      Object.keys(data).length === 0
    ) {
      throw new Error(
        "No update data provided",
      );
    }

    if ( !data.title || data.title === undefined ) {
      throw new Error(
        "English and French titles are required",
      );
    }

    if(!data.categoryId || data.categoryId === undefined) {
      throw new Error(
        "Article category is required",
      );
    }

    await this.verifyCategory(data.categoryId);

    const project = await this.verifyProjectOwnership(
        uid,
        id,
      );

    if (project.active === false) {
      throw new Error(
        "Cannot update a deleted project",
      );
    }

    const payload: ProjectPersistenceUpdate = {};
    
        
    payload.title = data.title;

    if (data.slug !== undefined) {
      payload.slug = data.slug;
    }

    if (data.categoryId !== undefined) {
      payload.categoryId = data.categoryId;
    }

    if (data.content !== undefined) {
      payload.content = data.content;
    }

    if (data.details !== undefined) {
      payload.details = data.details;
    }

    if (data.tech_stack !== undefined) {
      payload.tech_stack = data.tech_stack;
    }

    if (data.live_url !== undefined) {
      payload.live_url = data.live_url;
    }

    if (data.github_url !== undefined) {
      payload.github_url = data.github_url;
    }

    if (
      data.publishedAt !== undefined
    ) {
      payload.publishedAt = data.publishedAt;
    }

    /*
    * User selected a new cover image.
    */
    if (data.coverImage) {
      const uploaded = await this.uploadCoverImage(
          uid,
          data.coverImage,
          id,
        );

      payload.cover_image =
        uploaded.url;

      payload.cover_image_public_id =
        uploaded.publicId;
    }

    /*
    * User explicitly removed the
    * current cover image.
    */
    if (data.removeCoverImage) {
      payload.cover_image = null;

      payload.cover_image_public_id =
        null;
    }

    if (
      Object.keys(payload).length === 0
    ) {
      throw new Error(
        "No valid update data provided",
      );
    }

    return this.projectRepository.update(
      id,
      {
        ...payload,
        updatedAt: Timestamp.now(),
      },
    );
  }

  /*
   * -------------------------------------------
   * Publish
   * -------------------------------------------
   */

  async publishProject(
    uid: string,
    id: string,
  ): Promise<boolean> {
    const project = await this.verifyProjectOwnership(
        uid,
        id,
      );

    if (project.active === false) {
      throw new Error(
        "Cannot publish a deleted project",
      );
    }

    if (
      project.status === "published"
    ) {
      throw new Error(
        "Project is already published",
      );
    }

    if (
      !project.title?.en?.trim() ||
      !project.title?.fr?.trim()
    ) {
      throw new Error(
        "English and French titles are required before publishing",
      );
    }

    if (
      !project.categoryId
    ) {
      throw new Error(
        "Category is required before publishing",
      );
    }

    if (
      !project.slug?.en ||
      !project.slug?.fr
    ) {
      throw new Error(
        "Project slugs are required before publishing",
      );
    }
    
    if (
      !project.content?.en ||
      !project.content?.fr ||
      !project.details?.en ||
      !project.details?.fr ||
      !project.tech_stack ||
      !project.live_url ||
      !project.github_url  
    ) {
      throw new Error(
        "Project is incomplete and cannot be published",
      );
    }
    return this.projectRepository.update(
      id,
      {
        status: "published",
        active: true,

        publishedAt: Timestamp.now(),

        updatedAt: Timestamp.now(),
      },
    );
  }

  /*
   * -------------------------------------------
   * Delete
   * -------------------------------------------
   */

  async deleteProject(
    uid: string,
    id: string,
  ): Promise<boolean> {
    const project =
      await this.verifyProjectOwnership(
        uid,
        id,
      );

    if (project.active === false) {
      throw new Error(
        "Project is already deleted",
      );
    }

    return this.projectRepository.update(
      id,
      {
        active: false,
        deletedAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      },
    );
  }

  /*
   * -------------------------------------------
   * Restore
   * -------------------------------------------
   */

  async restoreProject(
    uid: string,
    id: string,
  ): Promise<boolean> {
    const project =
      await this.verifyProjectOwnership(
        uid,
        id,
      );

    if (project.active !== false) {
      throw new Error(
        "Project is already active",
      );
    }

    return this.projectRepository.update(
      id,
      {
        active: true,
        deletedAt: null,
        updatedAt: Timestamp.now(),
      },
    );
  }

  /*
   * -------------------------------------------
   * Delete all
   * -------------------------------------------
   */

  async deleteAllProjectsForUser(
    uid: string,
  ): Promise<boolean> {
    if (!uid) {
      throw new Error(
        "User id is required",
      );
    }

    return this.projectRepository.reset(
      uid,
    );
  }
}