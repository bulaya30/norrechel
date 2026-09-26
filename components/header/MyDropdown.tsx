"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import {
  BookOpen,
  ChevronDown,
  FolderKanban,
  LayoutDashboard,
  LogOut,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MyDropdownProps {
  userName: string;
}

export default function MyDropdown({
  userName,
}: MyDropdownProps) {
  const locale = useLocale();

  const menuItemClass = `
    cursor-pointer rounded-lg
    text-sm font-medium text-slate-700
    transition-colors duration-150
    hover:bg-slate-50 hover:text-blue-700
    focus:bg-slate-50 focus:text-blue-700
    data-[highlighted]:bg-slate-50
    data-[highlighted]:text-blue-700
  `;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="
            h-9 gap-1.5 rounded-lg
            bg-transparent px-2.5
            text-sm font-semibold text-slate-700
            shadow-none
            transition-colors duration-200
            hover:bg-slate-50
            hover:text-blue-700
            focus-visible:bg-slate-50
            focus-visible:ring-2
            focus-visible:ring-blue-600
            focus-visible:ring-offset-2
            data-[state=open]:bg-slate-50
            data-[state=open]:text-blue-700
          "
          aria-label={`Open account menu for ${userName}`}
        >
          <span className="max-w-36 truncate">
            {userName}
          </span>

          <ChevronDown
            className="size-3.5 transition-transform duration-200 group-data-[state=open]:rotate-180"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="
          w-56
          rounded-xl
          border-slate-200
          bg-white
          p-1.5
          shadow-[0_12px_35px_rgb(15_23_42_/_0.12)]
        "
      >
        <DropdownMenuLabel className="px-3 py-2.5">
          <span className="block truncate text-sm font-semibold text-slate-950">
            {userName}
          </span>
          <span className="mt-0.5 block text-xs font-normal text-slate-500">
            Account menu
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuItem asChild>
          <Link
            href={`/${locale}/dashboard`}
            className={menuItemClass}
          >
            <LayoutDashboard
              className="size-4"
              aria-hidden="true"
            />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href={`/${locale}/blogs`}
            className={menuItemClass}
          >
            <BookOpen
              className="size-4"
              aria-hidden="true"
            />
            <span>Articles</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href={`/${locale}/projects`}
            className={menuItemClass}
          >
            <FolderKanban
              className="size-4"
              aria-hidden="true"
            />
            <span>Projects</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1" />

        <DropdownMenuItem
          className="
            cursor-pointer rounded-lg
            text-sm font-medium text-red-600
            transition-colors duration-150
            hover:bg-red-50
            hover:text-red-700
            focus:bg-red-50
            focus:text-red-700
            data-[highlighted]:bg-red-50
            data-[highlighted]:text-red-700
          "
        >
          <LogOut
            className="size-4"
            aria-hidden="true"
          />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}