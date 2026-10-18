import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { SupportedLocale } from "@/lib/dates/localizedValue";
import { ArrowLeft, FileQuestion } from "lucide-react";

import { Button } from "@/components/ui/button";

type ContentNotFoundProps = {
  locale: SupportedLocale;
  component: string;
};

export default async function ContentNotFound({
  locale,
  component,
}: ContentNotFoundProps) {
  const t = await getTranslations({
    locale,
    namespace: "ContentNotFound",
  });

  const normalizedComponent = component.toLowerCase();
  const isArticle = normalizedComponent === "article";

  const title = t("title", {
    component,
  });

  const description = isArticle
    ? t("articleDescription")
    : t("description", {
        component: normalizedComponent,
      });

  const back = t("back", {
    component: normalizedComponent,
  });

  const href = `/${locale}/dashboard/${normalizedComponent}s`;

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <div
          className="
            mx-auto flex size-16 items-center
            justify-center rounded-2xl
            bg-slate-100 text-slate-500
            ring-1 ring-slate-200
          "
        >
          <FileQuestion className="size-7" aria-hidden="true" />
        </div>

        <h1
          className="
            mt-6 text-2xl font-bold
            text-slate-950
          "
        >
          {title}
        </h1>

        <p
          className="
            mt-3 text-sm leading-6
            text-slate-500
          "
        >
          {description}
        </p>

        <Button asChild className="mt-6">
          <Link href={href}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            {back}
          </Link>
        </Button>
      </div>
    </div>
  );
}