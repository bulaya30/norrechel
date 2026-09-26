import Link from "next/link";
import {
  ArrowLeft,
  FileQuestion,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type ContentNotFoundProps = {
  locale: "en" | "fr";
  component: string;
};

export default function ContentNotFound({
  locale,
  component,
}: ContentNotFoundProps) {
  const isArticle = component.toLocaleLowerCase() === "article";

  const content = locale === "fr"
      ? {
          title: `${component} introuvable`,

          description: isArticle
            ? "L’article que vous recherchez n’existe pas ou a peut-être été supprimé."
            : `Le ${component.toLocaleLowerCase()} que vous recherchez n’existe pas ou a peut-être été supprimé.`,

          back: `Retour aux ${component.toLocaleLowerCase()}s`,

          href: `/${locale}/dashboard/${component.toLocaleLowerCase()}s`,
        }
      : {
          title: `${component} not found`,

          description: `The ${component.toLocaleLowerCase()} you're looking for does not exist or may have been deleted.`,

          back: `Back to ${component.toLocaleLowerCase()}s`,

          href: `/${locale}/dashboard/${component.toLocaleLowerCase()}s`,
        };

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
          <FileQuestion
            className="size-7"
            aria-hidden="true"
          />
        </div>

        <h1
          className="
            mt-6 text-2xl font-bold
            text-slate-950
          "
        >
          {content.title}
        </h1>

        <p
          className="
            mt-3 text-sm leading-6
            text-slate-500
          "
        >
          {content.description}
        </p>

        <Button
          asChild
          className="mt-6"
        >
          <Link href={content.href}>
            <ArrowLeft
              className="size-4"
              aria-hidden="true"
            />

            {content.back}
          </Link>
        </Button>
      </div>
    </div>
  );
}