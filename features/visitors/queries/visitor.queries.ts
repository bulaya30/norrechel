import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { visitorService } from "@/lib/container/visitor.container";
import { serializeFirestore } from "@/lib/serializers/serializeFirestore";

import type { Visitor } from "@/features/interfaces/visitor";

/*
 * -------------------------------------------
 * All visitors
 * -------------------------------------------
 */

export async function getCachedVisitors(): Promise<Visitor[]> {
  "use cache";

  cacheLife("hours");

  cacheTag("visitors", "visitors:all");

  const visitors = await visitorService.getVisitors();

  return serializeFirestore(visitors);
}