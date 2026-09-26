"use client";

import {
  useState,
  useTransition,
} from "react";

import { useRouter } from "next/navigation";

import {
  useController,
  useForm,
} from "react-hook-form";

import {
  FileText,
  ImageIcon,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ProjectBasicFields from "@/features/projects/components/create/ProjectBasicFields";
import ProjectContentEditor from "@/features/projects/components/create/ProjectContentEditor";
import ProjectDetailsFields from "@/features/projects/components/create/ProjectDetailsFields";
import ProjectCoverImage from "@/features/projects/components/create/ProjectCoverImage";
import ProjectFormActions from "@/components/form/FormActions";

interface SectionHeaderProps {
  icon: typeof FileText;
  title: string;
  description: string;

  variant:
    | "blue"
    | "orange";
}


import {
    updateProjectAction,
    publishProjectAction,
} from "@/features/projects/actions/project.actions";

import type { Project } from "@/features/interfaces/project";

type SupportedLocale = "en" | "fr";

interface CategoryOption {
  id: string;
  name: string;
}

interface EditProjectFormProps {
  locale: SupportedLocale;
  project: Project;
  categories: CategoryOption[];
}


export interface ProjectFormValues {
  title: {
    en: string;
    fr: string;
  };

  content: {
    en: string;
    fr: string;
  };

  details: {
    en: string;
    fr: string;
  };

  categoryId: string;

  tech_stack: string[];

  live_url: string;

  github_url: string;

  cover_image: File | null;
}

export default function EditProjectForm({
  locale,
  project,
  categories,
}: EditProjectFormProps) {
  const router = useRouter();

  const [
    isPending,
    startTransition,
  ] = useTransition();

  const [
    serverError,
    setServerError,
  ] = useState<string | null>(null);

  const [
    serverSuccess,
    setServerSuccess,
  ] = useState<string | null>(null);

  const {
    control,
    getValues,
    setError,
    clearErrors,
    reset,
    formState: {
      errors,
    },
  } = useForm<ProjectFormValues>({
    defaultValues: {
      title: {
        en: project.title?.en ?? "",
        fr: project.title?.fr ?? "",
      },

      content: {
        en: project.content?.en ?? "",
        fr: project.content?.fr ?? "",
      },

      details: {
        en: project.details?.en ?? "",
        fr: project.details?.fr ?? "",
      },

      categoryId:
        project.categoryId ?? "",

      tech_stack:
        project.tech_stack ?? [],

      live_url:
        project.live_url ?? "",

      github_url:
        project.github_url ?? "",

      /*
       * Existing cover images are URLs.
       *
       * The cover-image component should receive
       * the existing image separately if it supports
       * previewing an existing image.
       */
      cover_image: null,
    },
  });

  const titleEnField = useController({
    control,
    name: "title.en",
  }).field;

  const titleFrField = useController({
    control,
    name: "title.fr",
  }).field;

  const categoryField = useController({
    control,
    name: "categoryId",
  }).field;

  const contentEnField = useController({
    control,
    name: "content.en",
  }).field;

  const contentFrField = useController({
    control,
    name: "content.fr",
  }).field;

  const detailsEnField = useController({
    control,
    name: "details.en",
  }).field;

  const detailsFrField = useController({
    control,
    name: "details.fr",
  }).field;

  const techStackField = useController({
    control,
    name: "tech_stack",
  }).field;

  const liveUrlField = useController({
    control,
    name: "live_url",
  }).field;

  const githubUrlField = useController({
    control,
    name: "github_url",
  }).field;

  const coverImageField = useController({
    control,
    name: "cover_image",
  }).field;

  const labels =
    locale === "fr"
      ? {
          basicTitle:
            "Informations principales",

          basicDescription:
            "Modifiez le titre, la catégorie et les informations essentielles du projet.",

          contentTitle:
            "Contenu du projet",

          contentDescription:
            "Modifiez le contenu principal du projet dans les langues disponibles.",

          detailsTitle:
            "Détails du projet",

          detailsDescription:
            "Ajoutez ou modifiez les informations complémentaires du projet.",

          techTitle:
            "Technologies utilisées",

          techDescription:
            "Modifiez les technologies utilisées dans ce projet.",

          coverTitle:
            "Image de couverture",

          coverDescription:
            "Modifiez l’image qui représente le projet.",

          updated:
            "Projet mis à jour avec succès.",

          published:
            "Projet publié avec succès.",
        }
      : {
          basicTitle:
            "Basic information",

          basicDescription:
            "Update the project title, category, and essential information.",

          contentTitle:
            "Project content",

          contentDescription:
            "Update the main project content in the available languages.",

          detailsTitle:
            "Project details",

          detailsDescription:
            "Add or update additional project information.",

          techTitle:
            "Technologies used",

          techDescription:
            "Update the technologies used in this project.",

          coverTitle:
            "Cover image",

          coverDescription:
            "Update the image representing this project.",

          updated:
            "Project updated successfully.",

          published:
            "Project published successfully.",
        };

  /*
   * -------------------------------------------
   * Validation scrolling
   * -------------------------------------------
   */

  function scrollToField(
    fieldPath: string,
  ): void {
    const fieldTargets: Record<
      string,
      string
    > = {
      "title.en":
        "project-title-en",

      "title.fr":
        "project-title-fr",

      categoryId:
        "project-category",

      "content.en":
        "project-content-section",

      "content.fr":
        "project-content-section",

      "details.en":
        "project-details-section",

      "details.fr":
        "project-details-section",

      tech_stack:
        "project-tech-stack-section",

      live_url:
        "project-links-section",

      github_url:
        "project-links-section",

      cover_image:
        "project-cover-section",
    };

    const targetId =
      fieldTargets[fieldPath];

    if (!targetId) {
      return;
    }

    requestAnimationFrame(() => {
      const element =
        document.getElementById(
          targetId,
        );

      if (!element) {
        return;
      }

      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      if (
        element instanceof
          HTMLInputElement ||
        element instanceof
          HTMLTextAreaElement ||
        element instanceof
          HTMLButtonElement
      ) {
        element.focus({
          preventScroll: true,
        });
      }
    });
  }

  function scrollToServerError(): void {
    requestAnimationFrame(() => {
      const element =
        document.getElementById(
          "project-server-error",
        );

      element?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  }

  
  /*
   * -------------------------------------------
   * Validate
   * -------------------------------------------
   */

  function validateForm(): boolean {
    clearErrors();
    setServerError(null);

    if (!project.id) {
      setServerError(
        "Project ID is missing.",
      );

      scrollToServerError();

      return false;
    }

    const values =  getValues();

    if ( !values.title.en.trim() ) {
      setError(
        "title.en",
        {
          type: "manual",
          message: "English title is required.",
        },
      );
      scrollToField(
        "title.en",
      );
      return false;
    }

    if (
      !values.title.fr.trim()
    ) {
      setError(
        "title.fr",
        {
          type: "manual",
          message: "French title is required.",
        },
      );
      scrollToField(
        "title.fr",
      );
      return false;
    }

    return true;
  }

  /*
   * -------------------------------------------
   * Save
   * -------------------------------------------
   */

  function handleSave(): void {
    clearErrors();
    setServerError(null);
    setServerSuccess(null);

    if (!validateForm()) {
      return;
    }

    const values = getValues();
    startTransition(async () => {
      const response =
        await updateProjectAction(
          project.id!,
          {
            title: values.title,
            content: values.content,
            details: values.details,
            categoryId: values.categoryId,
            tech_stack: values.tech_stack,
            live_url: values.live_url || null,

            github_url: values.github_url || null,

            /*
             * Only send a new cover image
             * when the user selected one.
             */
            ...(values.cover_image && { coverImage: values.cover_image, }),
          },
        );

      if (!response.success) {
        setServerError(
          response.message,
        );
        scrollToServerError();
        return;
      }
      setServerSuccess(labels.updated,);
       /*
       * Clear local state.
       */
      reset();
      /*
       * Return to project management.
       */
      router.push(`/${locale}/dashboard/projects`);

      router.refresh();
    });
  }

  /*
   * -------------------------------------------
   * Publish
   * -------------------------------------------
   */

  function handlePublish(): void {

    if (!validateForm()) {
      return;
    }

    setServerError(null);
    setServerSuccess(null);

    startTransition(async () => {
      /*
       * Save current edits first.
       *
       * This prevents publishing stale data when
       * the user changes the form and immediately
       * clicks Publish.
       */
      const values = getValues();

      /*
       * Save the current form state first.
       */
      const updateResponse = await updateProjectAction(
          project.id!,
          {
            title: values.title,
            content: values.content,
            details: values.details,
            categoryId: values.categoryId,
            tech_stack: values.tech_stack,
            live_url: values.live_url || null,
            github_url: values.github_url || null,
            ...(values.cover_image && { coverImage: values.cover_image, }),
          },
        );

      if (!updateResponse.success) {
        setServerError(
          updateResponse.message,
        );
        scrollToServerError();
        return;
      }

      /*
       * Then publish the project.
       */
      const publishResponse =  await publishProjectAction( project.id!);

      if (!publishResponse.success) {
        setServerError( publishResponse.message );
        scrollToServerError();
        return;
      }

      setServerSuccess( labels.published );

      router.refresh();
    });
  }

  /*
   * -------------------------------------------
   * Render
   * -------------------------------------------
   */

  return (
    <form
      noValidate
      className="space-y-6"
      onSubmit={(event) => {
        event.preventDefault();
        handleSave();
      }}
    >
      {/* Server error */}
      {serverError && (
        <div
          id="project-server-error"
          role="alert"
          tabIndex={-1}
          className="
            rounded-xl border
            border-red-200 bg-red-50
            px-4 py-3
            text-sm font-medium
            text-red-700
          "
        >
          {serverError}
        </div>
      )}

      {/* Success */}
      {serverSuccess && (
        <div
          role="status"
          className="
            rounded-xl border
            border-emerald-200
            bg-emerald-50
            px-4 py-3
            text-sm font-medium
            text-emerald-700
          "
        >
          {serverSuccess}
        </div>
      )}

      {/* Basic information */}
      <Card
        id="project-basic-section"
        className="
          scroll-mt-24
          border-slate-200
          shadow-sm
        "
      >
        <CardHeader>
          <CardTitle
            className="
              text-lg font-bold
              text-slate-950
            "
          >
            {labels.basicTitle}
          </CardTitle>

          <CardDescription>
            {labels.basicDescription}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ProjectBasicFields
            locale={locale}
            titleEn={
              titleEnField.value
            }
            titleFr={
              titleFrField.value
            }
            categoryId={
              categoryField.value
            }
            categories={categories}
            onTitleEnChange={
              titleEnField.onChange
            }
            onTitleFrChange={
              titleFrField.onChange
            }
            onCategoryChange={
              categoryField.onChange
            }
            errors={{
              titleEn:
                errors.title?.en
                  ?.message,

              titleFr:
                errors.title?.fr
                  ?.message,

              categoryId:
                errors.categoryId
                  ?.message,
            }}
          />
        </CardContent>
      </Card>

      {/* Content */}
      <Card
        id="project-content-section"
        className="
          scroll-mt-24
          border-slate-200
          shadow-sm
        "
      >
        <CardHeader>
          <CardTitle
            className="
              text-lg font-bold
              text-slate-950
            "
          >
            {labels.contentTitle}
          </CardTitle>

          <CardDescription>
            {labels.contentDescription}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ProjectContentEditor
            locale={locale}
            contentEn={
              contentEnField.value
            }
            contentFr={
              contentFrField.value
            }
            onContentEnChange={
              contentEnField.onChange
            }
            onContentFrChange={
              contentFrField.onChange
            }
            errors={{
              contentEn:
                errors.content?.en
                  ?.message,

              contentFr:
                errors.content?.fr
                  ?.message,
            }}
          />
        </CardContent>
      </Card>

      {/* Details */}
      <Card
        id="project-details-section"
        className="
          scroll-mt-24
          border-slate-200
          shadow-sm
        "
      >
        <CardHeader>
          <CardTitle
            className="
              text-lg font-bold
              text-slate-950
            "
          >
            {labels.detailsTitle}
          </CardTitle>

          <CardDescription>
            {labels.detailsDescription}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ProjectDetailsFields
            locale={locale}
            detailsEn={ detailsEnField.value }
            detailsFr={ detailsFrField.value }
            techStack={techStackField.value}
            liveUrl={ liveUrlField.value }
            githubUrl={ githubUrlField.value }
            onDetailsEnChange={ detailsEnField.onChange }
            onDetailsFrChange={ detailsFrField.onChange }
            onTechStackChange={ techStackField.onChange }
            onLiveUrlChange={ liveUrlField.onChange }
            onGithubUrlChange={ githubUrlField.onChange }
            errors={{
              detailsEn: errors.details?.en ?.message,
              detailsFr: errors.details?.fr ?.message,
              liveUrl: errors.live_url ?.message,
              techStack: errors.tech_stack?.message,
              githubUrl: errors.github_url ?.message,
            }}
          />
        </CardContent>
      </Card>

      {/* Cover image */}
        <Card
          id="article-cover-section"
          className="
            scroll-mt-24
            border-slate-200
            shadow-sm
          "
        >
          <CardHeader>
            <SectionHeader
              icon={ImageIcon}
              title={
                locale === "fr"
                  ? "Image de couverture"
                  : "Cover image"
              }
              description={
                locale === "fr"
                  ? "Conservez l’image actuelle ou sélectionnez-en une nouvelle."
                  : "Keep the current image or select a new one."
              }
              variant="orange"
            />
          </CardHeader>
    
          <CardContent>
            <ProjectCoverImage
              locale={locale}
              value={
                coverImageField.value
              }
              existingImageUrl={
                project.cover_image
              }
              onChange={
                coverImageField.onChange
              }
              error={
                errors.cover_image
                  ?.message
              }
            />
          </CardContent>
        </Card>

      {/* Actions */}
      <ProjectFormActions
        locale={locale}
        mode="edit"
        component={"Project"}
        isSaving={isPending}
        isPublishing={isPending}
        onSaveDraft={handleSave}
        onPublish={handlePublish}
      />
    </form>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  description,
  variant,
}: SectionHeaderProps) {
  return (
    <div className="flex items-start gap-4">
      <div
        className={
          variant === "blue"
            ? `
                flex size-11 shrink-0
                items-center justify-center
                rounded-2xl
                bg-blue-50
                text-blue-700
                ring-1 ring-blue-100
              `
            : `
                flex size-11 shrink-0
                items-center justify-center
                rounded-2xl
                bg-orange-50
                text-orange-700
                ring-1 ring-orange-100
              `
        }
      >
        <Icon
          className="size-5"
          aria-hidden="true"
        />
      </div>

      <div>
        <CardTitle
          className="
            text-lg font-bold
            text-slate-950
          "
        >
          {title}
        </CardTitle>

        <CardDescription
          className="
            mt-1 leading-6
          "
        >
          {description}
        </CardDescription>
      </div>
    </div>
  );
}