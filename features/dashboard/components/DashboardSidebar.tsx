"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { logoutAction } from "@/features/auth/actions/auth.actions";

import { dashboardNavigation } from "@/features/dashboard/constants/dashboardNavigation";

type SupportedLocale = "en" | "fr";

interface DashboardSidebarProps {
  locale: SupportedLocale;
}


export default function DashboardSidebar({
  locale,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className="
        fixed inset-y-0 left-0 z-40
        hidden w-64 overflow-hidden
        border-r border-white/10
        bg-slate-950 text-white
        md:flex md:flex-col
      "
    >
      <div
        aria-hidden="true"
        className="
          absolute inset-0
          bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.3),_transparent_36%),radial-gradient(circle_at_bottom_right,_rgba(234,88,12,0.16),_transparent_32%)]
        "
      />

      <div
        aria-hidden="true"
        className="
          absolute inset-0
          bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)]
          bg-[size:40px_40px]
        "
      />

      <div className="relative flex h-full flex-col">
        <header className="border-b border-white/10 px-5 py-6">
          <Link
            href={`/${locale}/dashboard`}
            className="
              inline-flex items-center
              text-xl font-bold tracking-tight
              transition-colors
              hover:text-orange-400
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-orange-400
            "
          >
            Norrechel
          </Link>

          <p
            className="
              mt-1 text-xs font-medium
              uppercase tracking-[0.18em]
              text-slate-400
            "
          >
            Administration
          </p>
        </header>

        <nav
          aria-label={
            locale === "fr"
              ? "Navigation du tableau de bord"
              : "Dashboard navigation"
          }
          className="flex-1 space-y-1 px-3 py-5"
        >
          {dashboardNavigation.map((item) => {
            const href = `/${locale}${item.href}`;

            const isActive =
              item.href === "/dashboard"
                ? pathname === href
                : pathname.startsWith(href);

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  `
                    flex min-h-11 items-center gap-3
                    rounded-xl px-3 py-2.5
                    text-sm font-semibold
                    transition-all duration-200
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-orange-400
                  `,
                  isActive
                    ? `
                        bg-orange-600 text-white
                        shadow-lg shadow-orange-950/20
                      `
                    : `
                        text-slate-300
                        hover:bg-white/10
                        hover:text-white
                      `,
                )}
              >
                <Icon
                  className="size-5 shrink-0"
                  aria-hidden="true"
                />

                <span>{item.label[locale]}</span>
              </Link>
            );
          })}
        </nav>

        <footer className="border-t border-white/10 p-3">
          <form action={logoutAction}>
            <input
              type="hidden"
              name="locale"
              value={locale}
            />

            <button type="submit">
              Logout
            </button>
          </form>
        </footer>
      </div>
    </aside>
  );
}