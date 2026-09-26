import { AppTimestamp } from "./article";

import type { View } from "@/features/interfaces/view.js";
import type { Engagement } from "@/features/interfaces/engagement.js";
import type { User } from "@/features/interfaces/user.js";
import type { Category } from "@/features/interfaces/category.js";

export type Status = "draft" | "published";

export interface Lang { en: string; fr: string; }

/*
 * -------------------------------------------
 * Project document
 * -------------------------------------------
 */

export interface Project {
  id: string;
  uid: string;
  categoryId: string;
  title: Lang;
  slug: Lang;
  content: Lang;
  details: Lang;
  tech_stack: string[];
  status: Status;
  live_url: string | null;
  github_url: string | null;
  cover_image: string | null;  
  cover_image_public_id?: string | null;
  active: boolean;
  milestone?: number;
  publishedAt?: AppTimestamp;
  date?: AppTimestamp;
  deletedAt?: AppTimestamp;
  updatedAt?: AppTimestamp;
  createdAt?: AppTimestamp;
  views?: View[];
  engagements?: Engagement[];
  author?: User | null;
  category?: Category | null;
  analytics?: object;
}

/*
 * -------------------------------------------
 * Project input
 * -------------------------------------------
 */

export interface ProjectInput {
  categoryId: string;
  title: Lang;
  content: Lang;
  details: Lang;
  tech_stack: string[];
  live_url: string | null;
  github_url: string | null;
  coverImage: File | null;
}

export interface ProjectServerInput {
  categoryId: string;
  title: Lang;
  slug: Lang
  content: Lang;
  details: Lang;
  tech_stack: string[];
  live_url: string | null;
  github_url: string | null;
  coverImage: File | null;
}

export type ProjectUpdateInput = Partial<{
  title: Lang;
  slug: Lang;
  categoryId: string;
  content: Lang;
  details: Lang;
  tech_stack: string[];
  live_url: string | null;
  github_url: string | null;
  coverImage: File | null;
  removeCoverImage: boolean;
  publishedAt?: AppTimestamp;
}>;


export type ProjectPersistenceUpdate = Partial<{
  title: Lang;
  slug: Lang;
  categoryId: string;
  content: Lang;
  details: Lang;
  tech_stack: string[];
  live_url: string | null;
  github_url: string | null;
  cover_image: string | null;
  cover_image_public_id: string | null;
  publishedAt: AppTimestamp;
}>;

