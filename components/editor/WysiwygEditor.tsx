"use client";

import { useEffect } from "react";
import type { Editor } from "@tiptap/react";
import {
  EditorContent,
  useEditor,
} from "@tiptap/react";

import EditorToolbar from "./EditorToolbar";
import { editorExtensions } from "./editorExtensions";

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}

export default function WysiwygEditor({
  value,
  onChange,
  placeholder = "Start writing your article...",
  ariaLabel = "Article content editor",
}: WysiwygEditorProps) {
  const editor = useEditor({
    extensions: editorExtensions,

    content: value,

    immediatelyRender: false,

    editorProps: {
      attributes: {
        "aria-label": ariaLabel,

        class: [
          "min-h-[360px]",
          "w-full",
          "px-5",
          "py-5",
          "outline-none",
          "text-[15px]",
          "leading-7",
          "text-slate-800",

          // Paragraphs
          "[&_p]:my-0",
          "[&_p+_p]:mt-4",

          // Headings
          "[&_h2]:mb-4",
          "[&_h2]:mt-8",
          "[&_h2]:text-2xl",
          "[&_h2]:font-bold",
          "[&_h2]:leading-tight",
          "[&_h2]:tracking-tight",
          "[&_h2]:text-slate-950",

          "[&_h3]:mb-3",
          "[&_h3]:mt-7",
          "[&_h3]:text-xl",
          "[&_h3]:font-bold",
          "[&_h3]:leading-tight",
          "[&_h3]:text-slate-950",

          "[&_h4]:mb-2",
          "[&_h4]:mt-6",
          "[&_h4]:text-lg",
          "[&_h4]:font-semibold",
          "[&_h4]:leading-tight",
          "[&_h4]:text-slate-950",

          // Lists
          "[&_ul]:my-4",
          "[&_ul]:list-disc",
          "[&_ul]:pl-6",

          "[&_ol]:my-4",
          "[&_ol]:list-decimal",
          "[&_ol]:pl-6",

          "[&_li]:my-1",

          // Blockquote
          "[&_blockquote]:my-6",
          "[&_blockquote]:border-l-4",
          "[&_blockquote]:border-orange-400",
          "[&_blockquote]:pl-4",
          "[&_blockquote]:italic",
          "[&_blockquote]:text-slate-600",

          // Inline code
          "[&_code]:rounded-md",
          "[&_code]:bg-slate-100",
          "[&_code]:px-1.5",
          "[&_code]:py-0.5",
          "[&_code]:font-mono",
          "[&_code]:text-[0.9em]",
          "[&_code]:text-orange-700",

          // Code blocks
          "[&_pre]:my-6",
          "[&_pre]:overflow-x-auto",
          "[&_pre]:rounded-xl",
          "[&_pre]:bg-slate-950",
          "[&_pre]:p-4",
          "[&_pre]:font-mono",
          "[&_pre]:text-sm",
          "[&_pre]:leading-6",
          "[&_pre]:text-slate-100",

          "[&_pre_code]:bg-transparent",
          "[&_pre_code]:p-0",
          "[&_pre_code]:text-inherit",

          // Horizontal rule
          "[&_hr]:my-8",
          "[&_hr]:border-0",
          "[&_hr]:border-t",
          "[&_hr]:border-slate-200",

          // Links
          "[&_a]:font-medium",
          "[&_a]:text-orange-600",
          "[&_a]:underline",
          "[&_a]:underline-offset-2",

          // Text selection
          "selection:bg-orange-100",
          "selection:text-orange-950",
        ].join(" "),
      },
    },

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  /*
   * Synchronize external value changes.
   *
   * This handles:
   * - editing an existing article
   * - resetting the form
   * - switching between articles
   * - asynchronously loaded content
   */
  useEffect(() => {
    if (!editor) {
      return;
    }

    const currentContent = editor.getHTML();

    if (currentContent === value) {
      return;
    }

    editor.commands.setContent(value, {
      emitUpdate: false,
    });
  }, [editor, value]);

  if (!editor) {
    return <EditorLoadingState />;
  }

  return (
    <div
      className="
        overflow-hidden
        rounded-xl
        border
        border-slate-200
        bg-white
        shadow-sm
        transition
        duration-200
        focus-within:border-orange-400
        focus-within:ring-4
        focus-within:ring-orange-500/10
      "
    >
      <EditorToolbar editor={editor} />

      <div className="relative bg-white">
        {editor.isEmpty && (
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              left-5
              top-5
              z-0
              text-[15px]
              leading-7
              text-slate-400
            "
          >
            {placeholder}
          </div>
        )}

        <EditorContent editor={editor} />
      </div>

      <EditorFooter editor={editor} />
    </div>
  );
}

function EditorLoadingState() {
  return (
    <div
      className="
        overflow-hidden
        rounded-xl
        border
        border-slate-200
        bg-white
        shadow-sm
      "
      aria-hidden="true"
    >
      {/* Toolbar skeleton */}
      <div
        className="
          flex
          h-[58px]
          items-center
          gap-2
          border-b
          border-slate-200
          bg-white
          px-3
        "
      >
        <div className="h-9 w-32 animate-pulse rounded-lg bg-slate-100" />

        <div className="h-6 w-px bg-slate-200" />

        <div className="size-9 animate-pulse rounded-lg bg-slate-100" />
        <div className="size-9 animate-pulse rounded-lg bg-slate-100" />
        <div className="size-9 animate-pulse rounded-lg bg-slate-100" />
      </div>

      {/* Content skeleton */}
      <div className="min-h-[360px] space-y-4 px-5 py-6">
        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-slate-100" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
      </div>
    </div>
  );
}

function EditorFooter({ editor }: { editor: Editor }) {
  const characterCount =
    editor.state.doc.textContent.length;

  const wordCount = editor.state.doc.textContent
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return (
    <div
      className="
        flex
        items-center
        justify-end
        gap-4
        border-t
        border-slate-100
        bg-slate-50/70
        px-4
        py-2
        text-xs
        font-medium
        text-slate-400
      "
    >
      <span>
        {wordCount.toLocaleString()}{" "}
        {wordCount === 1 ? "word" : "words"}
      </span>

      <span
        aria-hidden="true"
        className="h-3.5 w-px bg-slate-200"
      />

      <span>
        {characterCount.toLocaleString()}{" "}
        {characterCount === 1
          ? "character"
          : "characters"}
      </span>
    </div>
  );
}