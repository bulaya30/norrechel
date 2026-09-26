"use client";

import Link from "next/link";
import DOMPurify from "isomorphic-dompurify";
import { useLocale } from "next-intl";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import type { Article } from "../../interfaces/article";

interface SummaryProps {
  blogs?: Article | Article[] | null;
}

type SupportedLocale = "en" | "fr";

type LocalizedValue =
  | string
  | Record<string, string>
  | null
  | undefined;

const PREVIEW_MAX_CHARACTERS = 650;
const PREVIEW_MAX_BLOCKS = 5;

function getLocalizedValue(
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
    Object.values(value).find(
      (item): item is string => typeof item === "string",
    ) ??
    ""
  );
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#039;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizePreviewHeadings(html: string): string {
  return html
    .replace(/<h1(\s[^>]*)?>/gi, "<h3$1>")
    .replace(/<\/h1>/gi, "</h3>");
}

function createContentPreview(
  html: string,
  maximumCharacters = PREVIEW_MAX_CHARACTERS,
  maximumBlocks = PREVIEW_MAX_BLOCKS,
): string {
  if (!html.trim()) {
    return "";
  }

  const sanitizedHtml = DOMPurify.sanitize(html, {
    USE_PROFILES: {
      html: true,
    },
    ALLOWED_TAGS: [
      "h1",
      "h2",
      "h3",
      "h4",
      "p",
      "strong",
      "b",
      "em",
      "i",
      "u",
      "s",
      "a",
      "ul",
      "ol",
      "li",
      "blockquote",
      "code",
      "br",
    ],
    ALLOWED_ATTR: [
      "href",
      "target",
      "rel",
      "title",
    ],
  });

  /*
   * Extract complete top-level WYSIWYG blocks.
   * This prevents HTML such as <p> or <ul> from being cut in half.
   */
  const blockPattern =
    /<(h[1-4]|p|ul|ol|blockquote|pre)(?:\s[^>]*)?>[\s\S]*?<\/\1>/gi;

  const blocks = sanitizedHtml.match(blockPattern) ?? [];

  /*
   * Some editors may store plain text or inline HTML without paragraphs.
   */
  if (blocks.length === 0) {
    const plainText = stripHtml(sanitizedHtml);

    if (!plainText) {
      return "";
    }

    const previewText =
      plainText.length > maximumCharacters
        ? `${plainText.slice(0, maximumCharacters).trimEnd()}…`
        : plainText;

    return `<p>${escapeHtml(previewText)}</p>`;
  }

  const previewBlocks: string[] = [];
  let usedCharacters = 0;
  let wasTruncated = false;

  for (const block of blocks) {
    if (previewBlocks.length >= maximumBlocks) {
      wasTruncated = true;
      break;
    }

    const blockText = stripHtml(block);

    if (!blockText) {
      continue;
    }

    const remainingCharacters =
      maximumCharacters - usedCharacters;

    if (remainingCharacters <= 0) {
      wasTruncated = true;
      break;
    }

    /*
     * Keep complete headings because headings are usually short and
     * should not be truncated.
     */
    const isHeading = /^<h[1-4][\s>]/i.test(block);

    if (
      blockText.length <= remainingCharacters ||
      isHeading
    ) {
      previewBlocks.push(block);
      usedCharacters += blockText.length;
      continue;
    }

    /*
     * If a paragraph is longer than the remaining limit, use a safe
     * plain-text paragraph instead of cutting the HTML string.
     */
    const truncatedText = blockText
      .slice(0, remainingCharacters)
      .trimEnd();

    if (truncatedText) {
      previewBlocks.push(
        `<p>${escapeHtml(truncatedText)}…</p>`,
      );
    }

    wasTruncated = true;
    break;
  }

  if (
    previewBlocks.length < blocks.length ||
    usedCharacters >= maximumCharacters
  ) {
    wasTruncated = true;
  }

  const previewHtml = normalizePreviewHeadings(
    previewBlocks.join(""),
  );

  if (!wasTruncated) {
    return previewHtml;
  }

  return `${previewHtml}<p class="content-preview-ellipsis" aria-hidden="true">…</p>`;
}

export default function Summary({
  blogs,
}: SummaryProps) {
  const locale = useLocale() as SupportedLocale;

  const safeBlogs: Article[] = Array.isArray(blogs)
    ? blogs
    : blogs
      ? [blogs]
      : [];

  if (safeBlogs.length === 0) {
    return (
      <p
        role="status"
        className="
          rounded-xl border border-slate-200 bg-slate-50
          px-5 py-6 text-center text-sm text-slate-600
        "
      >
        {locale === "fr"
          ? "Aucun résumé d’article n’est disponible."
          : "No article summaries are currently available."}
      </p>
    );
  }

  return (
    <section
      aria-labelledby="article-summaries-heading"
      className="w-full"
    >
      <h2
        id="article-summaries-heading"
        className="sr-only"
      >
        {locale === "fr"
          ? "Résumés des articles"
          : "Article summaries"}
      </h2>

      <Accordion
        type="single"
        collapsible
        className="space-y-4"
      >
        {safeBlogs.map((blog, index) => {
          const itemId = String(blog.id ?? index);

          const title =
            getLocalizedValue(
              blog.title as LocalizedValue,
              locale,
            ) ||
            (locale === "fr"
              ? "Article sans titre"
              : "Untitled article");

          const content = getLocalizedValue(
            blog.content as LocalizedValue,
            locale,
          );

          const previewContent =
            createContentPreview(content);

          const localizedSlug = getLocalizedValue(
            blog.slug as LocalizedValue,
            locale,
          );

          const articleUrl = localizedSlug
            ? `/${locale}/blogs/${localizedSlug}`
            : `/${locale}/blogs/${blog.id}`;

          return (
            <AccordionItem
              key={itemId}
              value={itemId}
              className="
                group m-1 overflow-hidden rounded-sm
                border border-slate-200 bg-white px-5
                shadow-sm transition-all duration-300
                data-[state=open]:border-blue-200
                data-[state=open]:shadow-lg
                data-[state=open]:shadow-slate-900/5
              "
            >
              <AccordionTrigger
                className="
                  py-5 text-left text-base font-bold
                  tracking-tight text-blue-900
                  hover:no-underline hover:text-blue-700
                  focus-visible:bg-blue-900
                  focus-visible:text-white
                  focus-visible:ring-2
                  focus-visible:ring-blue-600
                  focus-visible:ring-offset-2
                  [&>svg]:text-blue-700
                "
              >
                <span className="pr-4">
                  {title}
                </span>
              </AccordionTrigger>

              <AccordionContent className="pb-5">
                <div className="border-t border-slate-100 pt-5">
                  {previewContent ? (
                    <div
                      className="wysiwyg-preview text-slate-700"
                      dangerouslySetInnerHTML={{
                        __html: previewContent,
                      }}
                    />
                  ) : (
                    <p className="text-sm italic text-slate-500">
                      {locale === "fr"
                        ? "Aucun contenu n’est disponible pour cet article."
                        : "No content is available for this article."}
                    </p>
                  )}

                  <footer className="mt-6 border-t border-slate-100 pt-5">
                    <Link
                      href={articleUrl}
                      aria-label={
                        locale === "fr"
                          ? `Lire l’article complet : ${title}`
                          : `Read the full article: ${title}`
                      }
                      className="
                        inline-flex items-center rounded-md
                        text-sm font-semibold text-orange-600
                        transition-all duration-200
                        hover:translate-x-1 hover:text-orange-500
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-orange-600
                        focus-visible:ring-offset-2
                      "
                    >
                      {locale === "fr"
                        ? "Lire l’article complet"
                        : "Read full article"}

                      <span
                        aria-hidden="true"
                        className="ml-2"
                      >
                        →
                      </span>
                    </Link>
                  </footer>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </section>
  );
}