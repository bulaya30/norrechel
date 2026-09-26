import {
  Inbox,
  MailOpen,
  MessageSquare,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface ContactStatsProps {
  total: number;
  newCount: number;
  replied: number;
}

export default function ContactStats({
  total,
  newCount,
  replied,
}: ContactStatsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <StatCard
        icon={Inbox}
        label="Total"
        value={total}
        variant="blue"
      />

      <StatCard
        icon={MessageSquare}
        label="New"
        value={newCount}
        variant="orange"
      />

      <StatCard
        icon={MailOpen}
        label="Replied"
        value={replied}
        variant="green"
      />
    </div>
  );
}

/*
 * -------------------------------------------
 * Stat card
 * -------------------------------------------
 */

interface StatCardProps {
  icon: typeof Inbox;
  label: string;
  value: number;
  variant: "blue" | "orange" | "green";
}

function StatCard({
  icon: Icon,
  label,
  value,
  variant,
}: StatCardProps) {
  const variantStyles = {
    blue: {
      icon: "bg-blue-50 text-blue-700 ring-blue-100",
    },

    orange: {
      icon: "bg-orange-50 text-orange-700 ring-orange-100",
    },

    green: {
      icon: "bg-green-50 text-green-700 ring-green-100",
    },
  };

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardContent className="flex items-center gap-4 p-5">
        <div
          className={`
            flex size-11 shrink-0
            items-center justify-center
            rounded-2xl
            ring-1
            ${variantStyles[variant].icon}
          `}
        >
          <Icon
            className="size-5"
            aria-hidden="true"
          />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>

          <p
            className="
              mt-1
              text-2xl font-bold
              tracking-tight
              text-slate-950
            "
          >
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
