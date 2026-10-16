"use server";

import { updateTag } from "next/cache";

import { requireAuthenticatedUser } from "@/features/auth/lib/requireAuthenticatedUser";
import { contactService } from "@/lib/container/contact.container";

import {
  createContactSchema,
  type ContactFormValues,
  type SupportedLocale,
} from "@/features/contacts/schema/contact.schema";

type ContentContactReference = {
  contentType: "article" | "project";
  contentId: string;
  title: string;
  sourcePage: string;
};

export type SubmitContactResult =
  | { success: true }
  | {
      success: false;
      error: "VALIDATION" | "SUBMISSION_FAILED";
    };

export async function submitContactAction(
  data: ContactFormValues,
  locale: SupportedLocale,
  context?: ContentContactReference,
): Promise<SubmitContactResult> {
  const parsed = createContactSchema(locale).safeParse(data);

  if (!parsed.success) {
    return { success: false, error: "VALIDATION" };
  }

  if (context) {
    const sourcePage = context.sourcePage.trim();
    const contentId = context.contentId.trim();
    const title = context.title.trim();

    // Accept only local paths, not external or protocol-relative URLs.
    if (
      !contentId ||
      !title ||
      !sourcePage.startsWith("/") ||
      sourcePage.startsWith("//") ||
      sourcePage.includes("\\") ||
      (context.contentType !== "article" &&
        context.contentType !== "project")
    ) {
      return { success: false, error: "VALIDATION" };
    }
  }

  try {
    if (context) {
      await contactService.createContact({
        ...parsed.data,
        subject: `Regarding: ${context.title.trim()}`,
        source_page: context.sourcePage.trim(),
        content_id: context.contentId.trim(),
        content_type: context.contentType,
      });
    } else {
      await contactService.createContact(parsed.data);
    }

    updateTag("contacts");

    return { success: true };
  } catch (error) {
    console.error("Contact submission failed:", error);

    return { success: false, error: "SUBMISSION_FAILED" };
  }
}

/*
 * -------------------------------------------
 * Mark contact as replied
 * -------------------------------------------
 */

export async function markContactAsRepliedAction(
  id: string,
) {
  try {
    const {userId} = await requireAuthenticatedUser();

    if (!id) {
      return {
        success: false,
        message: "Contact ID is required.",
      };
    }

    await contactService.markContactAsReplied(
      userId,
      id,
    );

    updateTag("contacts");
    updateTag(`contact:${id}`);

    return {
      success: true,
      message: "Contact marked as replied.",
    };
  } catch (error) {
    console.error(
      "Mark contact as replied failed:",
      error,
    );

    return {
      success: false,
      message: getContactActionErrorMessage(error),
    };
  }
}

/*
 * -------------------------------------------
 * Delete contact
 * -------------------------------------------
 */

export async function deleteContactAction(
  id: string,
) {
  try {
    await requireAuthenticatedUser();

    if (!id) {
      return {
        success: false,
        message: "Contact ID is required.",
      };
    }

    await contactService.deleteContact(id);

    updateTag("contacts");
    updateTag(`contact:${id}`);

    return {
      success: true,
      message: "Contact deleted successfully.",
    };
  } catch (error) {
    console.error(
      "Delete contact failed:",
      error,
    );

    return {
      success: false,
      message: getContactActionErrorMessage(error),
    };
  }
}

/*
 * -------------------------------------------
 * Reset contacts
 * -------------------------------------------
 *
 * Keep this separate from the normal contact
 * management UI. This should only be exposed
 * to an appropriate administrative operation.
 */

export async function resetContactsAction() {
  try {
    await requireAuthenticatedUser();

    await contactService.reset();

    updateTag("contacts");

    return {
      success: true,
      message: "Contacts reset successfully.",
    };
  } catch (error) {
    console.error(
      "Reset contacts failed:",
      error,
    );

    return {
      success: false,
      message: getContactActionErrorMessage(error),
    };
  }
}

/*
 * -------------------------------------------
 * Error mapping
 * -------------------------------------------
 */

function getContactActionErrorMessage(
  error: unknown,
): string {
  if (!(error instanceof Error)) {
    return "Something went wrong. Please try again.";
  }

  switch (error.message) {
    case "Contact id is required":
      return "Contact ID is required.";

    case "Contact not found":
      return "This contact could not be found.";

    case "Contact is already replied":
      return "This contact has already been marked as replied.";

    case "User id is required":
      return "Authentication is required.";

    default:
      return error.message ||
        "Something went wrong. Please try again.";
  }
}
