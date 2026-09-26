import {
  hasLocale,
  NextIntlClientProvider,
} from "next-intl";

import {
  getMessages,
  setRequestLocale,
} from "next-intl/server";

import { notFound } from "next/navigation";

import { routing } from "@/i18n/routing";

interface LocaleProviderProps {
  children: React.ReactNode;
  locale: string;
}

export default async function LocaleProvider({
  children,
  locale,
}: LocaleProviderProps) {
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages({
    locale,
  });

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
    >
      {children}
    </NextIntlClientProvider>
  );
}