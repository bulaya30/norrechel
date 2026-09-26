"use client";

import Image from "next/image";
import {
  type ChangeEvent,
  useEffect,
  useState,
} from "react";

import {
  ImageIcon,
  Trash2,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";

interface ArticleCoverImageProps {
  value: File | null;
  existingImageUrl?: string | null;
  onChange: (file: File | null) => void;
  locale: "en" | "fr";
  error?: string;
}

export default function ArticleCoverImage({
  value,
  existingImageUrl,
  onChange,
  locale,
  error,
}: ArticleCoverImageProps) {
  const [
    previewUrl,
    setPreviewUrl,
  ] = useState<string | null>(null);

  const labels = locale === "fr"
      ? {
          choose: "Choisir une image",
          replace: "Remplacer l’image",
          remove: "Supprimer",
          current: "Image actuelle",
          hint:
            "PNG, JPG ou WEBP. Utilisez une image nette adaptée au format paysage.",
          alt: "Aperçu de l’image de couverture",
        }
      : {
          choose: "Choose image",
          replace: "Replace image",
          remove: "Remove",
          current: "Current image",
          hint:
            "PNG, JPG or WEBP. Use a clear image suitable for a landscape layout.",
          alt: "Cover image preview",
        };

  useEffect(() => {
    if (!value) {
      setPreviewUrl(null);

      return;
    }

    const objectUrl = URL.createObjectURL(value);

    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(
        objectUrl,
      );
    };
  }, [value]);

  const displayedImage = previewUrl ?? existingImageUrl ?? null;

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    onChange(file);

    /*
     * Allows selecting the same file again
     * after removing/replacing it.
     */
    event.target.value = "";
  }

  function handleRemove() {
    /*
     * This only removes a newly selected File.
     *
     * It does NOT delete the existing Cloudinary
     * image yet.
     */
    onChange(null);
  }

  return (
    <div className="space-y-4">
      {displayedImage ? (
        <div
          className="
            overflow-hidden rounded-2xl
            border border-slate-200
            bg-slate-50
          "
        >
          <div className="relative aspect-[16/9] w-full">
            <Image
              src={displayedImage}
              alt={labels.alt}
              fill
              unoptimized={
                previewUrl !== null
              }
              className="object-cover"
            />
          </div>

          <div
            className="
              flex flex-col gap-3
              border-t border-slate-200
              bg-white p-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div className="min-w-0">
              {value ? (
                <>
                  <p
                    className="
                      truncate text-sm
                      font-semibold
                      text-slate-900
                    "
                  >
                    {value.name}
                  </p>

                  <p
                    className="
                      mt-1 text-xs
                      text-slate-500
                    "
                  >
                    {`${(
                      value.size /
                      1024 /
                      1024
                    ).toFixed(2)} MB`}
                  </p>
                </>
              ) : (
                <p
                  className="
                    text-sm font-semibold
                    text-slate-700
                  "
                >
                  {labels.current}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                asChild
                type="button"
                variant="outline"
                size="sm"
              >
                <label className="cursor-pointer">
                  <Upload
                    className="size-4"
                    aria-hidden="true"
                  />

                  {labels.replace}

                  <input
                    type="file"
                    accept="
                      image/png,
                      image/jpeg,
                      image/webp
                    "
                    onChange={
                      handleFileChange
                    }
                    className="sr-only"
                  />
                </label>
              </Button>

              {/*
                Only show "Remove" when the user has
                selected a NEW local file.

                Clicking it goes back to the existing
                Cloudinary image in edit mode.
              */}
              {value && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={ handleRemove }
                  className="
                    border-red-200
                    text-red-700
                    hover:bg-red-50
                    hover:text-red-800
                  "
                >
                  <Trash2
                    className="size-4"
                    aria-hidden="true"
                  />

                  {labels.remove}
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <label
          className="
            flex cursor-pointer
            flex-col items-center
            justify-center
            rounded-2xl border
            border-dashed
            border-slate-300
            bg-slate-50
            px-6 py-12
            text-center
            transition-colors
            hover:border-blue-300
            hover:bg-blue-50/40
          "
        >
          <div
            className="
              flex size-14
              items-center
              justify-center
              rounded-2xl
              bg-blue-50
              text-blue-700
              ring-1
              ring-blue-100
            "
          >
            <ImageIcon
              className="size-6"
              aria-hidden="true"
            />
          </div>

          <p
            className="
              mt-4 text-sm
              font-semibold
              text-slate-900
            "
          >
            {labels.choose}
          </p>

          <p
            className="
              mt-2 max-w-sm
              text-xs leading-5
              text-slate-500
            "
          >
            {labels.hint}
          </p>

          <input
            type="file"
            accept="
              image/png,
              image/jpeg,
              image/webp
            "
            onChange={
              handleFileChange
            }
            className="sr-only"
          />
        </label>
      )}

      {error && (
        <p
          role="alert"
          className="
            text-sm font-medium
            text-red-600
          "
        >
          {error}
        </p>
      )}
    </div>
  );
}