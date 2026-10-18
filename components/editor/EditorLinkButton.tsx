"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { Editor } from "@tiptap/react";
import { Link2, Link2Off } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EditorLinkButtonProps {
  editor: Editor;
}

export default function EditorLinkButton({
  editor,
}: EditorLinkButtonProps) {
  const t = useTranslations("EditorLinkButton");

  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const updateState = () => {
      setIsActive(editor.isActive("link"));

      const href = editor.getAttributes("link").href;
      setUrl(href ?? "");
    };

    updateState();

    editor.on("selectionUpdate", updateState);
    editor.on("transaction", updateState);

    return () => {
      editor.off("selectionUpdate", updateState);
      editor.off("transaction", updateState);
    };
  }, [editor]);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setOpen(false);
      return;
    }

    const { from, to } = editor.state.selection;
    const hasSelection = from !== to;
    const linkActive = editor.isActive("link");

    if (!hasSelection && !linkActive) {
      return;
    }

    const href = editor.getAttributes("link").href;

    setUrl(href ?? "");
    setIsActive(linkActive);
    setOpen(true);
  }

  function handleApply() {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      editor.chain().focus().unsetLink().run();
      setOpen(false);
      return;
    }

    editor
      .chain()
      .focus()
      .setLink({ href: trimmedUrl })
      .run();

    setOpen(false);
  }

  function handleRemove() {
    editor.chain().focus().unsetLink().run();

    setUrl("");
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={t("addLink")}
          aria-pressed={isActive}
          className={[
            "size-9 shrink-0 rounded-lg",
            "text-slate-500",
            "transition-colors duration-150",
            "hover:bg-slate-100 hover:text-slate-950",
            "focus-visible:ring-2 focus-visible:ring-orange-500/30",
            isActive
              ? "bg-orange-50 text-orange-700 hover:bg-orange-100 hover:text-orange-800"
              : "",
          ].join(" ")}
        >
          <Link2 className="size-4" aria-hidden="true" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-80 rounded-xl p-4"
      >
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-slate-950">
              {isActive ? t("editLink") : t("addLink")}
            </h3>

            <p className="mt-1 text-xs text-slate-500">
              {t("urlHint")}
            </p>
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="editor-link-url"
              className="text-xs font-medium text-slate-700"
            >
              {t("urlLabel")}
            </Label>

            <Input
              id="editor-link-url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleApply();
                }

                if (event.key === "Escape") {
                  event.preventDefault();
                  setOpen(false);
                }
              }}
              placeholder="https://example.com"
              autoComplete="url"
              className="h-9 rounded-lg text-sm focus-visible:ring-orange-500/30"
            />
          </div>

          <div className="flex items-center justify-between gap-2">
            {isActive ? (
              <Button
                type="button"
                variant="ghost"
                onClick={handleRemove}
                className="h-9 gap-2 rounded-lg px-3 text-xs font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <Link2Off className="size-3.5" aria-hidden="true" />
                {t("remove")}
              </Button>
            ) : (
              <span />
            )}

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                className="h-9 rounded-lg px-3 text-xs font-medium text-slate-600"
              >
                {t("cancel")}
              </Button>

              <Button
                type="button"
                onClick={handleApply}
                className="h-9 rounded-lg bg-slate-950 px-3 text-xs font-semibold text-white hover:bg-orange-600"
              >
                {t("apply")}
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}