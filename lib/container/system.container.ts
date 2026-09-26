import "server-only";

import SystemRepository from "@/features/system/repositories/system.repository";
import SystemService from "@/features/system/services/system.service";

const systemRepository = new SystemRepository();
export const systemService = new SystemService(systemRepository);