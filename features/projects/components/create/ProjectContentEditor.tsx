"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import WysiwygEditor from "@/components/editor/WysiwygEditor";

type SupportedLocale = "en" | "fr";

interface ProjectContentEditorProps {
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

export default function ProjectContentEditor({
  locale,
  contentEn,
  contentFr,
  onContentEnChange,
  onContentFrChange,
  errors = {},
}: ProjectContentEditorProps) {
  const labels =
    locale === "fr"
      ? {
          english: "Anglais",
          french: "Français",

          englishEditor:
            "Contenu du projet en anglais",

          frenchEditor:
            "Contenu du projet en français",

          englishHint:
            "Rédigez la présentation du projet en anglais.",

          frenchHint:
            "Rédigez la présentation du projet en français.",
        }
      : {
          english: "English",
          french: "French",

          englishEditor:
            "English project content",

          frenchEditor:
            "French project content",

          englishHint:
            "Write the English version of the project.",

          frenchHint:
            "Write the French version of the project.",
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
          {/* English */}
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

          {/* French */}
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

        {/* English content */}
        <TabsContent
          value="en"
          className="mt-5 space-y-2"
        >
          <p className="px-4 text-sm text-slate-500">
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
              className="
                text-sm font-medium
                text-red-600
              "
            >
              {errors.contentEn}
            </p>
          )}
        </TabsContent>

        {/* French content */}
        <TabsContent
          value="fr"
          className="mt-5 space-y-2"
        >
          <p className="px-4 text-sm text-slate-500">
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
              className="
                text-sm font-medium
                text-red-600
              "
            >
              {errors.contentFr}
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}