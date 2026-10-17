"use client";

import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ContactRow from "@/features/contacts/components/ContactRow";
import ContentNotFound from "@/components/ContentNotFound";

import type { Contact } from "@/features/interfaces/contact";
import type { SupportedLocale } from "@/lib/dates/localizedValue";

interface ContactListProps {
  locale: SupportedLocale;
  contacts: Contact[];
}

export default function ContactList({
  locale,
  contacts,
}: ContactListProps) {
  const t = useTranslations("ContactList");

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div
            className="
              flex size-10 shrink-0
              items-center justify-center
              rounded-xl
              bg-blue-50
              text-blue-700
              ring-1 ring-blue-100
            "
          >
            <Mail className="size-5" aria-hidden="true" />
          </div>

          <div>
            <CardTitle className="text-lg font-bold text-slate-950">
              {t("title")}
            </CardTitle>

            <p className="mt-1 text-sm text-slate-500">
              {t("contactCount", { count: contacts.length })}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {contacts.length === 0 ? (
          <ContentNotFound locale={locale} component="Contact" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-y border-slate-200 bg-slate-50">
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    {t("contact")}
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    {t("subject")}
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    {t("source")}
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    {t("status")}
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    {t("submitted")}
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    {t("actions")}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {contacts.map((contact) => (
                  <ContactRow
                    key={contact.id}
                    locale={locale}
                    contact={contact}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}