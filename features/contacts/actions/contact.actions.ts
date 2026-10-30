
"use server";

import { requireAuthenticatedUser } from "@/features/auth/lib/requireAuthenticatedUser";

import { updateTag } from "next/cache";

import { contactService } from "@/lib/container/contact.container";

import {
  createContactSchema,
  createBusinessContactSchema,
  type ContactFormValues,
  type BusinessContactFormValues,
  type SupportedLocale,
} from "@/features/contacts/schema/contact.schema";

import { getCachedPublishedArticles } from "@/features/articles/queries/article.queries";
import { getCachedPublishedProjects } from "@/features/projects/queries/project.queries";

type ContentContactReference = {
  contentType: "article" | "project";
  contentId: string;
};

export type SubmitContactResult =
  | { success: true }
  | {
      success: false;
      error: "VALIDATION" | "SUBMISSION_FAILED";
    };

function isSupportedLocale(value: unknown): value is SupportedLocale {
  return value === "en" || value === "fr";
}

function getLocalizedValue(
  value: unknown,
  locale: SupportedLocale,
): string {
  if (typeof value === "string") return value;

  if (!value || typeof value !== "object") return "";

  const localized = value as Record<string, unknown>;
  const result = localized[locale] ?? localized.en ?? localized.fr;

  return typeof result === "string" ? result : "";
}

export async function submitContactAction(
  data: ContactFormValues | BusinessContactFormValues,
  locale: SupportedLocale,
  context?: ContentContactReference,
): Promise<SubmitContactResult> {
  try {
    // Validate locale
    if (!isSupportedLocale(locale)) {
      return { success: false, error: "VALIDATION" };
    }

    if (!data || typeof data !== "object") {
      return { success: false, error: "VALIDATION" };
    }

    // Business enquiry
    if ("purpose" in data) {
      if (data.purpose !== "business" || context) {
        return { success: false, error: "VALIDATION" };
      }

      const parsed = createBusinessContactSchema(locale).safeParse(data);

      if (!parsed.success) {
        return { success: false, error: "VALIDATION" };
      }

      await contactService.createContact(parsed.data);

      updateTag("contacts");

      return { success: true };
    }

    // General contact validation
    const parsed = createContactSchema(locale).safeParse(data);

    if (!parsed.success) {
      return { success: false, error: "VALIDATION" };
    }

    // General contact without content reference
    if (!context) {
      await contactService.createContact(parsed.data);

      updateTag("contacts");

      return { success: true };
    }

    // Validate content reference
    if (
      !context.contentId ||
      typeof context.contentId !== "string" ||
      (context.contentType !== "article" &&
        context.contentType !== "project")
    ) {
      return { success: false, error: "VALIDATION" };
    }

    const contentId = context.contentId.trim();

    if (!contentId) {
      return { success: false, error: "VALIDATION" };
    }

    let title = "";
    let slug = "";

    // Resolve published article
    if (context.contentType === "article") {
      const articles = await getCachedPublishedArticles();

      const article = articles.find(
        (item) => item.id === contentId,
      );

      if (!article) {
        return { success: false, error: "VALIDATION" };
      }

      title = getLocalizedValue(article.title, locale);
      slug = getLocalizedValue(article.slug, locale);
    }

    // Resolve published project
    if (context.contentType === "project") {
      const projects = await getCachedPublishedProjects();

      const project = projects.find(
        (item) => item.id === contentId,
      );

      if (!project) {
        return { success: false, error: "VALIDATION" };
      }

      title = getLocalizedValue(project.title, locale);
      slug = getLocalizedValue(project.slug, locale);
    }

    if (!title) {
      return { success: false, error: "VALIDATION" };
    }

    const basePath =
      context.contentType === "article" ? "blogs" : "projects";

    const sourcePage = `/${locale}/${basePath}/${encodeURIComponent(
      slug || contentId,
    )}`;

    await contactService.createContact({
      ...parsed.data,
      subject: `Regarding: ${title}`,
      source_page: sourcePage,
      content_id: contentId,
      content_type: context.contentType,
    });

    updateTag("contacts");

    return { success: true };
  } catch (error) {
    return { success: false, error: "SUBMISSION_FAILED" };
  }
}


export async function markContactAsRepliedAction(
  id: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const user = await requireAuthenticatedUser();

    if (user.role.toLowerCase() !== "admin") {
      return {
        success: false,
        message: "You are not authorized to perform this action.",
      };
    }

    if (!id?.trim()) {
      return {
        success: false,
        message: "Contact ID is required.",
      };
    }

    await contactService.markContactAsReplied(user.userId, id);

    updateTag("contacts");

    return {
      success: true,
      message: "Contact marked as replied.",
    };
  } catch (error) {
    console.error("Mark contact as replied error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to update contact.",
    };
  }
}

export async function deleteContactAction(
  id: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const user = await requireAuthenticatedUser();

    if (user.role.toLowerCase() !== "admin") {
      return {
        success: false,
        message: "You are not authorized to perform this action.",
      };
    }

    if (!id?.trim()) {
      return {
        success: false,
        message: "Contact ID is required.",
      };
    }

    await contactService.deleteContact(id);

    updateTag("contacts");

    return {
      success: true,
      message: "Contact deleted successfully.",
    };
  } catch (error) {
    console.error("Delete contact error:", error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to delete contact.",
    };
  }
}

