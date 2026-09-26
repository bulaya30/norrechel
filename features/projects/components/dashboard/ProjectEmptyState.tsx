"use client";

import Link from "next/link";

import {
  FolderKanban,
  Plus,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface ProjectEmptyStateProps {
  locale: "en" | "fr";
  title: string;
  description: string;
}

export default function ProjectEmptyState({
  locale,
  title,
  description,
}: ProjectEmptyStateProps) {
  const createLabel =
    locale === "fr"
      ? "Créer un projet"
      : "Create project";

  return (
    <div
      className="
        flex flex-col items-center
        justify-center
        rounded-2xl border
        border-dashed
        border-slate-300
        bg-white
        px-6 py-16
        text-center
      "
    >
      <div
        className="
          flex size-14
          items-center justify-center
          rounded-2xl
          bg-blue-50
          text-blue-700
          ring-1 ring-blue-100
        "
      >
        <FolderKanban
          className="size-7"
          aria-hidden="true"
        />
      </div>

      <h2
        className="
          mt-5 text-lg
          font-bold text-slate-950
        "
      >
        {title}
      </h2>

      <p
        className="
          mt-2 max-w-md
          text-sm leading-6
          text-slate-500
        "
      >
        {description}
      </p>

      <Button
        asChild
        className="
          mt-6
          bg-blue-900
          text-white
          hover:bg-blue-800
        "
      >
        <Link
          href={`/${locale}/dashboard/projects/new`}
        >
          <Plus
            className="size-4"
            aria-hidden="true"
          />

          {createLabel}
        </Link>
      </Button>
    </div>
  );
}