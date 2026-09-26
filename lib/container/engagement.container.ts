import "server-only";

import EngagementRepository from "@/features/engagements/repositories/engagement.repository";
import EngagementService from "@/features/engagements/services/engagement.service";


const engagementRepository = new EngagementRepository();
export const engagementService = new EngagementService(engagementRepository);