import { SupportedLocale } from "./localizedValue";

export function formatNumber(
  value: number,
  locale: SupportedLocale,
): string {
  return new Intl.NumberFormat(
    locale === "fr" ? "fr-FR" : "en-US",
  ).format(value);
}

export function formatCompactNumber(
  value: number,
  locale: SupportedLocale,
): string {
  return new Intl.NumberFormat(
    locale === "fr" ? "fr-FR" : "en-US",
    {
      notation: value >= 1_000 ? "compact" : "standard",
      maximumFractionDigits: 1,
    },
  ).format(value);
}

export function formatPercentage(value: number): string {
  return `${value}%`;
}

export function formatDuration(seconds: number): string {
  if (seconds <= 0) {
    return "0s";
  }

  if (seconds < 60) {
    return `${seconds}s`;
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (remainingSeconds === 0) {
    return `${minutes}m`;
  }

  return `${minutes}m ${remainingSeconds}s`;
}

