"use client";

import { ChevronDown, Pilcrow } from "lucide-react";
import type { Editor } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EditorBlockTypeSelectProps {
  editor: Editor;
}

export default function EditorBlockTypeSelect({
  editor,
}: EditorBlockTypeSelectProps) {
  const isParagraph = editor.isActive("paragraph");

  const handleParagraph = () => {
    editor.chain().focus().setParagraph().run();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          onMouseDown={(event) => event.preventDefault()}
          className="h-9 min-w-[125px] justify-between gap-2 rounded-lg px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-orange-500/30"
        >
          <span className="flex items-center gap-2">
            <Pilcrow className="size-4" />
            <span>Paragraph</span>
          </span>

          <ChevronDown className="size-3.5 text-slate-400" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-44 rounded-xl p-1">
        <DropdownMenuItem
          onSelect={handleParagraph}
          className={[
            "cursor-pointer rounded-lg px-3 py-2",
            isParagraph
              ? "bg-orange-50 text-orange-700"
              : "text-slate-600",
          ].join(" ")}
        >
          <Pilcrow className="mr-2 size-4" />
          Paragraph
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}