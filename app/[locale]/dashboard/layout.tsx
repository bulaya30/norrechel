import type { ReactNode } from "react";

import DashboardSidebar from "@/features/dashboard/components/DashboardSidebar";
import DashboardMobileNav from "@/features/dashboard/components/DashboardMobileNav";

type SupportedLocale = "en" | "fr";

interface DashboardLayoutProps {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

function isSupportedLocale(
  locale: string,
): locale is SupportedLocale {
  return locale === "en" || locale === "fr";
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    throw new Error(`Unsupported locale: ${locale}`);
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <DashboardSidebar locale={locale} />

      <DashboardMobileNav locale={locale} />

      <main
        id="main"
        className="
          min-h-screen
          px-4 pb-10 pt-20
          md:ml-64 md:px-6 md:pt-6
          lg:px-8
        "
      >
        <div className="mx-auto w-full max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}