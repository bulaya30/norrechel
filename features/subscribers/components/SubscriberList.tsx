"use client";

import { useTranslations } from "next-intl";

import SubscriberRow from "@/features/subscribers/components/SubscriberRow";
import type { Subscriber } from "@/features/interfaces/subscriber";

interface SubscriberListProps {
  subscribers: Subscriber[];
}

export default function SubscriberList({
  subscribers,
}: SubscriberListProps) {
  const t = useTranslations("SubscriberPage.SubscriberList");

  if (subscribers.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-10 text-center">
        <p className="text-sm font-medium">
          {t("emptyTitle")}
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          {t("emptyDescription")}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/40">
            <tr className="text-left">
              <th scope="col" className="px-4 py-3 font-medium">
                {t("email")}
              </th>

              <th scope="col" className="px-4 py-3 font-medium">
                {t("status")}
              </th>

              <th scope="col" className="px-4 py-3 font-medium">
                {t("subscribed")}
              </th>

              <th scope="col" className="px-4 py-3 font-medium">
                {t("unsubscribed")}
              </th>

              <th scope="col" className="px-4 py-3 text-right font-medium">
                {t("actions")}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {subscribers.map((subscriber) => (
              <SubscriberRow
                key={subscriber.id}
                subscriber={subscriber}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}