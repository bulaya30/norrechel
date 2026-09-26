import { Mail } from "lucide-react";

import DecorativeBackground from "@/components/ui/DecorativeBackground";
import NewsletterForm from "@/features/newsletter/components/NewsletterForm";

export default function NewsletterSection() {
  return (
    <section
      aria-labelledby="newsletter-heading"
      className="overflow-hidden rounded-md border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 px-6 py-7 shadow-sm sm:px-10"
    >
        <DecorativeBackground rounded />
      <div className="mx-auto max-w-3xl text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-white/10 text-orange-400 ring-1 ring-white/15">
          <Mail className="h-7 w-7" aria-hidden="true" />
        </div>

        <header className="mt-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">
            Newsletter
          </p>

          <h2
            id="newsletter-heading"
            className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl"
          >
            Stay informed and inspired
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
            Receive my latest articles, practical lessons, and project updates
            directly in your inbox. No unnecessary emails, only useful ideas
            worth sharing.
          </p>
        </header>

        <NewsletterForm />
      </div>
    </section>
  );
}