"use server";

import { updateTag } from "next/cache";

import { requireAuthenticatedUser } from "@/features/auth/lib/requireAuthenticatedUser";
import { contactService } from "@/lib/container/contact.container";

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
