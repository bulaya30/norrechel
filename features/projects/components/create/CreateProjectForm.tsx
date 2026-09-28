"use client";

import {
  useState,
  useTransition,
} from "react";

import { useRouter } from "next/navigation";

import {
  useController,
  useForm,
  type FieldPath,
} from "react-hook-form";

import {
  FileText,
  ImageIcon,
  Info,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import ProjectBasicFields from "./ProjectBasicFields";
import ProjectContentEditor from "./ProjectContentEditor";
import ProjectDetailsFields from "./ProjectDetailsFields";
import ProjectCoverImage from "./ProjectCoverImage";

import FormActions from "@/components/form//FormActions";



import {
  projectDraftSchema,
} from "@/features/projects/schema/project.schema";

import {
  createProjectAction,
} from "@/features/projects/actions/project.actions";

type SupportedLocale = "en" | "fr";

interface CategoryOption {
  id: string;
  name: string;
}

interface CreateProjectFormProps {
  locale: SupportedLocale;
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

export default function CreateProjectForm({
  locale,
  categories,
}: CreateProjectFormProps) {
  const router = useRouter();

  const [
    isPending,
    startTransition,
  ] = useTransition();

  const [
    serverError,
    setServerError,
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
      en: "",
      fr: "",
    },

    content: {
      en: "",
      fr: "",
    },

    details: {
      en: "",
      fr: "",
    },

    categoryId: "",

    tech_stack: [],

    live_url: "",

    github_url: "",

    cover_image: null,
    },
  })

  /*
   * -------------------------------------------
   * Fields
   * -------------------------------------------
   */

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

  /*
   * -------------------------------------------
   * Labels
   * -------------------------------------------
   */

  const labels =
    locale === "fr"
      ? {
          basicTitle: "Informations principales",
          basicDescription: "Définissez le titre, la catégorie et les technologies utilisées pour ce projet.",
          contentTitle: "Contenu du projet",
          contentDescription: "Présentez le projet dans les langues disponibles.",
          detailsTitle: "Détails du projet",
          detailsDescription: "Ajoutez les informations complémentaires et les liens du projet.",
          coverTitle: "Image de couverture",
          coverDescription: "Ajoutez une image qui représentera le projet sur le site.",
          error: "Une erreur est survenue lors de l’enregistrement du projet.",
        }
      : {
          basicTitle: "Basic information",
          basicDescription: "Define the project title, category, and technologies used for this project.",
          contentTitle: "Project content",
          contentDescription: "Present the project in the available languages.",
          detailsTitle: "Project details",
          detailsDescription: "Add additional project information and links.",
          coverTitle: "Cover image",
          coverDescription: "Add an image that will represent the project across the website.",
          error: "An error occurred while saving the project.",
        };

  /*
   * -------------------------------------------
   * Scroll helpers
   * -------------------------------------------
   */

  function scrollToField(
    fieldPath: string,
  ): void { 
    const fieldTargets: Record<string,string > = {
      "title.en": "project-title-en",
      "title.fr": "project-title-fr",
      categoryId: "project-category",
      "content.en": "project-content-section",
      "content.fr": "project-content-section",
      "details.en": "project-details-section",
      "details.fr": "project-details-section",
      techStack: "project-details-section",
      liveUrl: "project-details-section",
      githubUrl: "project-details-section",
      coverImage: "project-cover-section",
    };

    const targetId = fieldTargets[fieldPath];

    if (!targetId) {
      return;
    }

    requestAnimationFrame(() => {
      const element = document.getElementById(
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
      const element = document.getElementById(
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
   * Submit
   * -------------------------------------------
   */

  async function submitProject() {
    clearErrors();
    setServerError(null);

    const values = getValues();

    /*
     * Client-side validation.
     */
    const result = projectDraftSchema.safeParse(values);

    if (!result.success) {
      const issues = result.error.issues;

      for (const issue of issues) {
        const fieldName = issue.path.join(".") as FieldPath<ProjectFormValues>;

        setError(
          fieldName,
          {
            type: "manual",
            message: issue.message,
          },
        );
      }

      const firstIssue = issues[0];

      if (firstIssue) {
        scrollToField(firstIssue.path.join( "." ));
      }
      return;
    }

    /*
     * -----------------------------------------
     * Server Action
     * -----------------------------------------
     */

    startTransition(async () => {
      const response = await createProjectAction({
            title: result.data.title,
            content: result.data.content,
            details: result.data.details,
            categoryId: result.data.categoryId,
            tech_stack: result.data.tech_stack,
            live_url: result.data.live_url || null,
            github_url: result.data.github_url || null,
            coverImage: result.data.coverImage ?? null,
        });

      if (!response.success) {
        setServerError(response.message || labels.error);
        scrollToServerError();
        return;
      }
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

  function handleSaveDraft() {
    void submitProject();
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
        handleSaveDraft();
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
            border-red-200
            bg-red-50
            px-4 py-3
            text-sm font-medium
            text-red-700
          "
        >
          {serverError}
        </div>
      )}

      {/* --------------------------------------- */}
      {/* Basic information */}
      {/* --------------------------------------- */}

      <Card
        id="project-basic-section"
        className="
          scroll-mt-24
          border-slate-200
          shadow-sm
        "
      >
        <CardHeader>
          <SectionHeader
            icon={FileText}
            title={labels.basicTitle}
            description={labels.basicDescription}
            variant="blue"
          />
        </CardHeader>

        <CardContent>
          <ProjectBasicFields
            locale={locale}
            titleEn={titleEnField.value}
            titleFr={titleFrField.value}
            categoryId={categoryField.value}
            categories={categories}
            onTitleEnChange={titleEnField.onChange}
            onTitleFrChange={titleFrField.onChange}
            onCategoryChange={categoryField.onChange}
            errors={{
              titleEn:
                errors.title
                  ?.en
                  ?.message,

              titleFr:
                errors.title
                  ?.fr
                  ?.message,

              categoryId:
                errors.categoryId
                  ?.message,
            }}
          />
        </CardContent>
      </Card>

      {/* --------------------------------------- */}
      {/* Content */}
      {/* --------------------------------------- */}

      <Card
        id="project-content-section"
        className="
          scroll-mt-24
          border-slate-200
          shadow-sm
        "
      >
        <CardHeader>
          <SectionHeader
            icon={FileText}
            title={labels.contentTitle}
            description={labels.contentDescription}
            variant="blue"
          />
        </CardHeader>

        <CardContent>
          <ProjectContentEditor
            locale={locale}
            contentEn={contentEnField.value}
            contentFr={contentFrField.value}
            onContentEnChange={contentEnField.onChange}
            onContentFrChange={contentFrField.onChange}
            errors={{
              contentEn:
                errors.content
                  ?.en
                  ?.message,

              contentFr:
                errors.content
                  ?.fr
                  ?.message,
            }}
          />
        </CardContent>
      </Card>

      {/* --------------------------------------- */}
      {/* Details */}
      {/* --------------------------------------- */}

      <Card
        id="project-details-section"
        className="
          scroll-mt-24
          border-slate-200
          shadow-sm
        "
      >
        <CardHeader>
          <SectionHeader
            icon={Info}
            title={labels.detailsTitle}
            description={labels.detailsDescription}
            variant="blue"
          />
        </CardHeader>

        <CardContent>
          <ProjectDetailsFields
            locale={locale}
            detailsEn={detailsEnField.value}
            detailsFr={detailsFrField.value}
            techStack={techStackField.value}
            liveUrl={liveUrlField.value}
            githubUrl={githubUrlField.value}
            onDetailsEnChange={detailsEnField.onChange}
            onDetailsFrChange={detailsFrField.onChange}
            onTechStackChange={techStackField.onChange}
            onLiveUrlChange={liveUrlField.onChange}
            onGithubUrlChange={githubUrlField.onChange}
            errors={{
              detailsEn:
                errors.details
                  ?.en
                  ?.message,

              detailsFr:
                errors.details
                  ?.fr
                  ?.message,

              techStack:
                errors.tech_stack
                  ?.message,

              liveUrl:
                errors.live_url
                  ?.message,

              githubUrl:
                errors.github_url
                  ?.message,
            }}
          />
        </CardContent>
      </Card>

      {/* --------------------------------------- */}
      {/* Cover image */}
      {/* --------------------------------------- */}

      <Card
        id="project-cover-section"
        className="
          scroll-mt-24
          border-slate-200
          shadow-sm
        "
      >
        <CardHeader>
          <SectionHeader
            icon={ImageIcon}
            title={labels.coverTitle}
            description={labels.coverDescription}
            variant="orange"
          />
        </CardHeader>

        <CardContent>
          <ProjectCoverImage
            locale={locale}
            value={coverImageField.value}
            onChange={coverImageField.onChange}
            error={
              errors.cover_image
                ?.message
            }
          />
        </CardContent>
      </Card>

      {/* --------------------------------------- */}
      {/* Actions */}
      {/* --------------------------------------- */}

      <FormActions
        locale={locale}
        component={"project"}
        mode={"create"}
        isSaving={isPending}
        onSaveDraft={
          handleSaveDraft
        }
      />
    </form>
  );
}

/*
 * -------------------------------------------
 * Section header
 * -------------------------------------------
 */

interface SectionHeaderProps {
  icon: typeof FileText;
  title: string;
  description: string;
  variant: "blue" | "orange";
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
          className="mt-1 leading-6"
        >
          {description}
        </CardDescription>
      </div>
    </div>
  );
}