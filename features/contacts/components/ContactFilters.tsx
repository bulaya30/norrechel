import type { Status } from "@/features/interfaces/contact";

type ContactFilter = "all" | Status;

interface ContactFiltersProps {
  searchQuery: string;
  statusFilter: ContactFilter;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: ContactFilter) => void;
}

export default function ContactFilters({
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusChange,
}: ContactFiltersProps) {
  return (
    <div
      className="
        flex flex-col gap-4
        rounded-xl
        border border-slate-200
        bg-white
        p-4
        shadow-sm
        sm:flex-row
        sm:items-center
        sm:justify-between
      "
    >
      {/* Search */}
      <div className="w-full sm:max-w-md">
        <label
          htmlFor="contact-search"
          className="sr-only"
        >
          Search contacts
        </label>

        <input
          id="contact-search"
          type="search"
          value={searchQuery}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          placeholder="Search by name, email, or subject..."
          className="
            w-full
            rounded-lg
            border border-slate-300
            bg-white
            px-4 py-2.5
            text-sm
            text-slate-900
            outline-none
            transition
            placeholder:text-slate-400
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-500/20
          "
        />
      </div>

      {/* Status filter */}
      <div className="flex items-center gap-3">
        <label
          htmlFor="contact-status"
          className="text-sm font-medium text-slate-600"
        >
          Status
        </label>

        <select
          id="contact-status"
          value={statusFilter}
          onChange={(event) =>
            onStatusChange(
              event.target.value as ContactFilter,
            )
          }
          className="
            rounded-lg
            border border-slate-300
            bg-white
            px-3 py-2.5
            text-sm
            text-slate-900
            outline-none
            transition
            focus:border-blue-500
            focus:ring-2
            focus:ring-blue-500/20
          "
        >
          <option value="all">All</option>
          <option value="new">New</option>
          <option value="replied">Replied</option>
        </select>
      </div>
    </div>
  );
}
