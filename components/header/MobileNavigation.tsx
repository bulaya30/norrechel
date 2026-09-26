"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useLocale } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import MyDropdown from "./MyDropdown";
import NavigationLinks from "./NavigationLinks";

interface MobileNavigationProps {
  userName?: string;
}

export default function MobileNavigation({
  userName,
}: MobileNavigationProps) {
  const [open, setOpen] = useState(false);
  const locale = useLocale();

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Open navigation menu"
            className="
              size-10 rounded-lg
              text-slate-700
              transition-colors
              hover:bg-slate-100
              hover:text-blue-700
              focus-visible:ring-2
              focus-visible:ring-blue-600
            "
          >
            <Menu className="size-5" aria-hidden="true" />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="right"
          className="
            flex w-[88%] max-w-sm flex-col
            border-l border-slate-200
            bg-white
            px-0
            shadow-2xl
          "
        >
          <SheetHeader className="border-b border-slate-200 px-6 pb-5 pt-6 text-left">
            <SheetTitle className="text-lg font-bold tracking-tight text-slate-950">
              Navigation
            </SheetTitle>

            <SheetDescription className="max-w-xs text-sm leading-6 text-slate-500">
              Browse Norrechel pages and account options.
            </SheetDescription>
          </SheetHeader>

          <nav
            aria-label="Mobile navigation"
            className="flex-1 overflow-y-auto px-4 py-6"
          >
            <NavigationLinks
              mobile
              onNavigate={closeMenu}
            />
          </nav>

          <div className="border-t border-slate-200 bg-slate-50/70 px-6 py-5">
            {userName ? (
              <MyDropdown userName={userName} />
            ) : (
              <Button
                asChild
                className="
                  h-10 w-full rounded-lg
                  bg-slate-950
                  font-semibold text-white
                  shadow-sm
                  transition-all duration-200
                  hover:-translate-y-0.5
                  hover:bg-blue-700
                  hover:shadow-md
                "
              >
                <Link href={`/${locale}/login`}>
                  Login
                </Link>
              </Button>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}