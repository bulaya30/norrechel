"use client";

import { useMemo, useState } from "react";

import SubscriberFilters from "@/features/subscribers/components/SubscriberFilters";
import SubscriberList from "@/features/subscribers/components/SubscriberList";
import SubscriberStats from "@/features/subscribers/components/SubscriberStats";

import type { Subscriber } from "@/features/interfaces/subscriber";

type SubscriberFilter = "all" | "active" | "unsubscribed";

interface SubscriberManagerProps {
  subscribers: Subscriber[];
}

export default function SubscriberManager({
  subscribers,
}: SubscriberManagerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<SubscriberFilter>("all");

  const stats = useMemo(() => {
    const active = subscribers.filter(
      (subscriber) => subscriber.active !== false
    ).length;

    const unsubscribed = subscribers.filter(
      (subscriber) => subscriber.active === false
    ).length;

    return {
      total: subscribers.length,
      active,
      unsubscribed,
    };
  }, [subscribers]);

  const filteredSubscribers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return subscribers.filter((subscriber) => {
      const isActive = subscriber.active !== false;

      if (statusFilter === "active" && !isActive) {
        return false;
      }

      if (statusFilter === "unsubscribed" && isActive) {
        return false;
      }

      if (!query) {
        return true;
      }

      return subscriber.email.toLowerCase().includes(query);
    });
  }, [subscribers, searchQuery, statusFilter]);

  return (
    <div className="space-y-6">
      <SubscriberStats
        total={stats.total}
        active={stats.active}
        unsubscribed={stats.unsubscribed}
      />

      <SubscriberFilters
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        onSearchChange={setSearchQuery}
        onStatusChange={setStatusFilter}
      />

      <SubscriberList subscribers={filteredSubscribers} />
    </div>
  );
}
