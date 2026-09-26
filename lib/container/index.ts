import "server-only";

import ArticleRepository from "@/features/articles/repositories/article.repository";
import CategoryRepository from "@/features/categories/repositories/category.repository";
import ContactRepository from "@/features/contacts/repositories/contact.repository";
import EngagementRepository from "@/features/engagements/repositories/engagement.repository";
import NotificationRepository from "@/features/notifications/repositories/notification.repository";
import ProjectRepository from "@/features/projects/repositories/project.repository";
import SettingsRepository from "@/features/settings/repositories/setting.repository";
import SubscriberRepository from "@/features/subscribers/repositories/subscriber.repository";
import SystemRepository from "@/features/system/repositories/system.repository";
import UserRepository from "@/features/users/repositories/user.repository";
import ViewRepository from "@/features/views/repositories/view.repository";
import VisitorRepository from "@/features/visitors/repositories/visitor.repository";

import ArticleService from "@/features/articles/services/article.service";
import CategoryService from "@/features/categories/services/category.service";
import ContactService from "@/features/contacts/services/contact.service";
import EngagementService from "@/features/engagements/services/engagement.service";
import NotificationService from "@/features/notifications/services/notification.service";
import ProjectService from "@/features/projects/services/project.service";
import SettingService from "@/features/settings/services/setting.service";
import SubscriberService from "@/features/subscribers/services/subscriber.service";
import SystemService from "@/features/system/services/system.service";
import UserService from "@/features/users/services/user.service";
import ViewService from "@/features/views/services/view.service";
import VisitorService from "@/features/visitors/services/visitor.service";

// Repositories
const articleRepository = new ArticleRepository();
const categoryRepository = new CategoryRepository();
const contactRepository = new ContactRepository();
const engagementRepository = new EngagementRepository();
const notificationRepository = new NotificationRepository();
const projectRepository = new ProjectRepository();
const settingsRepository = new SettingsRepository();
const subscriberRepository = new SubscriberRepository();
const systemRepository = new SystemRepository();
const userRepository = new UserRepository();
const viewRepository = new ViewRepository();
const visitorRepository = new VisitorRepository();

// Services
export const articleService = new ArticleService(
  articleRepository,
  categoryRepository,
  userRepository,
  viewRepository,
  engagementRepository
);

export const categoryService = new CategoryService(categoryRepository);

export const contactService = new ContactService(contactRepository);

export const engagementService = new EngagementService(engagementRepository);

export const notificationService = new NotificationService(
  notificationRepository,
  userRepository
);

export const projectService = new ProjectService(
  projectRepository,
  categoryRepository,
  userRepository,
  viewRepository,
  engagementRepository
);

export const settingService = new SettingService(settingsRepository);

export const subscriberService = new SubscriberService(subscriberRepository);

export const systemService = new SystemService(systemRepository);

export const userService = new UserService(
  userRepository,
  settingsRepository,
  articleRepository,
  projectRepository,
  notificationRepository
);

export const viewService = new ViewService(viewRepository);

export const visitorService = new VisitorService(visitorRepository);