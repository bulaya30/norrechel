import "server-only";

import ViewRepository from "@/features/views/repositories/view.repository";
import ViewService from "@/features/views/services/view.service";

export const viewRepository = new ViewRepository();

export const viewService = new ViewService(viewRepository);
