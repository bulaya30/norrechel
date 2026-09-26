"use server";

import { updateTag } from "next/cache";

import { requireAuthenticatedUser } from "@/features/auth/lib/requireAuthenticatedUser";
import { userService } from "@/lib/container/user.container";

interface UpdateProfileData {
  firstName: string;
  lastName: string;
  title: string;
  contact: string;
  company: string;
  address: string;
  about: string;

  photo: File | null;

  facebook: string;
  linkedin: string;
  twitter: string;
  github: string;
  instagram: string;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export async function updateProfileAction(
  data: UpdateProfileData
) {
  try {
    const user = await requireAuthenticatedUser();

    if (!data) {
      throw new Error(
        "Profile data is required."
      );
    }

    await userService.updateUser(
      user.userId,
      {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        title: data.title.trim(),
        contact: data.contact.trim(),
        company: data.company.trim(),
        address: data.address.trim(),
        about: data.about.trim(),

        photo: data.photo,

        facebook: data.facebook.trim(),
        linkedin: data.linkedin.trim(),
        twitter: data.twitter.trim(),
        github: data.github.trim(),
        instagram: data.instagram.trim(),
      }
    );

    updateTag("users");
    updateTag(`users:id:${user.userId}`);

    return {
      success: true,
      message: "Profile updated successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: getErrorMessage(error),
    };
  }
}
