
"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Eye, Mail, MoreHorizontal, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  deleteContactAction,
  markContactAsRepliedAction,
} from "@/features/contacts/actions/contact.actions";

import StatusBadge from "@/components/StatusBadge";

import { readableDate } from "@/lib/dates/utils";

import type { Contact } from "@/features/interfaces/contact";

type SupportedLocale = "en" | "fr";
interface ContactRowProps {
  locale: SupportedLocale
  contact: Contact;
}

export default function ContactRow({
    locale,
  contact,
}: ContactRowProps) {
  const router = useRouter();

  const [isPending, startTransition] =
    useTransition();

  const [showActions, setShowActions] =
    useState(false);

  function handleView() {
    if (!contact.id) {
      return;
    }

    router.push(
      `/${locale}/dashboard/contacts/${contact.id}`,
    );
  }

  function handleMarkAsReplied() {
    if (!contact.id) {
      return;
    }

    startTransition(async () => {
      const response =
        await markContactAsRepliedAction(
          contact.id!,
        );

      if (!response.success) {
        console.error(response.message);
        return;
      }

      router.refresh();
    });
  }

  function handleDelete() {
    if (!contact.id) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this contact?",
    );

    if (!confirmed) {
      return;
    }

    startTransition(async () => {
      const response =
        await deleteContactAction(
          contact.id!,
        );

      if (!response.success) {
        console.error(response.message);
        return;
      }

      router.refresh();
    });
  }

  return (
    <tr
      className={`
        transition-colors
        hover:bg-slate-50
        ${isPending ? "opacity-60" : ""}
      `}
    >
      {/* Contact */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div
            className="
              flex size-9 shrink-0
              items-center justify-center
              rounded-xl
              bg-blue-50
              text-blue-700
              ring-1 ring-blue-100
            "
          >
            <Mail
              className="size-4"
              aria-hidden="true"
            />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-900">
              {contact.name}
            </p>

            <p className="truncate text-xs text-slate-500">
              {contact.email}
            </p>
          </div>
        </div>
      </td>

      {/* Subject */}
      <td className="max-w-xs px-6 py-4">
        <p className="truncate text-sm text-slate-700">
          {contact.subject || "No subject"}
        </p>
      </td>

      {/* Source */}
      <td className="px-6 py-4">
        <span
          className="
            inline-flex
            max-w-[180px]
            truncate
            rounded-md
            bg-slate-100
            px-2.5 py-1
            text-xs font-medium
            text-slate-600
          "
          title={contact.source_page}
        >
          {contact.source_page}
        </span>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <StatusBadge status={contact.status} />
      </td>

      {/* Submitted */}
      <td className="whitespace-nowrap px-6 py-4">
        <span className="text-sm text-slate-600">
          {readableDate(contact.submittedAt)}
        </span>
      </td>

      {/* Actions */}
      <td className="px-6 py-4">
        <div className="flex justify-end">
          <div className="relative">
            <button
              type="button"
              onClick={() =>
                setShowActions((current) => !current)
              }
              disabled={isPending}
              aria-label={`Actions for ${contact.name}`}
              aria-expanded={showActions}
              className="
                flex size-9
                items-center justify-center
                rounded-lg
                text-slate-500
                transition
                hover:bg-slate-100
                hover:text-slate-900
                hover:cursor-pointer
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              <MoreHorizontal
                className="size-5"
                aria-hidden="true"
              />
            </button>

            {showActions && (
              <div
                className="
                  absolute right-0 z-20 mt-2
                  w-48
                  overflow-hidden
                  rounded-xl
                  border border-slate-200
                  bg-white
                  py-1
                  shadow-lg
                "
              >
                {/* View */}
                <button
                  type="button"
                  onClick={() => {
                    setShowActions(false);
                    handleView();
                  }}
                  className="
                    flex w-full
                    items-center gap-3
                    px-4 py-2.5
                    text-left text-sm
                    text-slate-700
                    transition
                    hover:bg-slate-50
                  "
                >

                    <Link
                        href={`/${locale}/dashboard/contacts/${contact.id}`}
                        className="
                            flex items-center gap-2
                        "
                    >
                        <Eye
                            className="size-4"
                            aria-hidden="true"
                        />
                        <span>
                            View contact
                        </span>
                    </Link>
                </button>

                {/* Mark as replied */}
                {contact?.status === "new" && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowActions(false);
                      handleMarkAsReplied();
                    }}
                    disabled={isPending}
                    className="
                      flex w-full
                      items-center gap-3
                      px-4 py-2.5
                      text-left text-sm
                      text-slate-700
                      transition
                      hover:bg-slate-50
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    <Mail
                      className="size-4"
                      aria-hidden="true"
                    />

                    Mark as replied
                  </button>
                )}

                {/* Delete */}
                <button
                  type="button"
                  onClick={() => {
                    setShowActions(false);
                    handleDelete();
                  }}
                  disabled={isPending}
                  className="
                    flex w-full
                    items-center gap-3
                    px-4 py-2.5
                    text-left text-sm
                    text-red-600
                    transition
                    hover:bg-red-50
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  <Trash2
                    className="size-4"
                    aria-hidden="true"
                  />

                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </td>
    </tr>
  );
}

