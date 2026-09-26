import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { subscriberService } from "@/lib/container/subscriber.container";
import { serializeFirestore } from "@/lib/serializers/serializeFirestore";

import type { Subscriber } from "@/features/interfaces/subscriber";

export async function getCachedSubscribers(): Promise<Subscriber[]> {
  "use cache";

  cacheLife("hours");
  cacheTag("subscribers");

  const subscribers =
    await subscriberService.getSubscribers();

  return serializeFirestore(subscribers);
}