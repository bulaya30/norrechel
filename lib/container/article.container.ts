import "server-only";

import ArticleRepository from "@/features/articles/repositories/article.repository";
import CategoryRepository from "@/features/categories/repositories/category.repository";
import UserRepository from "@/features/users/repositories/user.repository";
import ViewRepository from "@/features/views/repositories/view.repository";
import EngagementRepository from "@/features/engagements/repositories/engagement.repository";

import ArticleService from "@/features/articles/services/article.service";

const articleRepository = new ArticleRepository();
const categoryRepository = new CategoryRepository();
const userRepository = new UserRepository();
const viewRepository = new ViewRepository();
const engagementRepository = new EngagementRepository();

export const articleService = new ArticleService(
  articleRepository,
  categoryRepository,
  userRepository,
  viewRepository,
  engagementRepository
);