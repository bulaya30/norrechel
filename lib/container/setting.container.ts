import "server-only";

import SettingRepository from "@/features/settings/repositories/setting.repository";
import SettingService from "@/features/settings/services/setting.service";

const settingRepository = new SettingRepository();
export const settingService = new SettingService(settingRepository);