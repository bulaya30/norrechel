import type { ReactNode } from "react";

interface ProfileFormSectionProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function ProfileFormSection({
  title,
  description,
  children,
}: ProfileFormSectionProps) {
  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <div>
        <h2 className="text-base font-semibold tracking-tight">
          {title}
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="mt-6">
        {children}
      </div>
    </section>
  );
}
