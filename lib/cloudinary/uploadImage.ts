import "server-only";

import type {
  UploadApiErrorResponse,
  UploadApiResponse,
} from "cloudinary";

import cloudinary from "./client";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

interface UploadImageOptions {
  folder: string;
  publicId?: string;
}

export interface UploadedImage {
  url: string;
  publicId: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export async function uploadImage(
  file: File,
  options: UploadImageOptions,
): Promise<UploadedImage> {
  validateImage(file);

  const arrayBuffer = await file.arrayBuffer();

  const buffer = Buffer.from(arrayBuffer);

  const result = await uploadBuffer(
      buffer,
      options,
    );

  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    format: result.format,
    bytes: result.bytes,
  };
}

function uploadBuffer(
  buffer: Buffer,
  options: UploadImageOptions,
): Promise<UploadApiResponse> {
  return new Promise(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
            resource_type: "image",

            folder: options.folder,

            public_id: options.publicId,

            overwrite: true,

            invalidate: true,

            transformation: [
              {
                quality: "auto",
                fetch_format: "auto",
              },
            ],
        },
        (
            error:
              | UploadApiErrorResponse
              | undefined,
            result:
              | UploadApiResponse
              | undefined,
          ) => {
            if (error) {
              reject(error);
              return;
            }

            if (!result) {
              reject(
                new Error(
                  "Cloudinary upload returned no result.",
                ),
              );
              return;
            }

            resolve(result);
          },
        );

      stream.end(buffer);
    },
  );
}

function validateImage(
  file: File,
): void {
  if (!file) {
    throw new Error(
      "Cover image is required.",
    );
  }

  if (
    !ALLOWED_TYPES.includes(
      file.type as
        (typeof ALLOWED_TYPES)[number],
    )
  ) {
    throw new Error(
      "Only JPG, PNG, and WEBP images are supported.",
    );
  }

  if (
    file.size > MAX_IMAGE_SIZE
  ) {
    throw new Error(
      "Cover image must not exceed 5 MB.",
    );
  }
}