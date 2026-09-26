import "server-only";

import ProjectRepository from "@/features/projects/repositories/project.repository";
import CategoryRepository from "@/features/categories/repositories/category.repository";
import UserRepository from "@/features/users/repositories/user.repository";
import ViewRepository from "@/features/views/repositories/view.repository";
import EngagementRepository from "@/features/engagements/repositories/engagement.repository";
import ProjectService from "@/features/projects/services/project.service";

const projectRepository = new ProjectRepository();
const categoryRepository = new CategoryRepository();
const userRepository = new UserRepository();
const viewRepository = new ViewRepository();
const engagementRepository = new EngagementRepository();
export const projectService = new ProjectService(
    projectRepository,
    categoryRepository,
    userRepository,
    viewRepository,
    engagementRepository
);