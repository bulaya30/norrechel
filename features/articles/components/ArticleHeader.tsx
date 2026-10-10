import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { getTranslations } from "next-intl/server";

interface ArticleHeaderProps {
  title: string;
  category?: string;
  excerpt?: string;
  imageUrl?: string;
  imageAlt?: string;
}

export default async function ArticleHeader({
  title,
  category,
  excerpt,
  imageUrl,
  imageAlt,
}: ArticleHeaderProps) {
  const t = await getTranslations("Blogs.ArticleHeader");

  return (
    <header className="mx-auto w-full max-w-6xl">
      <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="max-w-4xl">
          {category && (
            <div className="mb-7 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-px w-10 bg-blue-600"
              />

              <span className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700">
                {category}
              </span>
            </div>
          )}

          <h1
            className="
              max-w-4xl
              text-4xl font-bold
              leading-[1.02]
              tracking-[-0.045em]
              text-slate-950
              sm:text-5xl
              md:text-6xl
              lg:text-7xl
            "
          >
            {title}
          </h1>

          {excerpt && (
            <p
              className="
                mt-7
                max-w-3xl
                text-base
                leading-7
                text-slate-600
                sm:text-lg
                sm:leading-8
              "
            >
              {excerpt}
            </p>
          )}
        </div>

        <div className="hidden lg:flex lg:flex-col lg:items-center lg:gap-3">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">
            {t("label")}
          </span>

          <div className="flex size-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500">
            <ArrowDown
              className="size-4"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      {imageUrl && (
        <figure className="group relative mt-12 overflow-hidden rounded-md bg-slate-100 sm:mt-16 lg:rounded-md">
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={imageUrl}
              alt={imageAlt ?? title}
              fill
              priority
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1152px"
              className="
                object-cover
                transition-transform
                duration-700
                ease-out
                group-hover:scale-[1.015]
              "
            />

            <div
              aria-hidden="true"
              className="
                absolute inset-0
                bg-gradient-to-t
                from-slate-950/10
                via-transparent
                to-transparent
              "
            />
          </div>
        </figure>
      )}
    </header>
  );
}