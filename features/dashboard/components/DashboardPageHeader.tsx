import type { ReactNode } from "react";

interface DashboardPageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}

export default function DashboardPageHeader({
  eyebrow,
  title,
  description,
  actions,
}: DashboardPageHeaderProps) {
  return (
    <header className="mb-10 border-b border-slate-200 pb-8 lg:mb-12">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-3xl">
          {eyebrow && (
            <div className="mb-4 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-px w-8 bg-orange-600"
              />

              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-600">
                {eyebrow}
              </p>
            </div>
          )}

          <h1 className="text-4xl font-bold tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-[3.25rem] lg:leading-[1.05]">
            {title}
          </h1>

          {description && (
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-500 sm:text-lg">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-2 lg:pb-1">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}