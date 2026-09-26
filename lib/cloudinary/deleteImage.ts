import "server-only";

import cloudinary from "./client";

export async function deleteImage(
  publicId: string,
): Promise<void> {
  if (!publicId.trim()) {
    throw new Error(
      "Cloudinary public id is required",
    );
  }

  const result =
    await cloudinary.uploader.destroy(
      publicId,
      {
        resource_type: "image",
        invalidate: true,
      },
    );

  if (
    result.result !== "ok" &&
    result.result !== "not found"
  ) {
    throw new Error(
      `Failed to delete Cloudinary image: ${result.result}`,
    );
  }
}