export function hasMeaningfulHtmlContent(
  value: string,
): boolean {
  const plainText = value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  return plainText.length >= 3;
}