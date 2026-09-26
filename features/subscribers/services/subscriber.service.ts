import "server-only";

import SubscriberRepository from "@/features/subscribers/repositories/subscriber.repository";
import type { Subscriber, SubscriberInput } from "@/features/interfaces/subscriber";

import { Timestamp } from "firebase-admin/firestore";

export default class SubscriberService {
  constructor(private subscriberRepository: SubscriberRepository) {}

  async getSubscribers(): Promise<Subscriber[]> {
    return await this.subscriberRepository.findAll();
  }

  async getSubscriberById(id: string): Promise<Subscriber | null> {
    if (!id) {
      throw new Error("Subscriber id is required");
    }

    return await this.subscriberRepository.findById(id);
  }

  async getSubscriberByEmail(email: string): Promise<Subscriber | null> {
    if (!email) {
      throw new Error("Subscriber email is required");
    }

    return await this.subscriberRepository.findByEmail(email);
  }

  async createSubscriber(data: SubscriberInput): Promise<Subscriber> {
    if (!data?.email) {
      throw new Error("Subscriber email is required");
    }

    const email = data.email.trim().toLowerCase();

    const existing = await this.subscriberRepository.findByEmail(email);

    if (existing) {
      if (existing.active === false && existing.id) {
        await this.subscriberRepository.update(existing.id, {
          active: true,
          unsubscribedAt: undefined,
          date: Timestamp.now(),
        });

        return {
          ...existing,
          active: true,
          unsubscribedAt: undefined,
        };
      }

      throw new Error("Subscriber already exists");
    }

    const payload: Omit<Subscriber, "id"> = {
      email,
      active: true,
      date: Timestamp.now(),
    };

    return await this.subscriberRepository.create(payload);
  }

  async updateSubscriber(
    id: string,
    data: Partial<Subscriber>
  ): Promise<boolean> {
    if (!id) {
      throw new Error("Subscriber id is required");
    }

    if (!data || Object.keys(data).length === 0) {
      throw new Error("No update data provided");
    }

    const subscriber = await this.subscriberRepository.findById(id);

    if (!subscriber) {
      throw new Error("Subscriber not found");
    }

    return await this.subscriberRepository.update(id, data);
  }

  async unsubscribe(id: string): Promise<boolean> {
    if (!id) {
      throw new Error("Subscriber id is required");
    }

    const subscriber = await this.subscriberRepository.findById(id);

    if (!subscriber) {
      throw new Error("Subscriber not found");
    }

    if (subscriber.active === false) {
      return true;
    }

    return await this.subscriberRepository.update(id, {
      active: false,
      unsubscribedAt: Timestamp.now(),
    });
  }

  async reactivate(id: string): Promise<boolean> {
    if (!id) {
      throw new Error("Subscriber id is required");
    }

    const subscriber = await this.subscriberRepository.findById(id);

    if (!subscriber) {
      throw new Error("Subscriber not found");
    }

    if (subscriber.active !== false) {
      return true;
    }

    return await this.subscriberRepository.update(id, {
      active: true,
      unsubscribedAt: undefined,
      date: Timestamp.now(),
    });
  }


  async deleteSubscriber(id: string): Promise<boolean> {
    if (!id) {
      throw new Error("Subscriber id is required");
    }

    const subscriber = await this.subscriberRepository.findById(id);

    if (!subscriber) {
      throw new Error("Subscriber not found");
    }

    return await this.subscriberRepository.delete(id);
  }

  async resetSubscribers(): Promise<boolean> {
    return await this.subscriberRepository.reset();
  }
}