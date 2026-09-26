import SubscriberRow from "@/features/subscribers/components/SubscriberRow";
import type { Subscriber } from "@/features/interfaces/subscriber";

interface SubscriberListProps {
  subscribers: Subscriber[];
}

export default function SubscriberList({
  subscribers,
}: SubscriberListProps) {
  if (subscribers.length === 0) {
    return (
      <div className="rounded-xl border bg-card p-10 text-center">
        <p className="text-sm font-medium">No subscribers found.</p>

        <p className="mt-1 text-sm text-muted-foreground">
          Try adjusting your search or status filter.
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
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Subscribed</th>
              <th className="px-4 py-3 font-medium">Unsubscribed</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
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
