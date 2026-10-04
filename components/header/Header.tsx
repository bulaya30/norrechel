import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

import Logo from "./Logo";
import MobileNavigation from "./MobileNavigation";
import MyDropdown from "./MyDropdown";
import NavigationLinks from "./NavigationLinks";
import LanguageDropdown from "./LanguageDropdown";

import { getAuthenticatedUser } from "@/features/auth/lib/getAuthenticatedUser";

export default async function Header() {
  const t = await getTranslations("Header");
  const user = await getAuthenticatedUser();

  const userName = user
    ? `${user.firstName.charAt(0)}. ${user.lastName}`
    : undefined;

  return (
    <header
      className="
        fixed inset-x-0 top-0 z-50
        w-full
        border-b border-slate-200/80
        bg-white/95
        backdrop-blur-md
      "
    >
      <div
        className="
          mx-auto
          flex h-[68px]
          w-full max-w-7xl
          items-center justify-between
          px-4
          sm:px-6
          lg:px-8
        "
      >
        {/* Brand */}
        <Logo />

        {/* Desktop navigation */}
        <div className="hidden items-center md:flex">
          <nav
            aria-label={t("primaryNavigation")}
            className="flex items-center"
          >
            <NavigationLinks />
          </nav>

          {/* Account actions */}
          <div className="ml-6 flex items-center gap-2 border-l border-slate-200 pl-6">
            {userName ? (
              <MyDropdown userName={userName} />
            ) : (
              <Button
                asChild
                size="sm"
                className="
                  h-9
                  rounded-lg
                  bg-slate-950
                  px-4
                  text-sm
                  font-semibold
                  text-white
                  transition-colors
                  duration-200
                  hover:bg-orange-600
                "
              >
                <Link href="/login">
                  {t("login")}
                </Link>
              </Button>
            )}

            <LanguageDropdown />
          </div>
        </div>

        {/* Mobile navigation */}
        <MobileNavigation userName={userName} />
      </div>
    </header>
  );
}