import "server-only";

import VisitorRepository from "@/features/visitors/repositories/visitor.repository";
import VisitorService from "@/features/visitors/services/visitor.service";

const visitorRepository = new VisitorRepository();
export const visitorService = new VisitorService(visitorRepository);