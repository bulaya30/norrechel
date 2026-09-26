import "server-only";

import EngagementRepository from "@/features/engagements/repositories/engagement.repository";
import type { Engagement, EngagementInput } from "@/features/interfaces/engagement";
import { Timestamp } from "firebase-admin/firestore";

export default class EngagementService {
  constructor(private engagementRepository: EngagementRepository) {}

  async getEngagements(): Promise<Engagement[]> {
    return await this.engagementRepository.findAll();
  }

  async getEngagementById(id: string): Promise<Engagement | null> {
    if (!id) {
      throw new Error("Engagement id is required");
    }

    return await this.engagementRepository.findById(id);
  }

  async getEngagementsByContent(contentId: string): Promise<Engagement[]> {
    if (!contentId) {
      throw new Error("Content id is required");
    }

    return await this.engagementRepository.findByContent(contentId);
  }

  async getEngagementsBySlug(slug: string): Promise<Engagement[]> {
    if (!slug) {
      throw new Error("Slug is required");
    }

    return await this.engagementRepository.findBySlug(slug);
  }

  async createEngagement(data: EngagementInput): Promise<Engagement> {
    if (!data) {
      throw new Error("Engagement data is required");
    }

    const {
      visitor_id,
      content_id,
      content_type,
      event_type,
      event_value,
      metadata,
    } = data;

    if (
      !visitor_id ||
      !content_id ||
      !content_type ||
      !event_type ||
      event_value === undefined ||
      event_value === null
    ) {
      throw new Error("Missing required engagement fields");
    }

    const now = Timestamp.now();

    if (event_type === "scroll" || event_type === "scroll_depth" || event_type === "read_time") {
      const visitorEngagements =
        await this.engagementRepository.findByVisitor(visitor_id);

      const existingEvent = visitorEngagements.find(
        (engagement) =>
          engagement.content_id === content_id &&
          engagement.content_type === content_type &&
          engagement.event_type === event_type
      );

      if (existingEvent) {
        if (event_value > existingEvent.event_value) {
          await this.engagementRepository.update(existingEvent.id!, {
            event_value,
            metadata,
            date: now,
          });

          return {
            ...existingEvent,
            event_value,
            metadata,
            date: now,
          };
        }

        return existingEvent;
      }
    }

    const payload: Omit<Engagement, "id"> = {
      visitor_id,
      content_id,
      content_type,
      event_type,
      event_value,
      metadata,
      date: now,
    };

    return await this.engagementRepository.create(payload);
  }

  async updateEngagement(
    id: string,
    data: Partial<Engagement>
  ): Promise<boolean> {
    if (!id) {
      throw new Error("Engagement id is required");
    }

    if (!data || Object.keys(data).length === 0) {
      throw new Error("No update data provided");
    }

    const existing = await this.engagementRepository.findById(id);

    if (!existing) {
      throw new Error("Engagement not found");
    }

    return await this.engagementRepository.update(id, data);
  }

  async deleteEngagement(id: string): Promise<boolean> {
    if (!id) {
      throw new Error("Engagement id is required");
    }

    const existing = await this.engagementRepository.findById(id);

    if (!existing) {
      throw new Error("Engagement not found");
    }

    return await this.engagementRepository.delete(id);
  }

  async resetEngagements(): Promise<boolean> {
    return await this.engagementRepository.reset();
  }
}