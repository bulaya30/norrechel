"use client";

import Image from "next/image";
import { type ChangeEvent, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ImageIcon, Upload, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import type { SupportedLocale } from "@/lib/dates/localizedValue";

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
  const t = useTranslations("ProfilePhotoField");

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

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
      setFileError(t("invalidType"));
      event.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setFileError(t("tooLarge"));
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
                alt={t("previewAlt")}
                fill
                unoptimized={previewUrl !== null}
                sizes="240px"
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
                    {t("fileSize", {
                      size: (value.size / 1024 / 1024).toFixed(2),
                    })}
                  </p>
                </>
              ) : (
                <p className="text-sm font-semibold text-slate-700">
                  {t("current")}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button asChild type="button" variant="outline" size="sm">
                <label className="cursor-pointer">
                  <Upload className="size-4" aria-hidden="true" />
                  {t("replace")}

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
                  {t("remove")}
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
            {t("choose")}
          </p>

          <p className="mt-2 max-w-sm text-xs leading-5 text-slate-500">
            {t("hint")}
          </p>

          <p className="mt-1 text-xs leading-5 text-slate-400">
            {t("formats")}
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