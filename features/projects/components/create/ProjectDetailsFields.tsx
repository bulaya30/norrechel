"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Link as LinkIcon,
  Plus,
  X,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";

import type { SupportedLocale } from "@/lib/dates/localizedValue";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ProjectDetailsFieldsProps {
  locale: SupportedLocale;

  detailsEn: string;
  detailsFr: string;

  techStack: string[];

  liveUrl: string;
  githubUrl: string;

  onDetailsEnChange: (value: string) => void;
  onDetailsFrChange: (value: string) => void;
  onTechStackChange: (value: string[]) => void;
  onLiveUrlChange: (value: string) => void;
  onGithubUrlChange: (value: string) => void;

  errors?: {
    detailsEn?: string;
    detailsFr?: string;
    techStack?: string;
    liveUrl?: string;
    githubUrl?: string;
  };
}

export default function ProjectDetailsFields({
  locale,
  detailsEn,
  detailsFr,
  techStack,
  liveUrl,
  githubUrl,
  onDetailsEnChange,
  onDetailsFrChange,
  onTechStackChange,
  onLiveUrlChange,
  onGithubUrlChange,
  errors = {},
}: ProjectDetailsFieldsProps) {
  const t = useTranslations("ProjectDetailsFields");
  const [technology, setTechnology] = useState("");

  function addTechnology() {
    const value = technology.trim();

    if (!value) return;

    // Prevent duplicates without changing the entered casing.
    const alreadyExists = techStack.some(
      (item) => item.toLowerCase() === value.toLowerCase(),
    );

    if (alreadyExists) {
      setTechnology("");
      return;
    }

    onTechStackChange([...techStack, value]);
    setTechnology("");
  }

  function removeTechnology(technologyToRemove: string) {
    onTechStackChange(
      techStack.filter((item) => item !== technologyToRemove),
    );
  }

  function handleTechnologyKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === "Enter") {
      event.preventDefault();
      addTechnology();
    }
  }

  return (
    <div className="space-y-8">
      {/* Project details in English and French */}
      <div className="space-y-4">
        <Tabs defaultValue="en" className="w-full">
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

              {errors.detailsEn && (
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

              {errors.detailsFr && (
                <span
                  className="ml-2 size-2 rounded-full bg-red-500"
                  aria-hidden="true"
                />
              )}
            </TabsTrigger>
          </TabsList>

          {/* English details */}
          <TabsContent value="en" className="mt-5 space-y-2">
            <p className="text-sm text-slate-500">
              {t("detailsEnglishHint")}
            </p>

            <Textarea
              value={detailsEn}
              onChange={(event) =>
                onDetailsEnChange(event.target.value)
              }
              aria-label={t("detailsEnglish")}
              aria-invalid={Boolean(errors.detailsEn)}
              aria-describedby={
                errors.detailsEn
                  ? "project-details-en-error"
                  : undefined
              }
              rows={5}
              className="
                resize-y border-slate-300
                focus-visible:ring-blue-600
              "
            />

            {errors.detailsEn && (
              <p
                id="project-details-en-error"
                role="alert"
                className="text-sm font-medium text-red-600"
              >
                {errors.detailsEn}
              </p>
            )}
          </TabsContent>

          {/* French details */}
          <TabsContent value="fr" className="mt-5 space-y-2">
            <p className="text-sm text-slate-500">
              {t("detailsFrenchHint")}
            </p>

            <Textarea
              value={detailsFr}
              onChange={(event) =>
                onDetailsFrChange(event.target.value)
              }
              aria-label={t("detailsFrench")}
              aria-invalid={Boolean(errors.detailsFr)}
              aria-describedby={
                errors.detailsFr
                  ? "project-details-fr-error"
                  : undefined
              }
              rows={5}
              className="
                resize-y border-slate-300
                focus-visible:ring-blue-600
              "
            />

            {errors.detailsFr && (
              <p
                id="project-details-fr-error"
                role="alert"
                className="text-sm font-medium text-red-600"
              >
                {errors.detailsFr}
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Technologies */}
      <div className="space-y-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">
            {t("technologies")}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {t("technologiesHint")}
          </p>
        </div>

        <div className="flex gap-2">
          <Input
            value={technology}
            onChange={(event) => setTechnology(event.target.value)}
            onKeyDown={handleTechnologyKeyDown}
            placeholder={t("technologyPlaceholder")}
            aria-label={t("technologyInputLabel")}
            className="
              border-slate-300
              focus-visible:ring-blue-600
            "
          />

          <Button
            type="button"
            variant="outline"
            onClick={addTechnology}
            className="shrink-0 border-slate-300"
          >
            <Plus className="size-4" aria-hidden="true" />
            {t("addTechnology")}
          </Button>
        </div>

        {techStack.length > 0 && (
          <div
            className="
              flex flex-wrap gap-2 rounded-xl
              border border-slate-200 bg-slate-50 p-3
            "
          >
            {techStack.map((item) => (
              <span
                key={item}
                className="
                  inline-flex items-center gap-1.5
                  rounded-full border border-slate-200
                  bg-white px-3 py-1.5
                  text-sm font-medium text-slate-700
                "
              >
                {item}

                <button
                  type="button"
                  onClick={() => removeTechnology(item)}
                  aria-label={`${t("removeTechnology")} ${item}`}
                  className="
                    rounded-full p-0.5 text-slate-400
                    transition-colors hover:bg-slate-100
                    hover:text-red-600
                  "
                >
                  <X className="size-3.5" aria-hidden="true" />
                </button>
              </span>
            ))}
          </div>
        )}

        {errors.techStack && (
          <p role="alert" className="text-sm font-medium text-red-600">
            {errors.techStack}
          </p>
        )}
      </div>

      {/* Project links */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Live project URL */}
        <div className="space-y-2">
          <label
            htmlFor="project-live-url"
            className="flex items-center gap-2 text-sm font-semibold text-slate-900"
          >
            <LinkIcon
              className="size-4 text-blue-700"
              aria-hidden="true"
            />
            {t("liveUrl")}
          </label>

          <p className="text-sm text-slate-500">
            {t("liveUrlHint")}
          </p>

          <Input
            id="project-live-url"
            type="url"
            value={liveUrl}
            onChange={(event) =>
              onLiveUrlChange(event.target.value)
            }
            placeholder={t("liveUrlPlaceholder")}
            aria-invalid={Boolean(errors.liveUrl)}
            aria-describedby={
              errors.liveUrl ? "project-live-url-error" : undefined
            }
            className="
              border-slate-300
              focus-visible:ring-blue-600
            "
          />

          {errors.liveUrl && (
            <p
              id="project-live-url-error"
              role="alert"
              className="text-sm font-medium text-red-600"
            >
              {errors.liveUrl}
            </p>
          )}
        </div>

        {/* GitHub repository URL */}
        <div className="space-y-2">
          <label
            htmlFor="project-github-url"
            className="flex items-center gap-2 text-sm font-semibold text-slate-900"
          >
            <FaGithub
              className="size-4 text-slate-700"
              aria-hidden="true"
            />
            {t("githubUrl")}
          </label>

          <p className="text-sm text-slate-500">
            {t("githubUrlHint")}
          </p>

          <Input
            id="project-github-url"
            type="url"
            value={githubUrl}
            onChange={(event) =>
              onGithubUrlChange(event.target.value)
            }
            placeholder={t("githubUrlPlaceholder")}
            aria-invalid={Boolean(errors.githubUrl)}
            aria-describedby={
              errors.githubUrl
                ? "project-github-url-error"
                : undefined
            }
            className="
              border-slate-300
              focus-visible:ring-blue-600
            "
          />

          {errors.githubUrl && (
            <p
              id="project-github-url-error"
              role="alert"
              className="text-sm font-medium text-red-600"
            >
              {errors.githubUrl}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}