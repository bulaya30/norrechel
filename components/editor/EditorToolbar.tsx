"use client";

import { useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Undo2,
  Redo2,
} from "lucide-react";

import EditorBlockSelect from "./EditorBlockSelect";
import EditorTextSizeSelect from "./EditorTextSizeSelect";
import EditorToolbarButton from "./EditorToolbarButton";
import EditorLinkButton from "./EditorLinkButton";

interface EditorToolbarProps {
  editor: Editor;
}

function ToolbarSeparator() {
  return (
    <span
      role="separator"
      aria-orientation="vertical"
      className="mx-1 h-6 w-px shrink-0 bg-slate-200"
    />
  );
}

export default function EditorToolbar({
  editor,
}: EditorToolbarProps) {
  const [, setEditorState] = useState(0);

  useEffect(() => {
    const updateToolbar = () => {
      setEditorState((value) => value + 1);
    };

    editor.on("selectionUpdate", updateToolbar);
    editor.on("transaction", updateToolbar);

    return () => {
      editor.off("selectionUpdate", updateToolbar);
      editor.off("transaction", updateToolbar);
    };
  }, [editor]);

  const canUndo = editor.can().undo();
  const canRedo = editor.can().redo();

  return (
    <div
      role="toolbar"
      aria-label="Article formatting tools"
      className="flex w-full items-center gap-1 overflow-x-auto border-b border-slate-200 bg-white px-3 py-2"
    >
      {/* Block */}
      <EditorBlockSelect editor={editor} />

      {/* Font size */}
      <EditorTextSizeSelect editor={editor} />

      <ToolbarSeparator />

      {/* Text formatting */}

      <EditorToolbarButton
        label="Bold"
        active={editor.isActive("bold")}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        onClick={() => {
          editor.chain().focus().toggleBold().run();
        }}
      >
        <Bold className="size-4" />
      </EditorToolbarButton>

      <EditorToolbarButton
        label="Italic"
        active={editor.isActive("italic")}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        onClick={() => {
          editor.chain().focus().toggleItalic().run();
        }}
      >
        <Italic className="size-4" />
      </EditorToolbarButton>

      <EditorToolbarButton
        label="Underline"
        active={editor.isActive("underline")}
        disabled={
          !editor.can().chain().focus().toggleUnderline().run()
        }
        onClick={() => {
          editor.chain().focus().toggleUnderline().run();
        }}
      >
        <Underline className="size-4" />
      </EditorToolbarButton>

      <EditorToolbarButton
        label="Strikethrough"
        active={editor.isActive("strike")}
        disabled={
          !editor.can().chain().focus().toggleStrike().run()
        }
        onClick={() => {
          editor.chain().focus().toggleStrike().run();
        }}
      >
        <Strikethrough className="size-4" />
      </EditorToolbarButton>

      <EditorToolbarButton
        label="Inline code"
        active={editor.isActive("code")}
        disabled={
          !editor.can().chain().focus().toggleCode().run()
        }
        onClick={() => {
          editor.chain().focus().toggleCode().run();
        }}
      >
        <Code2 className="size-4" />
      </EditorToolbarButton>

      {/* Link */}
      <EditorLinkButton editor={editor} />

      <ToolbarSeparator />

      {/* Lists */}

      <EditorToolbarButton
        label="Bullet list"
        active={editor.isActive("bulletList")}
        disabled={
          !editor.can().chain().focus().toggleBulletList().run()
        }
        onClick={() => {
          editor.chain().focus().toggleBulletList().run();
        }}
      >
        <List className="size-4" />
      </EditorToolbarButton>

      <EditorToolbarButton
        label="Ordered list"
        active={editor.isActive("orderedList")}
        disabled={
          !editor.can().chain().focus().toggleOrderedList().run()
        }
        onClick={() => {
          editor.chain().focus().toggleOrderedList().run();
        }}
      >
        <ListOrdered className="size-4" />
      </EditorToolbarButton>

      <ToolbarSeparator />

      {/* Blocks */}

      <EditorToolbarButton
        label="Blockquote"
        active={editor.isActive("blockquote")}
        disabled={
          !editor.can().chain().focus().toggleBlockquote().run()
        }
        onClick={() => {
          editor.chain().focus().toggleBlockquote().run();
        }}
      >
        <Quote className="size-4" />
      </EditorToolbarButton>

      <EditorToolbarButton
        label="Code block"
        active={editor.isActive("codeBlock")}
        disabled={
          !editor.can().chain().focus().toggleCodeBlock().run()
        }
        onClick={() => {
          editor.chain().focus().toggleCodeBlock().run();
        }}
      >
        <Code2 className="size-4" />
      </EditorToolbarButton>

      <EditorToolbarButton
        label="Horizontal rule"
        onClick={() => {
          editor.chain().focus().setHorizontalRule().run();
        }}
      >
        <Minus className="size-4" />
      </EditorToolbarButton>

      <ToolbarSeparator />

      {/* History */}

      <EditorToolbarButton
        label="Undo"
        disabled={!canUndo}
        onClick={() => {
          editor.chain().focus().undo().run();
        }}
      >
        <Undo2 className="size-4" />
      </EditorToolbarButton>

      <EditorToolbarButton
        label="Redo"
        disabled={!canRedo}
        onClick={() => {
          editor.chain().focus().redo().run();
        }}
      >
        <Redo2 className="size-4" />
      </EditorToolbarButton>
    </div>
  );
}