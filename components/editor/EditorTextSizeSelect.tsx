"use client";

import { Check, ChevronDown, Type } from "lucide-react";
import type { Editor } from "@tiptap/react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  DEFAULT_FONT_SIZE,
  FONT_SIZES,
  type FontSize,
} from "./fontSize";

interface EditorTextSizeSelectProps {
  editor: Editor;
}

function getCurrentFontSize(editor: Editor): FontSize {
  const fontSize = editor.getAttributes("textStyle").fontSize;

  if (FONT_SIZES.includes(fontSize as FontSize)) {
    return fontSize as FontSize;
  }

  return DEFAULT_FONT_SIZE;
}

export default function EditorTextSizeSelect({
  editor,
}: EditorTextSizeSelectProps) {
  const currentSize = getCurrentFontSize(editor);

  const handleSelect = (size: FontSize) => {
    editor.chain().focus().setFontSize(size).run();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          onMouseDown={(event) => {
            event.preventDefault();
          }}
          className="h-9 min-w-[105px] justify-between gap-2 rounded-lg px-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-2 focus-visible:ring-orange-500/30"
          aria-label="Text size"
        >
          <span className="flex items-center gap-2">
            <Type
              className="size-4 shrink-0"
              aria-hidden="true"
            />

            <span>{currentSize}</span>
          </span>

          <ChevronDown
            className="size-3.5 shrink-0 text-slate-400"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-36 rounded-xl p-1"
      >
        {FONT_SIZES.map((size) => {
          const isActive = size === currentSize;

          return (
            <DropdownMenuItem
              key={size}
              onSelect={() => handleSelect(size)}
              className={[
                "cursor-pointer rounded-lg px-3 py-2",
                isActive
                  ? "bg-orange-50 text-orange-700"
                  : "text-slate-600",
              ].join(" ")}
            >
              <span className="flex-1">{size}</span>

              {isActive && (
                <Check
                  className="size-4"
                  aria-hidden="true"
                />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}