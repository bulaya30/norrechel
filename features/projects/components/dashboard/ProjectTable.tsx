"use client";

import Link from "next/link";

import {
  ExternalLink,
  MoreHorizontal,
  Pencil,
  Send,
  Trash2,
} from "lucide-react";

import { FaGithub } from "react-icons/fa";

import type { Project } from "@/features/interfaces/project";

import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { readableDate } from "@/lib/dates/utils";

type SupportedLocale = "en" | "fr";

interface ProjectTableProps {
  locale: SupportedLocale;
  projects: Project[];
  title: string;
  description: string;

  onPublish?: (
    projectId: string,
  ) => void;

  onDelete?: (
    projectId: string,
  ) => void;

  isPublishing?: string | null;

  isDeleting?: string | null;
}

export default function ProjectTable({
  locale,
  projects,
  title,
  description,
  onPublish,
  onDelete,
  isPublishing = null,
  isDeleting = null,
}: ProjectTableProps) {
  const labels =
    locale === "fr"
      ? {
          project: "Projet",
          category: "Catégorie",
          status: "Statut",
          date: "Date",
          actions: "Actions",

          draft: "Brouillon",
          published: "Publié",

          edit: "Modifier",
          publish: "Publier",
          delete: "Supprimer",

          viewProject: "Voir le projet",
          github: "GitHub",

          noCategory: "Sans catégorie",
          noDate: "—",

          emptyTitle: "Aucun projet",
          emptyDescription:
            "Aucun projet n’a encore été créé.",

          confirmDelete:
            "Voulez-vous vraiment supprimer ce projet ?",
        }
      : {
          project: "Project",
          category: "Category",
          status: "Status",
          date: "Date",
          actions: "Actions",

          draft: "Draft",
          published: "Published",

          edit: "Edit",
          publish: "Publish",
          delete: "Delete",

          viewProject: "View project",
          github: "GitHub",

          noCategory: "No category",
          noDate: "—",

          emptyTitle: "No projects",
          emptyDescription:
            "No projects have been created yet.",

          confirmDelete:
            "Are you sure you want to delete this project?",
        };

  function getProjectTitle(
    project: Project,
  ): string {
    return (
      project.title?.[locale] ??
      project.title?.en ??
      project.title?.fr ??
      "Untitled project"
    );
  }

  function getProjectSlug(
    project: Project,
  ): string {
    return (
      project.slug?.[locale] ??
      project.slug?.en ??
      project.slug?.fr ??
      ""
    );
  }

  function getCategoryName(
    project: Project,
  ): string {
    if (!project.category) {
      return labels.noCategory;
    }

    return (
      project.category.name ??
      labels.noCategory
    );
  }

  function handlePublish(
    projectId: string,
  ) {
    onPublish?.(projectId);
  }

  function handleDelete(
    projectId: string,
  ) {
    const confirmed =
      window.confirm(
        labels.confirmDelete,
      );

    if (!confirmed) {
      return;
    }

    onDelete?.(projectId);
  }

  const hasProjects =
    projects.length > 0;

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-950">
          {title}
        </CardTitle>

        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        {!hasProjects ? (
          <div
            className="
              flex min-h-52
              flex-col items-center
              justify-center
              border-t border-slate-200
              px-6 py-12 text-center
            "
          >
            <p
              className="
                text-sm font-semibold
                text-slate-900
              "
            >
              {labels.emptyTitle}
            </p>

            <p
              className="
                mt-1 max-w-md
                text-sm text-slate-500
              "
            >
              {labels.emptyDescription}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px]">
              <thead>
                <tr
                  className="
                    border-y border-slate-200
                    bg-slate-50
                  "
                >
                  <th
                    className="
                      px-6 py-3
                      text-left text-xs
                      font-semibold uppercase
                      tracking-wide
                      text-slate-500
                    "
                  >
                    {labels.project}
                  </th>

                  <th
                    className="
                      px-6 py-3
                      text-left text-xs
                      font-semibold uppercase
                      tracking-wide
                      text-slate-500
                    "
                  >
                    {labels.category}
                  </th>

                  <th
                    className="
                      px-6 py-3
                      text-left text-xs
                      font-semibold uppercase
                      tracking-wide
                      text-slate-500
                    "
                  >
                    {labels.status}
                  </th>

                  <th
                    className="
                      px-6 py-3
                      text-left text-xs
                      font-semibold uppercase
                      tracking-wide
                      text-slate-500
                    "
                  >
                    {labels.date}
                  </th>

                  <th
                    className="
                      px-6 py-3
                      text-right text-xs
                      font-semibold uppercase
                      tracking-wide
                      text-slate-500
                    "
                  >
                    {labels.actions}
                  </th>
                </tr>
              </thead>

              <tbody>
                {projects.map((project) => {
                  const projectId =
                    project.id;

                  const projectTitle =
                    getProjectTitle(
                      project,
                    );

                  const projectSlug =
                    getProjectSlug(
                      project,
                    );

                  const categoryName =
                    getCategoryName(
                      project,
                    );

                  const isPublished =
                    project.status ===
                    "published";

                  return (
                    <tr
                      key={
                        projectId ??
                        projectSlug ??
                        projectTitle
                      }
                      className="
                        border-b
                        border-slate-100
                        transition-colors
                        hover:bg-slate-50/70
                      "
                    >
                      {/* Project */}
                      <td className="px-6 py-4">
                        <div className="min-w-0">
                          <p
                            className="
                              max-w-[320px]
                              truncate
                              text-sm font-semibold
                              text-slate-900
                            "
                          >
                            {projectTitle}
                          </p>

                          {projectSlug && (
                            <p
                              className="
                                mt-1 max-w-[320px]
                                truncate text-xs
                                text-slate-500
                              "
                            >
                              {projectSlug}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <span
                          className="
                            text-sm
                            text-slate-600
                          "
                        >
                          {categoryName}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            isPublished
                              ? "default"
                              : "secondary"
                          }
                          className={
                            isPublished
                              ? `
                                bg-emerald-100
                                text-emerald-700
                                hover:bg-emerald-100
                              `
                              : `
                                bg-amber-100
                                text-amber-700
                                hover:bg-amber-100
                              `
                          }
                        >
                          {isPublished
                            ? labels.published
                            : labels.draft}
                        </Badge>
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4">
                        <span
                          className="
                            whitespace-nowrap
                            text-sm
                            text-slate-500
                          "
                        >
                          {project.date
                            ? readableDate(
                                project.date,
                              )
                            : labels.noDate}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex justify-end">
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              asChild
                            >
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                aria-label={
                                  labels.actions
                                }
                                disabled={
                                  isPublishing !== null ||
                                  isDeleting !== null || false
                                }
                              >
                                <MoreHorizontal
                                  className="size-4"
                                  aria-hidden="true"
                                />
                              </Button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                              align="end"
                              className="w-44"
                            >
                              {/* Edit */}
                              {projectId && (
                                <DropdownMenuItem
                                  asChild
                                >
                                  <Link
                                    href={`
                                      /${locale}/dashboard/projects/${projectId}/edit
                                    `}
                                  >
                                    <Pencil
                                      className="size-4"
                                    />

                                    {labels.edit}
                                  </Link>
                                </DropdownMenuItem>
                              )}

                              {/* Publish */}
                              {!isPublished && (
                                <DropdownMenuItem
                                  disabled={
                                    isPublishing === project.id
                                  }
                                  onSelect={(event) => {
                                    event.preventDefault();

                                    if (!project.id) {
                                      return;
                                    }

                                    onPublish?.(project.id);
                                  }}
                                >
                                  <Send className="size-4" />

                                  {isPublishing === project.id
                                    ? locale === "fr"
                                      ? "Publication..."
                                      : "Publishing..."
                                    : labels.publish}
                                </DropdownMenuItem>
                              )}

                              {/* Live project */}
                              {isPublished &&
                                project.live_url && (
                                  <DropdownMenuItem
                                    asChild
                                  >
                                    <a
                                      href={
                                        project.live_url
                                      }
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      <ExternalLink
                                        className="size-4"
                                      />

                                      {
                                        labels.viewProject
                                      }
                                    </a>
                                  </DropdownMenuItem>
                                )}

                              {/* GitHub */}
                              {project.github_url && (
                                <DropdownMenuItem
                                  asChild
                                >
                                  <a
                                    href={
                                      project.github_url
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                  >
                                    <FaGithub
                                      className="size-4"
                                    />

                                    {labels.github}
                                  </a>
                                </DropdownMenuItem>
                              )}

                              {projectId &&
                                onDelete && (
                                  <>
                                    <DropdownMenuSeparator />

                                    <DropdownMenuItem
                                      disabled={
                                        isDeleting === project.id
                                      }
                                      className="
                                        text-red-600
                                        focus:text-red-600
                                      "
                                      onSelect={(event) => {
                                        event.preventDefault();

                                        if (!project.id) {
                                          return;
                                        }

                                        const confirmed =
                                          window.confirm(
                                            labels.confirmDelete,
                                          );

                                        if (!confirmed) {
                                          return;
                                        }

                                        onDelete?.(project.id);
                                      }}
                                    >
                                      <Trash2 className="size-4" />

                                      {isDeleting === project.id
                                        ? locale === "fr"
                                          ? "Suppression..."
                                          : "Deleting..."
                                        : labels.delete}
                                    </DropdownMenuItem>
                                  </>
                                )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}