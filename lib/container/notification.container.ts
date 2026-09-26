import "server-only";

import NotificationRepository from "@/features/notifications/repositories/notification.repository";
import UserRepository from "@/features/users/repositories/user.repository";
import NotificationService from "@/features/notifications/services/notification.service";

const notificationRepository = new NotificationRepository();
const userRepository = new UserRepository();
export const notificationService = new NotificationService(
    notificationRepository,
    userRepository
);