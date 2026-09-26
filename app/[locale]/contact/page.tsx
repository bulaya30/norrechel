import "server-only";

import { getLocale } from "next-intl/server";

import Header from "@/components/header/Header";
import ContactForm from "@/features/contacts/components/ContactForm";

type SupportedLocale = "en" | "fr";

export default async function ContactPage() {
  const locale = (await getLocale()) as SupportedLocale;

  return (
    <main id="main" className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 pt-22">
        <Header />

        <ContactForm locale={locale} />
      </div>
    </main>
  );
}