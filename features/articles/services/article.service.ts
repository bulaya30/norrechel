import "server-only";
import {
  uploadImage,
  type UploadedImage,
} from "@/lib/cloudinary/uploadImage";

import { Timestamp } from "firebase-admin/firestore";

import type {
  Article,
  ArticleUpdateInput,
  ArticlePersistenceUpdate,
  ArticleServerInput,
} from "@/features/interfaces/article";

import ArticleRepository from "@/features/articles/repositories/article.repository";
import CategoryRepository from "@/features/categories/repositories/category.repository";
import UserRepository from "@/features/users/repositories/user.repository";
import ViewRepository from "@/features/views/repositories/view.repository";
import EngagementRepository from "@/features/engagements/repositories/engagement.repository";

import { enrichArticle } from "./articleMapper";

type SupportedLocale = "en" | "fr";

export default class ArticleService {
  constructor(
    private articleRepository: ArticleRepository,
    private categoryRepository: CategoryRepository,
    private userRepository: UserRepository,
    private viewRepository: ViewRepository,
    private engagementRepository: EngagementRepository,
  ) {}

  private async verifyArticleOwnership(
    uid: string,
    articleId: string,
  ): Promise<Article> {
    if (!uid) {
      throw new Error(
        "User id is required",
      );
    }

    if (!articleId) {
      throw new Error(
        "Article id is required",
      );
    }

    const article = await this.articleRepository.findById( articleId );

    if (!article) {
      throw new Error(
        "Article not found",
      );
    }

    if (article.uid !== uid) {
      throw new Error(
        "Unauthorized",
      );
    }

    return article;
  }

  private async verifyCategory(
    categoryId: string,
  ): Promise<void> {
    /*
     * Drafts may temporarily have no category.
     */
    if (!categoryId) {
      return;
    }

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

  private async verifyUser(
    uid: string,
  ): Promise<void> {
    const user =
      await this.userRepository.findById(uid);

    if (!user) {
      throw new Error(
        "User not found",
      );
    }
  }

  private async mapArticle(
    article: Article,
    includeAnalyticsData = false,
  ): Promise<Article> {
    const [
      author,
      category,
      views,
      engagements,
    ] = await Promise.all([
      article.uid
        ? this.userRepository.findById(
            article.uid,
          )
        : null,

      article.categoryId
        ? this.categoryRepository.findById(
            article.categoryId,
          )
        : null,

      article.id &&
      includeAnalyticsData
        ? this.viewRepository.findByContent(
            article.id,
          )
        : [],

      article.id &&
      includeAnalyticsData
        ? this.engagementRepository.findByContent(
            article.id,
          )
        : [],
    ]);

    return {
      ...article,

      author,
      category,

      ...(includeAnalyticsData && {
        views: views ?? [],
        engagements:
          engagements ?? [],
      }),
    };
  }

  private async uploadCoverImage(
    uid: string,
    file: File,
    articleId: string,
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

    if (!articleId) {
      throw new Error(
        "Article id is required",
      );
    }

    return uploadImage(file, {
      folder: `articles/${uid}`,
      publicId: `cover-${articleId}`,
    });
  }
  
  async getArticles(): Promise<
    Article[]
  > {
    const articles =
      await this.articleRepository.findAll();

    return Promise.all(
      articles.map((article) =>
        this.mapArticle(
          article,
          true,
        ),
      ),
    );
  }

  async getPublishedArticlesByAuthor(
    uid: string,
  ): Promise<Article[]> {
    if (!uid) {
      throw new Error(
        "User id is required",
      );
    }

    const articles =
      await this.articleRepository.findByUser(
        uid,
      );

    const publishedArticles =
      articles.filter(
        (article) =>
          article.active !== false &&
          article.status ===
            "published",
      );

    return Promise.all(
      publishedArticles.map(
        (article) =>
          this.mapArticle(article),
      ),
    );
  }

  async getPublishedArticles(): Promise<
    Article[]
  > {
    const articles =
      await this.articleRepository.findPublishedArticles();

      return Promise.all(
      articles.map((article) =>
        this.mapArticle(article),
      ),
    );
  }

  async getArticlesByAuthor(
    uid: string,
  ): Promise<Article[]> {
    if (!uid) {
      throw new Error(
        "User id is required",
      );
    }

    const articles =
      await this.articleRepository.findByUser(
        uid,
      );

    const enriched =
      await Promise.all(
        articles.map((article) =>
          this.mapArticle(
            article,
            true,
          ),
        ),
      );

    return enriched.map(
      enrichArticle,
    );
  }

  async getArticleById(
    uid: string,
    id: string,
  ): Promise<Article | null> {
    const article = await this.verifyArticleOwnership(
        uid,
        id,
      );

    return this.mapArticle(
      article,
      true,
    );
  }

  async getArticleBySlug(
    slug: string,
    locale: SupportedLocale,
    uid: string | null,
  ): Promise<Article | null> {
    if (!slug) {
      throw new Error(
        "Article slug or id is required",
      );
    }

    const article = slug.includes("-")
      ? await this.articleRepository.findBySlug(
          slug,
          locale,
        )
      : await this.articleRepository.findById(
          slug,
        );

    if (!article) {
      return null;
    }

    if (uid) {
      return this.mapArticle(article);
    }

    if (
      article.active === false ||
      article.status !== "published"
    ) {
      return null;
    }

    return this.mapArticle(article);
  }


  async getArticlesByCategory(
    categoryId: string,
  ): Promise<Article[]> {
    if (!categoryId) {
      throw new Error(
        "Category id is required",
      );
    }

    const articles =
      await this.articleRepository.findByCategoryId(
        categoryId,
      );

    const publishedArticles =
      articles.filter(
        (article) =>
          article.active !== false &&
          article.status ===
            "published",
      );

    return Promise.all(
      publishedArticles.map(
        (article) =>
          this.mapArticle(article),
      ),
    );
  }

  async createArticle(
    uid: string,
    article: ArticleServerInput,
  ): Promise<Article> {
    if (!uid) {
      throw new Error(
        "User id is required",
      );
    }

    if (!article) {
      throw new Error(
        "Article data is required",
      );
    }

    await this.verifyUser(uid);

    const {
      title,
      slug,
      categoryId,
      content,
      coverImage,
    } = article;
    
    if (
      !title.en.trim() ||
      !title.fr.trim()
    ) {
      throw new Error(
        "English and French titles are required",
      );
    }

    if (!categoryId) {
      throw new Error(
        "Category is required",
      );
    }
    if (
      !slug.en ||
      !slug.fr
    ) {
      throw new Error(
        "Article slugs are required before publishing",
      );
    }

    await this.verifyCategory(
      categoryId,
    );

    /*
     * Check both localized slugs.
     */
    const [
      existingEnglish,
      existingFrench,
    ] = await Promise.all([
      slug.en
        ? this.articleRepository.findBySlug(
            slug.en,
            "en",
          )
        : null,

      slug.fr
        ? this.articleRepository.findBySlug(
            slug.fr,
            "fr",
          )
        : null,
    ]);

    if (
      existingEnglish ||
      existingFrench
    ) {
      throw new Error(
        "Article with this slug already exists",
      );
    }

    const articleId = this.articleRepository.generateId();

    let coverImageUrl: string | null = null;

    let coverImagePublicId:
      | string
      | null = null;
    
    /*
    * Cover image is optional.
    */
    if (coverImage) {
      const uploaded = await this.uploadCoverImage(
          uid,
          coverImage,
          articleId,
        );

      coverImageUrl =
        uploaded.url;

      coverImagePublicId =
        uploaded.publicId;
    }

    const now = Timestamp.now();

    const payload: Omit<Article, "id"
    > = {
      uid,

      title,

      slug,

      content: {
        en: content?.en ?? "",
        fr: content?.fr ?? "",
      },

      categoryId: categoryId,

      status: "draft",

      cover_image: coverImageUrl,

      cover_image_public_id: coverImagePublicId,

      active: false,

      date: now,

      createdAt: now,
    };

    return this.articleRepository.create(
      payload,
      articleId
    );
  }

  async publishArticle(
    uid: string,
    id: string,
  ): Promise<boolean> {
    const article = await this.verifyArticleOwnership(
        uid,
        id,
      );

    if (
      article.active === false &&
      article.deletedAt
    ) {
      throw new Error(
        "Cannot publish a deleted article",
      );
    }

    if (
      article.status === "published"
    ) {
      throw new Error(
        "Article is already published",
      );
    }

    if (
      !article.title.en.trim() ||
      !article.title.fr.trim() ||
      !article.slug.en.trim() ||
      !article.slug.fr.trim() ||
      !article.content.en.trim() ||
      !article.content.fr.trim() ||
      !article.categoryId
    ) {
      throw new Error(
        "Article is incomplete and cannot be published",
      );
    }

    return this.articleRepository.update(
      id,
      {
        status: "published",

        active: true,

        publishedAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      },
    );
  }

  async updateArticle(
    uid: string,
    id: string,
    data: ArticleUpdateInput,
  ): Promise<boolean> {
    if (!uid || !id) {
      throw new Error(
        "User id and article id are required",
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

    await this.verifyCategory(
      data.categoryId,
    );

    const article =
      await this.verifyArticleOwnership(
        uid,
        id,
      );

    if (article.active === false) {
      throw new Error(
        "Cannot update a deleted article",
      );
    }

    
    const payload: ArticlePersistenceUpdate = {};

    
    payload.title = data.title;

    if (data.slug !== undefined) {
      payload.slug = data.slug;
    }

    if (data.categoryId !== undefined) {
      payload.categoryId =
        data.categoryId;
    }

    if (data.content !== undefined) {
      payload.content = data.content;
    }

    if (
      data.publishedAt !== undefined
    ) {
      payload.publishedAt =
        data.publishedAt;
    }

    /*
    * User selected a new cover image.
    */
    if (data.coverImage) {
      const uploaded =
        await this.uploadCoverImage(
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

    return this.articleRepository.update(
      id,
      {
        ...payload,
        updatedAt: Timestamp.now(),
      }
    );
  }
  
  async deleteArticle(
    uid: string,
    id: string,
  ): Promise<boolean> {
    const article =
      await this.verifyArticleOwnership(
        uid,
        id,
      );

    if (article.active === false) {
      throw new Error(
        "Article is already deleted",
      );
    }

    return this.articleRepository.update(
      id,
      {
        active: false,
        deletedAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      },
    );
  }

  async restoreArticle(
    uid: string,
    id: string,
  ): Promise<boolean> {
    const article =
      await this.verifyArticleOwnership(
        uid,
        id,
      );

    if (article.active !== false) {
      throw new Error(
        "Article is already active",
      );
    }

    return this.articleRepository.update(
      id,
      {
        active: true,
        deletedAt: null,
        updatedAt: Timestamp.now(),
      },
    );
  }

  async resetAllArticles(
    uid: string,
  ): Promise<boolean> {
    if (!uid) {
      throw new Error(
        "User id is required",
      );
    }

    return this.articleRepository.reset(
      uid,
    );
  }
}