"use client";

import { useState } from "react";

import {
  Link as LinkIcon,
  Plus,
  X,
} from "lucide-react";

import { FaGithub } from "react-icons/fa";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import { Textarea } from "@/components/ui/textarea";

type SupportedLocale = "en" | "fr";

interface ProjectDetailsFieldsProps {
  locale: SupportedLocale;

  detailsEn: string;
  detailsFr: string;

  techStack: string[];

  liveUrl: string;
  githubUrl: string;

  onDetailsEnChange: ( value: string,) => void;

  onDetailsFrChange: ( value: string,) => void;

  onTechStackChange: ( value: string[],) => void;

  onLiveUrlChange: (
    value: string,
  ) => void;

  onGithubUrlChange: (
    value: string,
  ) => void;

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
  const [technology, setTechnology] = useState("");
  const labels =
    locale === "fr"
      ? {
          detailsEnglish: "Détails du projet en anglais",
          detailsFrench: "Détails du projet en français",
          detailsEnglishHint: "Décrivez les caractéristiques, fonctionnalités ou objectifs principaux du projet.",
          detailsFrenchHint: "Décrivez les caractéristiques, fonctionnalités ou objectifs principaux du projet en français.",
          english: "Anglais",
          french: "Français",
          technologies: "Technologies utilisées",
          technologiesHint: "Ajoutez les technologies et outils utilisés pour réaliser ce projet.",
          technologyPlaceholder: "Ex. Next.js",
          addTechnology: "Ajouter",
          liveUrl: "URL du projet",
          liveUrlHint: "Lien vers la version publique ou déployée du projet.",
          liveUrlPlaceholder: "https://example.com",
          githubUrl: "Dépôt GitHub",
          githubUrlHint: "Lien vers le dépôt GitHub du projet.",
          githubUrlPlaceholder: "https://github.com/username/project",
          removeTechnology: "Supprimer",
        }
      : {
          detailsEnglish: "English project details",
          detailsFrench: "French project details",
          detailsEnglishHint: "Describe the project's main features, functionality, or objectives.",
          detailsFrenchHint: "Describe the project's main features, functionality, or objectives in French.",
          english: "English",
          french: "French",
          technologies: "Technologies used",
          technologiesHint: "Add the technologies and tools used to build this project.",
          technologyPlaceholder: "e.g. Next.js",
          addTechnology: "Add",
          liveUrl: "Live project URL",
          liveUrlHint: "Link to the public or deployed version of the project.",
          liveUrlPlaceholder: "https://example.com",
          githubUrl: "GitHub repository",
          githubUrlHint: "Link to the project's GitHub repository.",
          githubUrlPlaceholder: "https://github.com/username/project",
          removeTechnology: "Remove",
        };

  function addTechnology() {
    const value = technology.trim();

    if (!value) {
      return;
    }

    /*
     * Prevent duplicate technologies
     * while preserving the original
     * casing entered by the user.
     */
    const alreadyExists = techStack.some(
        (item) =>
          item.toLowerCase() ===
          value.toLowerCase(),
      );

    if (alreadyExists) {
      setTechnology("");
      return;
    }

    onTechStackChange([
      ...techStack,
      value,
    ]);

    setTechnology("");
  }

  function removeTechnology(
    technologyToRemove: string,
  ) {
    onTechStackChange(
      techStack.filter(
        (item) =>
          item !==
          technologyToRemove,
      ),
    );
  }

  function handleTechnologyKeyDown(
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (
      event.key === "Enter"
    ) {
      event.preventDefault();

      addTechnology();
    }
  }

  return (
    <div className="space-y-8">

      <div className="space-y-4">
        <Tabs
          defaultValue="en"
          className="w-full"
        >
          <TabsList
            aria-label={
              locale === "fr"
                ? "Langue des détails du projet"
                : "Project details language"
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
                text-sm font-semibold
                text-slate-500
                shadow-none

                data-[state=active]:
                  border-b-blue-700
                data-[state=active]:
                  bg-transparent
                data-[state=active]:
                  text-blue-700
                data-[state=active]:
                  shadow-none
              "
            >
              {labels.english}

              {errors.detailsEn && (
                <span
                  className="
                    ml-2 size-2
                    rounded-full
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
                text-sm font-semibold
                text-slate-500
                shadow-none

                data-[state=active]:
                  border-b-blue-700

                data-[state=active]:
                  bg-transparent

                data-[state=active]:
                  text-blue-700

                data-[state=active]:
                  shadow-none
              "
            >
              {labels.french}

              {errors.detailsFr && (
                <span
                  className="
                    ml-2 size-2
                    rounded-full
                    bg-red-500
                  "
                  aria-hidden="true"
                />
              )}
            </TabsTrigger>
          </TabsList>

          {/* English */}
          <TabsContent
            value="en"
            className="mt-5 space-y-2"
          >
            <p className="text-sm text-slate-500">
              {labels.detailsEnglishHint}
            </p>

            <Textarea
              value={detailsEn}
              onChange={(event) =>
                onDetailsEnChange(
                  event.target.value,
                )
              }
              aria-label={
                labels.detailsEnglish
              }
              aria-invalid={
                Boolean(
                  errors.detailsEn,
                )
              }
              rows={5}
              className="
                resize-y
                border-slate-300
                focus-visible:ring-blue-600
              "
            />

            {errors.detailsEn && (
              <p
                role="alert"
                className="
                  text-sm font-medium
                  text-red-600
                "
              >
                {errors.detailsEn}
              </p>
            )}
          </TabsContent>

          {/* French */}
          <TabsContent
            value="fr"
            className="mt-5 space-y-2"
          >
            <p className="text-sm text-slate-500">
              {labels.detailsFrenchHint}
            </p>

            <Textarea
              value={detailsFr}
              onChange={(event) =>
                onDetailsFrChange(
                  event.target.value,
                )
              }
              aria-label={
                labels.detailsFrench
              }
              aria-invalid={
                Boolean(
                  errors.detailsFr,
                )
              }
              rows={5}
              className="
                resize-y
                border-slate-300
                focus-visible:ring-blue-600
              "
            />

            {errors.detailsFr && (
              <p
                role="alert"
                className="
                  text-sm font-medium
                  text-red-600
                "
              >
                {errors.detailsFr}
              </p>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* -------------------------------- */}
      {/* Technologies */}
      {/* -------------------------------- */}

      <div className="space-y-3">
        <div>
          <h3
            className="
              text-sm font-semibold
              text-slate-900
            "
          >
            {labels.technologies}
          </h3>

          <p
            className="
              mt-1 text-sm
              text-slate-500
            "
          >
            {labels.technologiesHint}
          </p>
        </div>

        <div className="flex gap-2">
          <Input
            value={technology}
            onChange={(event) =>
              setTechnology(
                event.target.value,
              )
            }
            onKeyDown={
              handleTechnologyKeyDown
            }
            placeholder={
              labels.technologyPlaceholder
            }
            className="
              border-slate-300
              focus-visible:ring-blue-600
            "
          />

          <Button
            type="button"
            variant="outline"
            onClick={addTechnology}
            // disabled={
            //   !technology.trim()
            // }
            className="
              shrink-0
              border-slate-300
            "
          >
            <Plus
              className="size-4"
              aria-hidden="true"
            />

            {labels.addTechnology}
          </Button>
        </div>

        {techStack.length > 0 && (
          <div
            className="
              flex flex-wrap gap-2
              rounded-xl
              border border-slate-200
              bg-slate-50
              p-3
            "
          >
            {techStack.map(
              (item) => (
                <span
                  key={item}
                  className="
                    inline-flex
                    items-center gap-1.5
                    rounded-full
                    border
                    border-slate-200
                    bg-white
                    px-3 py-1.5
                    text-sm font-medium
                    text-slate-700
                  "
                >
                  {item}

                  <button
                    type="button"
                    onClick={() =>
                      removeTechnology(
                        item,
                      )
                    }
                    aria-label={`${labels.removeTechnology} ${item}`}
                    className="
                      rounded-full
                      p-0.5
                      text-slate-400
                      transition-colors
                      hover:bg-slate-100
                      hover:text-red-600
                    "
                  >
                    <X
                      className="size-3.5"
                      aria-hidden="true"
                    />
                  </button>
                </span>
              ),
            )}
          </div>
        )}

        {errors.techStack && (
          <p
            role="alert"
            className="
              text-sm font-medium
              text-red-600
            "
          >
            {errors.techStack}
          </p>
        )}
      </div>

      {/* -------------------------------- */}
      {/* Project links */}
      {/* -------------------------------- */}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Live URL */}
        <div className="space-y-2">
          <label
            htmlFor="project-live-url"
            className="
              flex items-center gap-2
              text-sm font-semibold
              text-slate-900
            "
          >
            <LinkIcon
              className="
                size-4 text-blue-700
              "
              aria-hidden="true"
            />

            {labels.liveUrl}
          </label>

          <p
            className="
              text-sm text-slate-500
            "
          >
            {labels.liveUrlHint}
          </p>

          <Input
            id="project-live-url"
            type="url"
            value={liveUrl}
            onChange={(event) =>
              onLiveUrlChange(
                event.target.value,
              )
            }
            placeholder={
              labels.liveUrlPlaceholder
            }
            aria-invalid={
              Boolean(
                errors.liveUrl,
              )
            }
            className="
              border-slate-300
              focus-visible:ring-blue-600
            "
          />

          {errors.liveUrl && (
            <p
              role="alert"
              className="
                text-sm font-medium
                text-red-600
            "
            >
              {errors.liveUrl}
            </p>
          )}
        </div>

        {/* GitHub URL */}
        <div className="space-y-2">
          <label
            htmlFor="project-github-url"
            className="
              flex items-center gap-2
              text-sm font-semibold
              text-slate-900
            "
          >
            <FaGithub
              className="
                size-4 text-slate-700
              "
              aria-hidden="true"
            />

            {labels.githubUrl}
          </label>

          <p
            className="
              text-sm text-slate-500
            "
          >
            {labels.githubUrlHint}
          </p>

          <Input
            id="project-github-url"
            type="url"
            value={githubUrl}
            onChange={(event) =>
              onGithubUrlChange(
                event.target.value,
              )
            }
            placeholder={
              labels.githubUrlPlaceholder
            }
            aria-invalid={
              Boolean(
                errors.githubUrl,
              )
            }
            className="
              border-slate-300
              focus-visible:ring-blue-600
            "
          />

          {errors.githubUrl && (
            <p
              role="alert"
              className="
                text-sm font-medium
                text-red-600
              "
            >
              {errors.githubUrl}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}