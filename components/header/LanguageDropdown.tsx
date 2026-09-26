"use client";

import { ChevronDown, Globe } from "lucide-react";
import { useLocale } from "next-intl";

import { usePathname, useRouter } from "@/i18n/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
  {
    code: "en",
    label: "English",
    shortLabel: "EN",
  },
  {
    code: "fr",
    label: "Français",
    shortLabel: "FR",
  },
] as const;

type Locale = (typeof languages)[number]["code"];

export default function LanguageDropdown() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  const currentLanguage =
    languages.find((language) => language.code === locale) ??
    languages[0];

  const changeLanguage = (nextLocale: Locale) => {
    if (nextLocale === locale) return;

    router.replace(pathname, {
      locale: nextLocale,
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="
            h-auto w-full justify-between gap-1
            border-0 bg-transparent px-2 py-1
            text-blue-900 shadow-none
            hover:bg-transparent hover:text-orange-600
            focus-visible:bg-transparent
            focus-visible:outline-none
            focus-visible:ring-0
            focus-visible:ring-offset-0
            data-[state=open]:bg-transparent
            data-[state=open]:text-orange-600
            md:w-auto
          "
          aria-label={`Change language. Current language: ${currentLanguage.label}`}
        >
          <Globe className="size-4" aria-hidden="true" />

          <span className="text-sm font-semibold">
            {currentLanguage.shortLabel}
          </span>

          <ChevronDown className="size-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="min-w-36"
      >
        {languages.map((language) => {
          const isActive = language.code === locale;

          return (
            <DropdownMenuItem
              key={language.code}
              onSelect={() => changeLanguage(language.code)}
              className={`
                cursor-pointer text-xs font-semibold
                hover:text-orange-600
                focus:bg-slate-100 focus:text-orange-600
                data-[highlighted]:bg-slate-100
                data-[highlighted]:text-orange-600
                data-[disabled]:opacity-100
                ${isActive ? "text-orange-600": "text-blue-900" }
              `}
              disabled={isActive}
            >
              <span>{language.label}</span>

              {isActive && (
                <span className="ml-auto text-orange-600">
                  ✓
                </span>
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}