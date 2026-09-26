"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";

import { navItems } from "./navigation";

interface NavigationLinksProps {
  mobile?: boolean;
  onNavigate?: () => void;
}

export default function NavigationLinks({
  mobile = false,
  onNavigate,
}: NavigationLinksProps) {
  const pathname = usePathname();
  const locale = useLocale();

  const normalizedPathname =
    pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "") || "/";

  return (
    <ul
      className={
        mobile
          ? "flex flex-col gap-1"
          : "flex items-center gap-1"
      }
    >
      {navItems.map((item) => {
        const isActive =
          item.path === "/"
            ? normalizedPathname === "/"
            : normalizedPathname === item.path ||
              normalizedPathname.startsWith(`${item.path}/`);

        const href =
          item.path === "/"
            ? `/${locale}`
            : `/${locale}${item.path}`;

        return (
          <li key={item.path}>
            <Link
              href={href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={[
                "group relative block text-sm font-semibold",
                "transition-colors duration-200",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-blue-600 focus-visible:ring-offset-2",
                mobile
                  ? "rounded-lg px-3 py-3"
                  : "px-3 py-2.5",
                isActive
                  ? mobile
                    ? "bg-orange-50 text-orange-600"
                    : "text-orange-600"
                  : mobile
                    ? "text-slate-700 hover:bg-slate-50 hover:text-orange-600"
                    : "text-slate-600 hover:text-slate-950",
              ].join(" ")}
            >
              {item.name}

              {/* Desktop active indicator */}
              {!mobile && (
                <span
                  aria-hidden="true"
                  className={[
                    "absolute inset-x-3 -bottom-[1px] h-0.5",
                    "origin-center rounded-full bg-orange-600",
                    "transition-transform duration-200",
                    isActive
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100",
                  ].join(" ")}
                />
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}