"use client";

import type { Editor } from "@tiptap/react";

import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Undo2,
  Code2,
  Heading2,
  Heading3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EditorToolbarProps {
  editor: Editor;
}

interface ToolbarButtonProps {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function ToolbarButton({
  label,
  active = false,
  disabled = false,
  onClick,
  children,
}: ToolbarButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        `
          size-9 shrink-0
          text-slate-600
          hover:bg-slate-100
          hover:text-slate-950
        `,
        active &&
          `
            bg-blue-50
            text-blue-700
            hover:bg-blue-100
            hover:text-blue-800
          `,
      )}
    >
      {children}
    </Button>
  );
}

export default function EditorToolbar({
  editor,
}: EditorToolbarProps) {
  return (
    <div
      role="toolbar"
      aria-label="Article formatting tools"
      className="
        flex flex-wrap items-center gap-1
        border-b border-slate-200
        bg-slate-50 px-3 py-2
      "
    >
      <ToolbarButton
        label="Heading 2"
        active={editor.isActive("heading", {
          level: 2,
        })}
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleHeading({ level: 2 })
            .run()
        }
      >
        <Heading2
          className="size-4"
          aria-hidden="true"
        />
      </ToolbarButton>

      <ToolbarButton
        label="Heading 3"
        active={editor.isActive("heading", {
          level: 3,
        })}
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleHeading({ level: 3 })
            .run()
        }
      >
        <Heading3
          className="size-4"
          aria-hidden="true"
        />
      </ToolbarButton>

      <div
        aria-hidden="true"
        className="mx-1 h-6 w-px bg-slate-200"
      />

      <ToolbarButton
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleBold()
            .run()
        }
      >
        <Bold
          className="size-4"
          aria-hidden="true"
        />
      </ToolbarButton>

      <ToolbarButton
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleItalic()
            .run()
        }
      >
        <Italic
          className="size-4"
          aria-hidden="true"
        />
      </ToolbarButton>

      <ToolbarButton
        label="Inline code"
        active={editor.isActive("code")}
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleCode()
            .run()
        }
      >
        <Code2
          className="size-4"
          aria-hidden="true"
        />
      </ToolbarButton>

      <div
        aria-hidden="true"
        className="mx-1 h-6 w-px bg-slate-200"
      />

      <ToolbarButton
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleBulletList()
            .run()
        }
      >
        <List
          className="size-4"
          aria-hidden="true"
        />
      </ToolbarButton>

      <ToolbarButton
        label="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleOrderedList()
            .run()
        }
      >
        <ListOrdered
          className="size-4"
          aria-hidden="true"
        />
      </ToolbarButton>

      <ToolbarButton
        label="Blockquote"
        active={editor.isActive("blockquote")}
        onClick={() =>
          editor
            .chain()
            .focus()
            .toggleBlockquote()
            .run()
        }
      >
        <Quote
          className="size-4"
          aria-hidden="true"
        />
      </ToolbarButton>

      <div
        aria-hidden="true"
        className="mx-1 h-6 w-px bg-slate-200"
      />

      <ToolbarButton
        label="Undo"
        disabled={
          !editor.can().chain().focus().undo().run()
        }
        onClick={() =>
          editor.chain().focus().undo().run()
        }
      >
        <Undo2
          className="size-4"
          aria-hidden="true"
        />
      </ToolbarButton>

      <ToolbarButton
        label="Redo"
        disabled={
          !editor.can().chain().focus().redo().run()
        }
        onClick={() =>
          editor.chain().focus().redo().run()
        }
      >
        <Redo2
          className="size-4"
          aria-hidden="true"
        />
      </ToolbarButton>
    </div>
  );
}