import Link from "next/link";
import {
  ArrowLeft,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type ContentDeletedProps = {
  locale: "en" | "fr";
  component: string
};

export default function ContentDeleted({
  locale,
  component,
}: ContentDeletedProps) {
  const isArticle = component.toLocaleLowerCase() === "article";

  const content = locale === "fr"
      ? {
          title: isArticle
            ? "Article supprimé"
            : `${component.toLocaleLowerCase()} supprimé`,

          description: isArticle
            ? "Cet article a été supprimé et n’est plus disponible pour modification."
            : `Ce ${component.toLocaleLowerCase()} a été supprimé et n’est plus disponible pour modification.`,

          back: `Retour aux${component.toLocaleLowerCase()}s`,

          href: `/${locale}/dashboard/${component}s`,
        }
      : {
          title: `${component} deleted`,

          description: `The ${component.toLocaleLowerCase()} you're looking for has been deleted and is no longer available for editing.`,
           
          back: `Back to ${component.toLocaleLowerCase()}s`,

          href: `/${locale}/dashboard/${component}s`,

        };

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <div
          className="
            mx-auto flex size-16 items-center
            justify-center rounded-2xl
            bg-red-50 text-red-600
            ring-1 ring-red-100
          "
        >
          <Trash2
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