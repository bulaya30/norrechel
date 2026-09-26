import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { viewService } from "@/lib/container/view.container";
import { serializeFirestore } from "@/lib/serializers/serializeFirestore";

import type { View } from "@/features/interfaces/view";

/*
 * -------------------------------------------
 * All views
 * -------------------------------------------
 */

export async function getCachedViews(): Promise<View[]> {
  "use cache";

  cacheLife("hours");

  cacheTag(
    "views",
    "views:all",
  );

  const views = await viewService.getViews();

  return serializeFirestore(views);
}