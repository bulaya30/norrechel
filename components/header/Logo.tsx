import Image from "next/image";
import Link from "next/link";
import { getLocale } from "next-intl/server";

export default async function Logo() {
  const locale = await getLocale();

  return (
    <Link
      href={`/${locale}`}
      aria-label="Norrechel home"
      className="
        group flex items-center gap-2.5 rounded-lg
        text-slate-950
        transition-colors duration-200
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-blue-600
        focus-visible:ring-offset-2
      "
    >
      <Image
        src="/img/logo.png"
        alt=""
        width={52}
        height={52}
        priority
        className="
          size-11 object-contain
          transition-transform duration-200
          group-hover:scale-[1.03]
        "
      />

      <span
        className="
          hidden text-xl font-bold tracking-tight
          text-slate-950
          transition-colors duration-200
          group-hover:text-blue-700
          sm:inline
        "
      >
        Norrechel
      </span>
    </Link>
  );
}