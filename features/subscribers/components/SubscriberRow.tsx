"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import {
  MoreHorizontal,
  RefreshCcw,
  Trash2,
  UserMinus,
} from "lucide-react";
import { useRouter } from "next/navigation";

import StatusBadge from "@/components/StatusBadge";
import ConfirmDialog from "@/components/ConfirmDialog";
import { readableDate } from "@/lib/dates/utils";

import {
  deleteSubscriberAction,
  reactivateSubscriberAction,
  unsubscribeSubscriberAction,
} from "@/features/subscribers/actions/subscriber.actions";

import type { Subscriber } from "@/features/interfaces/subscriber";

interface SubscriberRowProps {
  subscriber: Subscriber;
}

type DialogAction = "unsubscribe" | "delete" | null;

export default function SubscriberRow({
  subscriber,
}: SubscriberRowProps) {
  const t = useTranslations("SubscriberPage.SubscriberRow");
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialogAction, setDialogAction] =
    useState<DialogAction>(null);

  const isActive = subscriber.active !== false;

  function handleUnsubscribe() {
    setError(null);
    setMenuOpen(false);
    setDialogAction("unsubscribe");
  }

  function handleReactivate() {
    if (!subscriber.id) return;

    setError(null);
    setMenuOpen(false);

    startTransition(async () => {
      const result = await reactivateSubscriberAction(
        subscriber.id ?? null,
      );

      if (!result.success) {
        setError(result.message);
        return;
      }

      router.refresh();
    });
  }

  function handleDelete() {
    setError(null);
    setMenuOpen(false);
    setDialogAction("delete");
  }

  function handleConfirmAction() {
    if (!subscriber.id || !dialogAction) return;

    const action = dialogAction;

    startTransition(async () => {
      const result =
        action === "unsubscribe"
          ? await unsubscribeSubscriberAction(subscriber.id!)
          : await deleteSubscriberAction(subscriber.id!);

      if (!result.success) {
        setError(result.message);
        return;
      }

      setDialogAction(null);
      router.refresh();
    });
  }

  return (
    <>
      <tr className="transition-colors hover:bg-muted/30">
        {/* Email */}
        <td className="px-4 py-4">
          <div className="min-w-0">
            <p className="truncate font-medium">
              {subscriber.email}
            </p>

            {error && (
              <p
                role="alert"
                className="mt-1 text-xs text-destructive"
              >
                {error}
              </p>
            )}
          </div>
        </td>

        {/* Status */}
        <td className="px-4 py-4">
          <StatusBadge
            status={isActive ? "active" : "inactive"}
          />
        </td>

        {/* Subscription date */}
        <td className="px-4 py-4 text-muted-foreground">
          {readableDate(subscriber.date)}
        </td>

        {/* Unsubscription date */}
        <td className="px-4 py-4 text-muted-foreground">
          {readableDate(subscriber.unsubscribedAt)}
        </td>

        {/* Actions */}
        <td className="px-4 py-4 text-right">
          <div className="relative inline-block">
            <button
              type="button"
              onClick={() => setMenuOpen((previous) => !previous)}
              disabled={isPending}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-background transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
              aria-label={t("subscriberActions")}
              aria-expanded={menuOpen}
            >
              {isPending ? (
                <RefreshCcw
                  className="h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <MoreHorizontal
                  className="h-4 w-4"
                  aria-hidden="true"
                />
              )}
            </button>

            {menuOpen && (
              <div className="absolute right-0 z-20 mt-2 w-44 rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
                {isActive ? (
                  <button
                    type="button"
                    onClick={handleUnsubscribe}
                    disabled={isPending}
                    className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-muted disabled:opacity-50"
                  >
                    <UserMinus
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                    {t("unsubscribe")}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleReactivate}
                    disabled={isPending}
                    className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm hover:bg-muted disabled:opacity-50"
                  >
                    <RefreshCcw
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                    {t("reactivate")}
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isPending}
                  className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-destructive hover:bg-muted disabled:opacity-50"
                >
                  <Trash2
                    className="h-4 w-4"
                    aria-hidden="true"
                  />
                  {t("delete")}
                </button>
              </div>
            )}
          </div>
        </td>
      </tr>

      <ConfirmDialog
        open={dialogAction !== null}
        onOpenChange={(open) => {
          if (!open && !isPending) {
            setDialogAction(null);
          }
        }}
        title={
          dialogAction === "delete"
            ? t("deleteTitle")
            : t("unsubscribeTitle")
        }
        description={
          dialogAction === "delete"
            ? t("deleteDescription", {
                email: subscriber.email,
              })
            : t("unsubscribeDescription", {
                email: subscriber.email,
              })
        }
        confirmLabel={
          dialogAction === "delete"
            ? t("delete")
            : t("unsubscribe")
        }
        destructive={dialogAction === "delete"}
        loading={isPending}
        onConfirm={handleConfirmAction}
      />
    </>
  );
}