"use client";

import Image from "next/image";
import { type ChangeEvent, useEffect, useState } from "react";
import { ImageIcon, Upload, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type SupportedLocale = "en" | "fr";

interface ProfilePhotoFieldProps {
  locale: SupportedLocale;
  value: File | null;
  existingImageUrl?: string | null;
  onChange: (value: File | null) => void;
  error?: string;
}

export default function ProfilePhotoField({
  locale,
  value,
  existingImageUrl,
  onChange,
  error,
}: ProfilePhotoFieldProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const labels =
    locale === "fr"
      ? {
          choose: "Choisir une photo",
          replace: "Remplacer la photo",
          remove: "Supprimer la photo",
          current: "Photo actuelle",
          hint: "Ajoutez une photo de profil pour personnaliser votre compte.",
          formats: "PNG, JPG ou WEBP. Taille maximale : 5 MB.",
          alt: "Aperçu de la photo de profil",
          invalidType: "Veuillez sélectionner une image PNG, JPG ou WEBP.",
          tooLarge: "L’image ne doit pas dépasser 5 MB.",
        }
      : {
          choose: "Choose profile photo",
          replace: "Replace photo",
          remove: "Remove photo",
          current: "Current profile photo",
          hint: "Add a profile photo to personalize your account.",
          formats: "PNG, JPG or WEBP. Maximum size: 5 MB.",
          alt: "Profile photo preview",
          invalidType: "Please select a PNG, JPG or WEBP image.",
          tooLarge: "The image must not exceed 5 MB.",
        };

  useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(value);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [value]);

  const displayedImage = previewUrl ?? existingImageUrl ?? null;

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    setFileError(null);

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setFileError(labels.invalidType);
      event.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setFileError(labels.tooLarge);
      event.target.value = "";
      return;
    }

    onChange(file);
    event.target.value = "";
  }

  function handleRemove() {
    setFileError(null);
    onChange(null);
  }

  return (
    <div className="space-y-4">
      {displayedImage ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <div className="flex justify-center p-6">
            <div className="relative aspect-square w-full max-w-[240px] overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-sm">
              <Image
                src={displayedImage}
                alt={labels.alt}
                fill
                unoptimized={previewUrl !== null}
                className="object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0">
              {value ? (
                <>
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {value.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {(value.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </>
              ) : (
                <p className="text-sm font-semibold text-slate-700">
                  {labels.current}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button asChild type="button" variant="outline" size="sm">
                <label className="cursor-pointer">
                  <Upload className="size-4" aria-hidden="true" />

                  {labels.replace}

                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                </label>
              </Button>

              {value && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRemove}
                  className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                  {labels.remove}
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center transition-colors hover:border-blue-300 hover:bg-blue-50/40">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
            <ImageIcon className="size-6" aria-hidden="true" />
          </div>

          <p className="mt-4 text-sm font-semibold text-slate-900">
            {labels.choose}
          </p>

          <p className="mt-2 max-w-sm text-xs leading-5 text-slate-500">
            {labels.hint}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            {labels.formats}
          </p>

          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
            className="sr-only"
          />
        </label>
      )}

      {(fileError || error) && (
        <p role="alert" className="text-sm font-medium text-red-600">
          {fileError || error}
        </p>
      )}
    </div>
  );
}
