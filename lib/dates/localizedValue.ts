import type { Lang } from "@/features/interfaces/article";

export type SupportedLocale = "en" | "fr";

export type LocalizedValue =
  | string
  | Lang
  | Record<string, string>
  | null
  | undefined;

export function getLocalizedValue(
  value: LocalizedValue,
  locale: SupportedLocale,
): string {
  if (typeof value === "string") {
    return value;
  }

  if (!value || typeof value !== "object") {
    return "";
  }

  return (
    value[locale] ??
    value.en ??
    value.fr ??
    Object.values(value)[0] ??
    ""
  );
}