"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import WysiwygEditor from "@/components/editor/WysiwygEditor";

type SupportedLocale = "en" | "fr";

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
  const labels =
    locale === "fr"
      ? {
          english: "Anglais",
          french: "Français",
          englishEditor: "Contenu de l’article en anglais",
          frenchEditor: "Contenu de l’article en français",
          englishHint: "Rédigez la version anglaise de l’article.",
          frenchHint: "Rédigez la version française de l’article.",
        }
      : {
          english: "English",
          french: "French",
          englishEditor: "English article content",
          frenchEditor: "French article content",
          englishHint:
            "Write the English version of the article.",
          frenchHint:
            "Write the French version of the article.",
        };

  return (
    <div className="space-y-4">
      <Tabs
        defaultValue="en"
        className="w-full bg-blue-50"
      >
        <TabsList
          aria-label={
            locale === "fr"
              ? "Langue du contenu"
              : "Content language"
          }
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
            {labels.english}

            {errors.contentEn && (
              <span
                className="
                  ml-2 size-2 rounded-full
                  bg-red-500
                "
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
            {labels.french}

            {errors.contentFr && (
              <span
                className="
                  ml-2 size-2 rounded-full
                  bg-red-500
                "
                aria-hidden="true"
              />
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="en"
          className="mt-5 space-y-2"
        >
          <p className="text-sm text-slate-500 px-4">
            {labels.englishHint}
          </p>

          <WysiwygEditor
            value={contentEn}
            onChange={onContentEnChange}
            ariaLabel={labels.englishEditor}
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
          <p className="text-sm text-slate-500 px-4">
            {labels.frenchHint}
          </p>

          <WysiwygEditor
            value={contentFr}
            onChange={onContentFrChange}
            ariaLabel={labels.frenchEditor}
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