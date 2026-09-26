import "server-only";

import crypto from "crypto";
// import geoip from "geoip-lite";
import { UAParser } from "ua-parser-js";
import type { NextRequest } from "next/server";

import VisitorRepository from "@/features/visitors/repositories/visitor.repository";
import type { Visitor, VisitorInput } from "@/features/interfaces/visitor";

export default class VisitorService {
  private readonly SESSION_WINDOW = 30 * 60 * 1000;

  constructor(private visitorRepository: VisitorRepository) {}

  private hashIp(ip = ""): string {
    return crypto.createHash("sha256").update(ip).digest("hex");
  }

  async getVisitors(): Promise<Visitor[]> {
    return await this.visitorRepository.findAll();
  }

  async getVisitorById(id: string): Promise<Visitor | null> {
    if (!id) {
      throw new Error("Visitor id is required");
    }

    return await this.visitorRepository.findById(id);
  }

  async getVisitorsByIp(ip: string): Promise<Visitor | null> {
    if (!ip) {
      throw new Error("IP is required");
    }

    return await this.visitorRepository.findByIp(this.hashIp(ip));
  }

  async getVisitorsByContent(contentId: string): Promise<Visitor[]> {
    if (!contentId) {
      throw new Error("Content id is required");
    }

    return await this.visitorRepository.findByContent(contentId);
  }

  private async resolveVisitor(
    visitorId: string,
    sessionId: string,
    hashedIp: string
  ): Promise<Visitor | null> {
    const byVisitorId = await this.visitorRepository.findByVisitorId(visitorId);

    if (byVisitorId) {
      return byVisitorId;
    }

    const bySession = await this.visitorRepository.findBySessionId(sessionId);

    if (bySession) {
      return bySession;
    }

    return await this.visitorRepository.findByIp(hashedIp);
  }

  private buildContext(req: NextRequest) {
    const rawIp =
      req.headers.get("x-nf-client-connection-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "";

    const cleanIp = rawIp.replace("::ffff:", "");
    const hashedIp = this.hashIp(cleanIp);

    const parser = new UAParser(
      req.headers.get("user-agent") ?? "",
    );

    const ua = parser.getResult();

    return {
      ip: hashedIp,

      country: req.headers.get("x-country") ?? "",

      city: "",

      device: {
        os: {
          name: ua.os.name ?? "",
          version: ua.os.version ?? "",
        },

        browser: {
          name: ua.browser.name ?? "",
          version: ua.browser.version ?? "",
          major: ua.browser.major ?? "",
        },

        device: {
          vendor: ua.device.vendor ?? "",
          model: ua.device.model ?? "",
          type: ua.device.type ?? "",
        },
      },
    };
  }

  async trackVisitor(
    req: NextRequest,
    data: VisitorInput
  ): Promise<Visitor> {
    if (!data) {
      throw new Error("Visitor data is required");
    }

    const { visitorId, sessionId } = data;

    if (!visitorId || !sessionId) {
      throw new Error("Visitor id and session id are required");
    }

    const now = new Date();
    const context = this.buildContext(req);

    const existing = await this.resolveVisitor(
      visitorId,
      sessionId,
      context.ip
    );

    if (existing?.id) {
      const lastSessionAt = existing.lastSessionAt
        ? new Date(existing.lastSessionAt).getTime()
        : 0;

      const isNewSession = now.getTime() - lastSessionAt > this.SESSION_WINDOW;

      const update: Partial<Visitor> = {
        sessionId,
        lastSeenAt: now,
        lastSessionAt: now,
        country: context.country,
        city: context.city,
        device: context.device,
        visitorCount: isNewSession
          ? (existing.visitorCount ?? 0) + 1
          : existing.visitorCount ?? 1,
      };

      await this.visitorRepository.update(existing.id, update);

      return {
        ...existing,
        ...update,
      };
    }

    const payload: Omit<Visitor, "id"> = {
      visitorId,
      sessionId,
      ip: context.ip,
      country: context.country,
      city: context.city,
      device: context.device,
      lastSeenAt: now,
      lastSessionAt: now,
      visitorCount: 1,
      date: now,
    };

    return await this.visitorRepository.create(payload);
  }

  async updateVisitor(id: string, data: Partial<Visitor>): Promise<boolean> {
    if (!id) {
      throw new Error("Visitor id is required");
    }

    if (!data || Object.keys(data).length === 0) {
      throw new Error("No update data provided");
    }

    const visitor = await this.visitorRepository.findById(id);

    if (!visitor) {
      throw new Error("Visitor not found");
    }

    return await this.visitorRepository.update(id, data);
  }

  async deleteVisitor(id: string): Promise<boolean> {
    if (!id) {
      throw new Error("Visitor id is required");
    }

    const visitor = await this.visitorRepository.findById(id);

    if (!visitor) {
      throw new Error("Visitor not found");
    }

    return await this.visitorRepository.delete(id);
  }

  async resetVisitors(): Promise<boolean> {
    return await this.visitorRepository.reset();
  }
}