import {
  BriefcaseBusiness,
  Building2,
  MapPin,
  UserRound,
} from "lucide-react";

import type { User } from "@/features/interfaces/user";

interface ProfileProfessionalCardProps {
  user: User;
}

interface ProfessionalItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string;
}

function ProfessionalItem({
  icon: Icon,
  label,
  value,
}: ProfessionalItemProps) {
  return (
    <div className="group flex items-start gap-3 rounded-xl border bg-background/50 p-4 transition-colors hover:bg-muted/40">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold">
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

export default function ProfileProfessionalCard({
  user,
}: ProfileProfessionalCardProps) {
  const fullName =
    `${user.firstName} ${user.lastName}`.trim();

  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <BriefcaseBusiness className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-base font-semibold tracking-tight">
            Professional Information
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Your professional identity and workplace details.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <ProfessionalItem
          icon={UserRound}
          label="Full Name"
          value={fullName}
        />

        <ProfessionalItem
          icon={BriefcaseBusiness}
          label="Title"
          value={user.title}
        />

        <ProfessionalItem
          icon={Building2}
          label="Company"
          value={user.company}
        />

        <ProfessionalItem
          icon={MapPin}
          label="Address"
          value={user.address}
        />
      </div>
    </section>
  );
}
