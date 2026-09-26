import "server-only";

import type { System } from "@/features/interfaces/system";
import SystemRepository from "@/features/system/repositories/system.repository";

export default class SystemService {
  constructor(
    private systemRepository: SystemRepository
  ) {}

  async getSystem(): Promise<System> {
    let system = await this.systemRepository.get();

    if (!system) {
      system = await this.systemRepository.initiate();
    }

    return system;
  }

  async lockSystem(): Promise<boolean> {
    const system = await this.getSystem();

    if (system.locked) {
      return true;
    }

    return await this.systemRepository.update(system.id!, {
      locked: true,
    });
  }

  async unlockSystem(): Promise<boolean> {
    const system = await this.getSystem();

    if (!system.locked) {
      return true;
    }

    return await this.systemRepository.update(system.id!, {
      locked: false,
    });
  }

  async isLocked(): Promise<boolean> {
    const system = await this.getSystem();

    return system.locked;
  }
}