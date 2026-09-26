import {
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import type { User } from "@/features/interfaces/user";

interface ProfileContactCardProps {
  user: User;
}

interface ContactItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string;
}

function ContactItem({
  icon: Icon,
  label,
  value,
}: ContactItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

export default function ProfileContactCard({
  user,
}: ProfileContactCardProps) {
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <div>
        <h2 className="text-base font-semibold tracking-tight">
          Contact Information
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Your primary contact details.
        </p>
      </div>

      <div className="mt-6 space-y-5">
        <ContactItem
          icon={Mail}
          label="Email"
          value={user.email}
        />

        <ContactItem
          icon={Phone}
          label="Phone"
          value={user.contact}
        />

        <ContactItem
          icon={MapPin}
          label="Address"
          value={user.address}
        />
      </div>
    </section>
  );
}
