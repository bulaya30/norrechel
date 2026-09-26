import "server-only";

import UserRepository from "@/features/users/repositories/user.repository";
import SettingsRepository from "@/features/settings/repositories/setting.repository";
import ArticleRepository from "@/features/articles/repositories/article.repository";
import NotificationRepository from "@/features/notifications/repositories/notification.repository";
import ProjectRepository from "@/features/projects/repositories/project.repository";    
import UserService from "@/features/users/services/user.service";

const userRepository = new UserRepository();
const settingsRepository = new SettingsRepository();
const articleRepository = new ArticleRepository();
const notificationRepository = new NotificationRepository();
const projectRepository = new ProjectRepository();

export const userService = new UserService(
    userRepository,
    settingsRepository,
    articleRepository,
    projectRepository,
    notificationRepository,
);