"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LogOut,
  Menu,
} from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { dashboardNavigation } from "@/features/dashboard/constants/dashboardNavigation";
import { logoutAction } from "@/features/auth/actions/auth.actions";

type SupportedLocale = "en" | "fr";

interface DashboardMobileNavProps {
  locale: SupportedLocale;
}

export default function DashboardMobileNav({
  locale,
}: DashboardMobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header
      className="
        fixed inset-x-0 top-0 z-40
        flex h-16 items-center justify-between
        border-b border-slate-200
        bg-white/95 px-4 shadow-sm
        backdrop-blur-md
        md:hidden
      "
    >
      <Link
        href={`/${locale}/dashboard`}
        className="
          text-lg font-bold tracking-tight
          text-slate-950
          transition-colors
          hover:text-orange-600
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-orange-500
          focus-visible:ring-offset-2
        "
      >
        Norrechel
      </Link>

      <Sheet
        open={open}
        onOpenChange={setOpen}
      >
        <SheetTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label={
              locale === "fr"
                ? "Ouvrir la navigation"
                : "Open navigation"
            }
            className="
              text-slate-700
              hover:bg-slate-100
              hover:text-orange-600
              focus-visible:ring-orange-500
            "
          >
            <Menu
              className="size-5"
              aria-hidden="true"
            />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="
            w-[85%] max-w-sm
            overflow-hidden border-r border-white/10
            bg-slate-950 p-0 text-white
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
            <SheetHeader className="border-b border-white/10 px-5 py-6 text-left">
              <SheetTitle className="text-xl font-bold text-white">
                Norrechel
              </SheetTitle>

              <SheetDescription className="text-xs font-medium uppercase tracking-[0.18em] text-slate-400">
                Administration
              </SheetDescription>
            </SheetHeader>

            <nav
              aria-label={
                locale === "fr"
                  ? "Navigation mobile du tableau de bord"
                  : "Mobile dashboard navigation"
              }
              className="flex-1 space-y-1 overflow-y-auto px-3 py-5"
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
                    onClick={() => setOpen(false)}
                    aria-current={
                      isActive ? "page" : undefined
                    }
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

                    <span>
                      {item.label[locale]}
                    </span>
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
        </SheetContent>
      </Sheet>
    </header>
  );
}