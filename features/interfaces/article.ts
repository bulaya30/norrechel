import type { Timestamp } from "firebase-admin/firestore";

import type { View } from "./view";
import type { Engagement } from "./engagement";
import type { User } from "./user";
import type { Category } from "./category";

export type Status =
  | "draft"
  | "published";

export type Lang = {
  en: string;
  fr: string;
};

/*
 * Supports both raw Firebase Admin data
 * and serialized data sent to Client Components.
 */
export type AppTimestamp =
  | Timestamp
  | string
  | Date
  | null
  | undefined;

/*
 * Persisted Article entity.
 */
export interface Article {
  id: string;
  uid: string;

  title: Lang;
  slug: Lang;

  categoryId: string;

  status: Status;

  content: Lang;

  cover_image: string | null;
  cover_image_public_id?: string | null;

  active: boolean;

  author?: User | null;
  category?: Category | null;

  views?: View[];
  engagements?: Engagement[];

  milestone?: number;

  date?: AppTimestamp;
  publishedAt?: AppTimestamp;
  deletedAt?: AppTimestamp;
  updatedAt?: AppTimestamp;
  createdAt?: AppTimestamp;
}

export interface ArticleFormInput {
  title: Lang;
  categoryId: string;
  content: Lang;
  coverImage: File | null;
}

export interface ArticleServerInput {
  title: Lang;
  slug: Lang;
  categoryId: string;
  content: Lang;
  coverImage: File | null;
}

export type ArticleUpdateInput = Partial<{
  title: Lang;
  slug: Lang;
  categoryId: string;
  content: Lang;
  coverImage: File | null;
  removeCoverImage: boolean;
  publishedAt?: AppTimestamp;
}>;


export type ArticlePersistenceUpdate = Partial<{
    title: Lang;
    slug: Lang;
    categoryId: string;
    content: Lang;
    cover_image: string | null;
    cover_image_public_id: string | null;
    publishedAt: AppTimestamp;
  }>;

/*
 * Public Article Header component.
 */
export interface ArticleHeaderProps {
  title: string;
  category?: string;
  excerpt?: string;
  imageUrl?: string;
  imageAlt?: string;
}