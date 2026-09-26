
"use client";

import { useMemo, useState } from "react";

import ProjectToolbar from "@/components/dashboard/CustomToolbar";
import ProjectList from "./ProjectList";

import type {
  Lang,
  Project,
} from "@/features/interfaces/project";

type SupportedLocale = "en" | "fr";

interface CategoryOption {
  id: string;
  name: string;
}

interface ProjectManagerProps {
  projects: Project[];
  categories?: CategoryOption[];
  locale: SupportedLocale;
}

function getLocalizedValue(
  value: Lang,
  locale: SupportedLocale,
): string {
  return value[locale];
}

function getProjectViewCount(
  project: Project,
): number {
  if (Array.isArray(project.views)) {
    return project.views.length;
  }

  return 0;
}

function getProjectDate(
  project: Project,
): number {
  const value =
    project.publishedAt ??
    project.createdAt ??
    project.updatedAt ??
    project.date;

  if (!value) {
    return 0;
  }

  if (
    typeof value === "object" &&
    "toMillis" in value &&
    typeof value.toMillis === "function"
  ) {
    return value.toMillis();
  }

  if (
    typeof value === "object" &&
    "_seconds" in value &&
    typeof value._seconds === "number"
  ) {
    return value._seconds * 1000;
  }

  if (
    typeof value === "object" &&
    "seconds" in value &&
    typeof value.seconds === "number"
  ) {
    return value.seconds * 1000;
  }

  const parsed = new Date(
    value as unknown as string,
  ).getTime();

  return Number.isNaN(parsed)
    ? 0
    : parsed;
}

export default function ProjectManager({
  projects,
  categories = [],
  locale,
}: ProjectManagerProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");

  const filteredProjects = useMemo(() => {
    let result = Array.isArray(projects)
      ? [...projects]
      : [];

    const normalizedSearch =
      search.trim().toLowerCase();

    /*
     * -------------------------------------------
     * Search
     * -------------------------------------------
     */

    if (normalizedSearch) {
      result = result.filter((project) => {
        const title = getLocalizedValue(
          project.title,
          locale,
        ).toLowerCase();

        const content = getLocalizedValue(
          project.content,
          locale,
        ).toLowerCase();

        const details = getLocalizedValue(
          project.details,
          locale,
        ).toLowerCase();

        const technologies =
          Array.isArray(project.tech_stack)
            ? project.tech_stack.join(" ").toLowerCase()
            : "";

        return (
          title.includes(normalizedSearch) ||
          content.includes(normalizedSearch) ||
          details.includes(normalizedSearch) ||
          technologies.includes(normalizedSearch)
        );
      });
    }

    /*
     * -------------------------------------------
     * Status filter
     * -------------------------------------------
     */

    if (status !== "all") {
      result = result.filter(
        (project) => project.status === status,
      );
    }

    /*
     * -------------------------------------------
     * Category filter
     * -------------------------------------------
     */

    if (category !== "all") {
      result = result.filter(
        (project) =>
          project.categoryId === category,
      );
    }

    /*
     * -------------------------------------------
     * Sorting
     * -------------------------------------------
     */

    result.sort((a, b) => {
      switch (sort) {
        case "oldest":
          return (
            getProjectDate(a) -
            getProjectDate(b)
          );

        case "views":
          return (
            getProjectViewCount(b) -
            getProjectViewCount(a)
          );

        case "updated":
          return (
            getProjectDate(b) -
            getProjectDate(a)
          );

        case "newest":
        default:
          return (
            getProjectDate(b) -
            getProjectDate(a)
          );
      }
    });

    return result;
  }, [
    projects,
    search,
    status,
    category,
    sort,
    locale,
  ]);

  function resetFilters() {
    setSearch("");
    setStatus("all");
    setCategory("all");
    setSort("newest");
  }

  return (
    <>
      <ProjectToolbar
        locale={locale}
        categories={categories}
        component="projects"
        search={search}
        status={status}
        category={category}
        sort={sort}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        onCategoryChange={setCategory}
        onSortChange={setSort}
        onResetFilters={resetFilters}
      />

      <ProjectList
        projects={filteredProjects}
        locale={locale}
      />
    </>
  );
}