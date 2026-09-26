import "server-only";

import CategoryRepository from "@/features/categories/repositories/category.repository";
import CategoryService from "@/features/categories/services/category.service";


const categoryRepository = new CategoryRepository();
export const categoryService = new CategoryService(categoryRepository);