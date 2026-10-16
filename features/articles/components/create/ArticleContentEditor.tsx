
"use client";

import { useTranslations } from "next-intl";
import type { SupportedLocale } from "@/lib/dates/localizedValue";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import WysiwygEditor from "@/components/editor/WysiwygEditor";

interface ArticleContentEditorProps {
  locale: SupportedLocale;

  contentEn: string;
  contentFr: string;

  onContentEnChange: (value: string) => void;
  onContentFrChange: (value: string) => void;

  errors?: {
    contentEn?: string;
    contentFr?: string;
  };
}

export default function ArticleContentEditor({
  locale,
  contentEn,
  contentFr,
  onContentEnChange,
  onContentFrChange,
  errors = {},
}: ArticleContentEditorProps) {
  const t = useTranslations("ArticleContentEditor");

  return (
    <div className="space-y-4">
      <Tabs
        defaultValue="en"
        className="w-full bg-blue-50"
      >
        <TabsList
          aria-label={t("contentLanguage")}
          className="
            h-auto w-full justify-start
            rounded-none border-0 border-b
            border-slate-200 bg-transparent p-0
          "
        >
          <TabsTrigger
            value="en"
            className="
              rounded-none border-b-2
              border-transparent px-4 py-3
              text-sm font-semibold text-slate-500
              shadow-none
              data-[state=active]:border-b-blue-700
              data-[state=active]:bg-transparent
              data-[state=active]:text-blue-700
              data-[state=active]:shadow-none
            "
          >
            {t("english")}

            {errors.contentEn && (
              <span
                className="ml-2 size-2 rounded-full bg-red-500"
                aria-hidden="true"
              />
            )}
          </TabsTrigger>

          <TabsTrigger
            value="fr"
            className="
              rounded-none border-b-2
              border-transparent px-4 py-3
              text-sm font-semibold text-slate-500
              shadow-none
              data-[state=active]:border-b-blue-700
              data-[state=active]:bg-transparent
              data-[state=active]:text-blue-700
              data-[state=active]:shadow-none
            "
          >
            {t("french")}

            {errors.contentFr && (
              <span
                className="ml-2 size-2 rounded-full bg-red-500"
                aria-hidden="true"
              />
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="en"
          className="mt-5 space-y-2"
        >
          <p className="px-4 text-sm text-slate-500">
            {t("englishHint")}
          </p>

          <WysiwygEditor
            value={contentEn}
            onChange={onContentEnChange}
            ariaLabel={t("englishEditor")}
          />

          {errors.contentEn && (
            <p
              role="alert"
              className="text-sm font-medium text-red-600"
            >
              {errors.contentEn}
            </p>
          )}
        </TabsContent>

        <TabsContent
          value="fr"
          className="mt-5 space-y-2"
        >
          <p className="px-4 text-sm text-slate-500">
            {t("frenchHint")}
          </p>

          <WysiwygEditor
            value={contentFr}
            onChange={onContentFrChange}
            ariaLabel={t("frenchEditor")}
          />

          {errors.contentFr && (
            <p
              role="alert"
              className="text-sm font-medium text-red-600"
            >
              {errors.contentFr}
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
