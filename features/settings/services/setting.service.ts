import "server-only";

import type { Setting } from "@/features/interfaces/setting";
import SettingsRepository from "@/features/settings/repositories/setting.repository";

type CreateSettingInput = Omit<
  Setting,
  "id" | "uid" | "active" | "date" | "createdAt" | "updatedAt"
>;

export default class SettingService {
  constructor(private settingsRepository: SettingsRepository) {}

  private async verifySettingOwnership(
    uid: string,
    settingId: string
  ): Promise<Setting> {
    if (!uid) {
      throw new Error("User id is required");
    }

    if (!settingId) {
      throw new Error("Setting id is required");
    }

    const setting = await this.settingsRepository.findById(settingId);

    if (!setting) {
      throw new Error("Setting not found");
    }

    if (setting.uid !== uid) {
      throw new Error("Unauthorized");
    }

    return setting;
  }

  async getUserSettings(uid: string): Promise<Setting> {
    if (!uid) {
      throw new Error("User id is required");
    }

    const existing = await this.settingsRepository.findByUser(uid);

    if (existing) {
      return existing;
    }

    return await this.settingsRepository.createDefaultSettings(uid);
  }

  async getSettingsById(uid: string, id: string): Promise<Setting> {
    return await this.verifySettingOwnership(uid, id);
  }

  async createSetting(
    uid: string,
    data: CreateSettingInput
  ): Promise<Setting> {
    if (!uid) {
      throw new Error("User id is required");
    }

    const existing = await this.settingsRepository.findByUser(uid);

    if (existing) {
      throw new Error("Settings already exist for this user");
    }

    const payload: Omit<Setting, "id"> = {
      ...data,
      uid,
      active: true,
    };

    return await this.settingsRepository.create(payload);
  }

  async updateSetting(
    uid: string,
    id: string,
    data: Partial<Setting>
  ): Promise<boolean> {
    if (!data || Object.keys(data).length === 0) {
      throw new Error("No update data provided");
    }

    await this.verifySettingOwnership(uid, id);

    return await this.settingsRepository.update(id, data);
  }

  async deleteSetting(uid: string, id: string): Promise<boolean> {
    await this.verifySettingOwnership(uid, id);

    return await this.settingsRepository.delete(id);
  }

  async resetSetting(uid: string): Promise<boolean> {
    if (!uid) {
      throw new Error("User id is required");
    }

    return await this.settingsRepository.reset(uid);
  }
}