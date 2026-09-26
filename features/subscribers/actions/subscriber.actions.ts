"use server";

import { updateTag } from "next/cache";

import {
  requireAuthenticatedUser,
} from "@/features/auth/lib/requireAuthenticatedUser";
import { subscriberService } from "@/lib/container/subscriber.container";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export async function unsubscribeSubscriberAction(id: string) {
  try {
    await requireAuthenticatedUser();

    if (!id) {
      return {
        success: false,
        message: "Subscriber ID is required.",
      };
    }

    await subscriberService.unsubscribe(id);

    updateTag("subscribers");

    return {
      success: true,
      message: "Subscriber unsubscribed successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
}

export async function reactivateSubscriberAction(id: string) {
  try {
    await requireAuthenticatedUser();

    if (!id) {
      return {
        success: false,
        message: "Subscriber ID is required.",
      };
    }

    await subscriberService.reactivate(id);

    updateTag("subscribers");

    return {
      success: true,
      message: "Subscriber reactivated successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
}


export async function deleteSubscriberAction(id: string) {
  try {
    await requireAuthenticatedUser();

    if (!id) {
      return {
        success: false,
        message: "Subscriber ID is required.",
      };
    }

    await subscriberService.deleteSubscriber(id);

    updateTag("subscribers");

    return {
      success: true,
      message: "Subscriber deleted successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
}

export async function resetSubscribersAction() {
  try {
    await requireAuthenticatedUser();

    await subscriberService.resetSubscribers();

    updateTag("subscribers");

    return {
      success: true,
      message: "Subscribers reset successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
}
