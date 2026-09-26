import { Timestamp } from "firebase-admin/firestore"

import type { Article } from "@/features/interfaces/article";
import type { Project } from "@/features/interfaces/project";

export interface Category {
    id?: string
    name : string
    slug : string
    active?: boolean
    date?: Timestamp
    deletedAt?: Timestamp
    updatedAt?: Timestamp
    createdAt?: Timestamp
}

export interface CategoryInput {
    name : string
    slug : string
}

export interface CategoryDashboardItem {
  category: Category;
  articles: Article[];
  projects: Project[];
}