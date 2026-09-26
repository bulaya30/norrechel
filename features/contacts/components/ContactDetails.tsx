"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  MessageSquare,
  User,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { markContactAsRepliedAction } from "@/features/contacts/actions/contact.actions";

import StatusBadge from "@/components/StatusBadge";

import type { Contact } from "@/features/interfaces/contact";

import { readableDate } from "@/lib/dates/utils";

type SupportedLocale = "en" | "fr";

interface ContactDetailsProps {
  locale: SupportedLocale;
  contact: Contact;
}

export default function ContactDetails({
  locale,
  contact,
}: ContactDetailsProps) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  const [error, setError] = useState<string | null>(
    null,
  );

  function handleBack() {
    router.push(`/${locale}/dashboard/contacts`);
  }

  function handleMarkAsReplied() {
    if (!contact.id) {
      setError("Contact ID is missing.");
      return;
    }

    setError(null);

    startTransition(async () => {
      const response =
        await markContactAsRepliedAction(
          contact.id!,
        );

      if (!response.success) {
        setError(response.message);
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="space-y-6">
      {/* -------------------------------------------
       * Header
       * ------------------------------------------- */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="
            inline-flex w-fit
            items-center gap-2
            text-sm font-medium
            text-slate-600
            transition
            hover:text-slate-950
          "
        >
          <ArrowLeft
            className="size-4"
            aria-hidden="true"
          />

          Back to contacts
        </button>

        {contact?.status === "new" && (
          <button
            type="button"
            onClick={handleMarkAsReplied}
            disabled={isPending}
            className="
              inline-flex items-center
              justify-center gap-2
              rounded-lg
              bg-blue-600
              px-4 py-2.5
              text-sm font-semibold
              text-white
              shadow-sm
              transition
              hover:bg-blue-700
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
          >
            <CheckCircle2
              className="size-4"
              aria-hidden="true"
            />

            {isPending
              ? "Updating..."
              : "Mark as replied"}
          </button>
        )}
      </div>

      {/* -------------------------------------------
       * Error
       * ------------------------------------------- */}

      {error && (
        <div
          role="alert"
          className="
            rounded-xl
            border border-red-200
            bg-red-50
            px-4 py-3
            text-sm font-medium
            text-red-700
          "
        >
          {error}
        </div>
      )}

      {/* -------------------------------------------
       * Contact header
       * ------------------------------------------- */}

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div
                className="
                  flex size-11 shrink-0
                  items-center justify-center
                  rounded-2xl
                  bg-blue-50
                  text-blue-700
                  ring-1 ring-blue-100
                "
              >
                <User
                  className="size-5"
                  aria-hidden="true"
                />
              </div>

              <div className="min-w-0">
                <CardTitle className="text-lg font-bold text-slate-950">
                  {contact.name}
                </CardTitle>

                <a
                  href={`mailto:${contact.email}`}
                  className="
                    mt-1 inline-flex
                    items-center gap-2
                    text-sm
                    text-blue-600
                    hover:text-blue-700
                  "
                >
                  <Mail
                    className="size-4"
                    aria-hidden="true"
                  />

                  {contact.email}
                </a>
              </div>
            </div>

            <StatusBadge status={contact?.status ?? null} />
          </div>
        </CardHeader>
      </Card>

      {/* -------------------------------------------
       * Message
       * ------------------------------------------- */}

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div
              className="
                flex size-10
                items-center justify-center
                rounded-xl
                bg-blue-50
                text-blue-700
                ring-1 ring-blue-100
              "
            >
              <MessageSquare
                className="size-5"
                aria-hidden="true"
              />
            </div>

            <div>
              <CardTitle className="text-lg font-bold text-slate-950">
                {contact.subject || "No subject"}
              </CardTitle>

              <p className="mt-1 text-sm text-slate-500">
                Message
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div
            className="
              whitespace-pre-wrap
              rounded-lg
              bg-slate-50
              p-5
              text-sm
              leading-7
              text-slate-700
            "
          >
            {contact.message}
          </div>
        </CardContent>
      </Card>

      {/* -------------------------------------------
       * Contact metadata
       * ------------------------------------------- */}

      <Card className="border-slate-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-950">
            Contact information
          </CardTitle>
        </CardHeader>

        <CardContent>
          <dl className="grid gap-5 sm:grid-cols-2">
            <InfoItem
              label="Source page"
              value={contact.source_page}
            />

            <InfoItem
              label="Content type"
              value={contact.content_type}
            />

            <InfoItem
              label="Content ID"
              value={contact.content_id || "—"}
            />

            <InfoItem
              label="Submitted"
              value={readableDate(contact.submittedAt)}
            />

            <InfoItem
              label="Replied"
              value={readableDate(contact.repliedAt)}
            />
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}

/*
 * -------------------------------------------
 * Information item
 * -------------------------------------------
 */

interface InfoItemProps {
  label: string;
  value: string;
}

function InfoItem({
  label,
  value,
}: InfoItemProps) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </dt>

      <dd className="mt-1 break-words text-sm text-slate-800">
        {value}
      </dd>
    </div>
  );
}
