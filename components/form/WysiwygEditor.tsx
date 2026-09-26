"use client";

import { useEffect } from "react";

import {
  EditorContent,
  useEditor,
} from "@tiptap/react";

import EditorToolbar from "./EditorToolbar";

import StarterKit from "@tiptap/starter-kit";

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
}

export default function WysiwygEditor({
  value,
  onChange,
  ariaLabel = "Rich text editor",
}: WysiwygEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
      }),
    ],

    content: value,

    immediatelyRender: false,

    editorProps: {
      attributes: {
        class: [
          "min-h-[320px]",
          "w-full",
          "px-5",
          "py-4",
          "text-base",
          "leading-7",
          "text-slate-800",
          "outline-none",
          "focus:outline-none",
        ].join(" "),

        "aria-label": ariaLabel,
      },
    },

    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  /*
   * Keep the editor synchronized when the value
   * changes externally, for example when resetting
   * the form or later loading an article for editing.
   */
  useEffect(() => {
    if (!editor) {
      return;
    }

    if (editor.getHTML() === value) {
      return;
    }

    editor.commands.setContent(value, {
      emitUpdate: false,
    });
  }, [editor, value]);

  if (!editor) {
    return (
      <div
        className="
          min-h-[320px] animate-pulse
          rounded-xl bg-slate-50
        "
        aria-hidden="true"
      />
    );
  }

  return (
    <div
      className="
        overflow-hidden rounded-xl
        border border-slate-300
        bg-white
        transition-colors
        focus-within:border-blue-600
        focus-within:ring-2
        focus-within:ring-blue-600/10
      "
    >
      <EditorToolbar editor={editor} />

      <EditorContent editor={editor} />
    </div>
  );
}