import "server-only";

import ViewRepository from "@/features/views/repositories/view.repository";
import type { View, ViewInput } from "@/features/interfaces/view";
import { normalizeDate, } from "@/lib/dates/utils";
import { Timestamp } from "firebase-admin/firestore";

export default class ViewService {
  private readonly SESSION_WINDOW = 30 * 60 * 1000;

  constructor(private viewRepository: ViewRepository) {}

  async getViews(): Promise<View[]> {
    return await this.viewRepository.findAll();
  }

  async getViewById(id: string): Promise<View | null> {
    if (!id) {
      throw new Error("View id is required");
    }

    return await this.viewRepository.findById(id);
  }

  async getViewsByContent(contentId: string): Promise<View[]> {
    if (!contentId) {
      throw new Error("Content id is required");
    }

    return await this.viewRepository.findByContent(contentId);
  }

  async getViewsBySlug(slug: string): Promise<View[]> {
    if (!slug) {
      throw new Error("Slug is required");
    }

    return await this.viewRepository.findBySlug(slug);
  }

  async createView(
  data: ViewInput,
): Promise<View> {
  if (!data) {
    throw new Error("View data is required");
  }

  const {
    visitor_id,
    content_id,
    content_type,
    slug,
    referrer,
    session_id,
  } = data;

  if (
    !visitor_id ||
    !content_id ||
    !content_type ||
    !slug ||
    !session_id
  ) {
    throw new Error(
      "Missing required view fields",
    );
  }

  const now = Timestamp.now();

  const views =
    await this.viewRepository.findByContent(
      content_id,
    );

  const existing = views.find(
    (view) =>
      view.visitor_id === visitor_id &&
      view.content_id === content_id &&
      view.content_type === content_type &&
      view.slug === slug &&
      view.session_id === session_id,
  );

  if (existing?.viewed_at) {
    const viewedAt = normalizeDate(
      existing.viewed_at,
    );

    if (viewedAt) {
      const diff =
        now.toMillis() - viewedAt.getTime();

      if (diff < this.SESSION_WINDOW) {
        return existing;
      }
    }
  }

  const payload: Omit<View, "id"> = {
    visitor_id,
    content_id,
    content_type,
    slug,
    referrer: referrer ?? null,
    session_id,
    viewed_at: now,
    date: now,
  };

  return await this.viewRepository.create(
    payload,
  );
}

  async updateView(id: string, data: Partial<View>): Promise<boolean> {
    if (!id) {
      throw new Error("View id is required");
    }

    if (!data || Object.keys(data).length === 0) {
      throw new Error("No update data provided");
    }

    const existing = await this.viewRepository.findById(id);

    if (!existing) {
      throw new Error("View not found");
    }

    return await this.viewRepository.update(id, data);
  }

  async deleteView(id: string): Promise<boolean> {
    if (!id) {
      throw new Error("View id is required");
    }

    const existing = await this.viewRepository.findById(id);

    if (!existing) {
      throw new Error("View not found");
    }

    return await this.viewRepository.delete(id);
  }

  async resetViews(): Promise<boolean> {
    return await this.viewRepository.reset();
  }
}