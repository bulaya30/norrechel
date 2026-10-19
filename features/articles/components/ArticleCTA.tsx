"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

type ContentType = "article" | "project";

interface ArticleCTAProps {
  title?: string;
  description?: string;
  buttonLabel?: string;
  href?: string;
  onClick?: () => void;

  contentType?: ContentType;
  contentId?: string;
  contentTitle?: string;
  sourcePage?: string;
}

export default function ArticleCTA({
  title,
  description,
  buttonLabel,
  href,
  onClick,
  contentType,
  contentId,
  contentTitle,
  sourcePage,
}: ArticleCTAProps) {
  const t = useTranslations("Blogs.ArticleCTA");

  const ctaTitle = title ?? t("title");
  const ctaDescription = description ?? t("description");
  const ctaButtonLabel = buttonLabel ?? t("buttonLabel");

  const hasContentReference = Boolean(
    contentType && contentId && contentTitle && sourcePage,
  );

  const contactHref =
    href ??
    (hasContentReference
      ? {
          pathname: "/contact" as const,
          query: {
            type: contentType!,
            id: contentId!,
            title: contentTitle!,
            source: sourcePage!,
          },
        }
      : "/contact");

  function handleContactClick() {
    // Preserve any callback supplied by the parent.
    onClick?.();

    if (!contentType || !contentId) {
      return;
    }

    try {
      // Use the visitor identifier created by your visitor tracker.
      const visitorId =
        localStorage.getItem("visitorId") ??
        localStorage.getItem("visitor_id");

      if (!visitorId) {
        return;
      }

      const payload = {
        visitor_id: visitorId,
        content_id: contentId,
        content_type: contentType,
        event_type: "contact_click",
        event_value: 1,
        metadata: {
          content_title: contentTitle ?? ctaTitle,
          source_page: sourcePage ?? window.location.pathname,
          destination: "/contact",
          cta: "article_cta",
        },
        date: new Date().toISOString(),
      };

      // keepalive helps the request finish while the browser navigates.
      void fetch("/api/engagements/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        keepalive: true,
      }).catch(() => {
        // Tracking failures should not prevent contact-page navigation.
      });
    } catch {
      // Tracking is non-critical; navigation must still work.
    }
  }

  return (
    <section
      aria-labelledby="article-cta-heading"
      className="my-12 rounded-2xl border border-orange-200 bg-orange-50 px-6 py-10 text-center"
    >
      <div className="mx-auto max-w-2xl">
        <h2
          id="article-cta-heading"
          className="text-2xl font-bold tracking-tight text-slate-900"
        >
          {ctaTitle}
        </h2>

        <p className="mt-3 leading-7 text-slate-600">
          {ctaDescription}
        </p>

        <Link
          href={contactHref}
          onClick={handleContactClick}
          className="mt-6 inline-flex items-center justify-center rounded-md bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2"
        >
          {ctaButtonLabel}
        </Link>
      </div>
    </section>
  );
}