import {
  CheckCircle2,
  Clock3,
} from "lucide-react";

type StatusBadgeStatus =
  | "new"
  | "replied"
  | "active"
  | "inactive";

interface StatusBadgeProps {
  status: StatusBadgeStatus | null;
}

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  const config = {
    new: {
      label: "New",
      icon: Clock3,
      className: `
        bg-orange-50
        text-orange-700
        ring-orange-100
      `,
    },

    replied: {
      label: "Replied",
      icon: CheckCircle2,
      className: `
        bg-green-50
        text-green-700
        ring-green-100
      `,
    },

    active: {
      label: "Active",
      icon: CheckCircle2,
      className: `
        bg-green-50
        text-green-700
        ring-green-100
      `,
    },

    inactive: {
      label: "Inactive",
      icon: Clock3,
      className: `
        bg-slate-100
        text-slate-600
        ring-slate-200
      `,
    },
  } satisfies Record<
    StatusBadgeStatus,
    {
      label: string;
      icon: typeof Clock3;
      className: string;
    }
  >;

  const {
    label,
    icon: Icon,
    className,
  } = config[status ?? "new"];

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-1.5
        rounded-full
        px-3 py-1.5
        text-xs font-semibold
        ring-1
        ${className}
      `}
    >
      <Icon
        className="size-3.5"
        aria-hidden="true"
      />

      {label}
    </span>
  );
}
