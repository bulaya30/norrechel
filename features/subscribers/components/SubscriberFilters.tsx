import { Search } from "lucide-react";
// import type { Subscriber } from "@/features/interfaces/subscriber";

type SubscriberFilter = "all" | "active" | "unsubscribed";

interface SubscriberFiltersProps {
  searchQuery: string;
  statusFilter: SubscriberFilter;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: SubscriberFilter) => void;
}

export default function SubscriberFilters({
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusChange,
}: SubscriberFiltersProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Search */}
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <input
          type="text"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search subscribers..."
          className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
        />
      </div>

      {/* Status filter */}
      <select
        value={statusFilter}
        onChange={(event) =>
          onStatusChange(event.target.value as SubscriberFilter)
        }
        className="h-10 rounded-md border bg-background px-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
      >
        <option value="all">All subscribers</option>
        <option value="active">Active</option>
        <option value="unsubscribed">Unsubscribed</option>
      </select>
    </div>
  );
}
