"use client";

import { useEffect, useState } from "react";
import {
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Pilcrow,
  ChevronDown,
} from "lucide-react";
import type { Editor } from "@tiptap/react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EditorBlockSelectProps {
  editor: Editor;
}

const blocks = [
  {
    label: "Paragraph",
    icon: Pilcrow,
    isActive: (editor: Editor) => editor.isActive("paragraph"),
    apply: (editor: Editor) =>
      editor.chain().focus().setParagraph().run(),
  },
  {
    label: "Heading 1",
    icon: Heading1,
    level: 1 as const,
    isActive: (editor: Editor) =>
      editor.isActive("heading", { level: 1 }),
    apply: (editor: Editor) =>
      editor.chain().focus().setHeading({ level: 1 }).run(),
  },
  {
    label: "Heading 2",
    icon: Heading2,
    level: 2 as const,
    isActive: (editor: Editor) =>
      editor.isActive("heading", { level: 2 }),
    apply: (editor: Editor) =>
      editor.chain().focus().setHeading({ level: 2 }).run(),
  },
  {
    label: "Heading 3",
    icon: Heading3,
    level: 3 as const,
    isActive: (editor: Editor) =>
      editor.isActive("heading", { level: 3 }),
    apply: (editor: Editor) =>
      editor.chain().focus().setHeading({ level: 3 }).run(),
  },
  {
    label: "Heading 4",
    icon: Heading4,
    level: 4 as const,
    isActive: (editor: Editor) =>
      editor.isActive("heading", { level: 4 }),
    apply: (editor: Editor) =>
      editor.chain().focus().setHeading({ level: 4 }).run(),
  },
  {
    label: "Heading 5",
    icon: Heading5,
    level: 5 as const,
    isActive: (editor: Editor) =>
      editor.isActive("heading", { level: 5 }),
    apply: (editor: Editor) =>
      editor.chain().focus().setHeading({ level: 5 }).run(),
  },
  {
    label: "Heading 6",
    icon: Heading6,
    level: 6 as const,
    isActive: (editor: Editor) =>
      editor.isActive("heading", { level: 6 }),
    apply: (editor: Editor) =>
      editor.chain().focus().setHeading({ level: 6 }).run(),
  },
];

export default function EditorBlockSelect({
  editor,
}: EditorBlockSelectProps) {
  const [activeLabel, setActiveLabel] = useState("Paragraph");

  useEffect(() => {
    const updateActiveBlock = () => {
      const activeBlock =
        blocks.find((block) => block.isActive(editor)) ?? blocks[0];

      setActiveLabel(activeBlock.label);
    };

    // Initial state
    updateActiveBlock();

    // Selection changes
    editor.on("selectionUpdate", updateActiveBlock);

    // Content changes can also change the active block
    editor.on("transaction", updateActiveBlock);

    return () => {
      editor.off("selectionUpdate", updateActiveBlock);
      editor.off("transaction", updateActiveBlock);
    };
  }, [editor]);

  const activeBlock =
    blocks.find((block) => block.label === activeLabel) ?? blocks[0];

  const ActiveIcon = activeBlock.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          className="h-9 min-w-[135px] justify-between gap-2 rounded-lg px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-orange-500/30"
          aria-label="Text style"
        >
          <span className="flex items-center gap-2">
            <ActiveIcon className="size-4 shrink-0" />
            <span>{activeLabel}</span>
          </span>

          <ChevronDown className="size-3.5 shrink-0 text-slate-400" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-52 rounded-xl p-1"
      >
        {blocks.map((block) => {
          const Icon = block.icon;
          const active = block.label === activeLabel;

          return (
            <DropdownMenuItem
              key={block.label}
              onSelect={() => block.apply(editor)}
              className={[
                "cursor-pointer rounded-lg px-3 py-2",
                active
                  ? "bg-orange-50 text-orange-700"
                  : "text-slate-600",
              ].join(" ")}
            >
              <Icon className="mr-2 size-4" />
              <span>{block.label}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}