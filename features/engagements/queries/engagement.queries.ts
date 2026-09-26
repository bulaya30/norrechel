import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { engagementService } from "@/lib/container/engagement.container";
import { serializeFirestore } from "@/lib/serializers/serializeFirestore";

import type { Engagement } from "@/features/interfaces/engagement";

/*
 * -------------------------------------------
 * All engagements
 * -------------------------------------------
 */

export async function getCachedEngagements(): Promise<Engagement[]> {
  "use cache";

  cacheLife("hours");

  cacheTag(
    "engagements",
    "engagements:all",
  );

  const engagements =
    await engagementService.getEngagements();

  return serializeFirestore(engagements);
}