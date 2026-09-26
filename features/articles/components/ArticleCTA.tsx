"use client";

import Link from "next/link";

interface ArticleCTAProps {
  title?: string;
  description?: string;
  buttonLabel?: string;
  href?: string;
  onClick?: () => void;
}

export default function ArticleCTA({
  title = "Interested in this article?",
  description = "Let’s work together to build something practical and meaningful.",
  buttonLabel = "Let’s Collaborate",
  href = "/contact",
  onClick,
}: ArticleCTAProps) {
  return (
    <section
      aria-labelledby="article-cta-heading"
      className="
        my-12 rounded-2xl
        border border-orange-200
        bg-orange-50 px-6 py-10
        text-center
      "
    >
      <div className="mx-auto max-w-2xl">
        <h2
          id="article-cta-heading"
          className="text-2xl font-bold tracking-tight text-slate-900"
        >
          {title}
        </h2>

        <p className="mt-3 leading-7 text-slate-600">
          {description}
        </p>

        <Link
          href={href}
          onClick={onClick}
          className="
            mt-6 inline-flex items-center justify-center
            rounded-md bg-orange-600 px-5 py-3
            text-sm font-semibold text-white
            transition-colors
            hover:bg-orange-700
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-orange-600
            focus-visible:ring-offset-2
          "
        >
          {buttonLabel}
        </Link>
      </div>
    </section>
  );
}