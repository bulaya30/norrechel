"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EditorToolbarButtonProps {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: ReactNode;
}

export default function EditorToolbarButton({
  label,
  active = false,
  disabled = false,
  onClick,
  children,
}: EditorToolbarButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      onMouseDown={(event) => {
        event.preventDefault();
      }}
      onClick={onClick}
      className={cn(
        "size-9 shrink-0 rounded-lg",
        "text-slate-500",
        "transition-colors duration-150",
        "hover:bg-slate-100 hover:text-slate-950",
        "focus-visible:ring-2 focus-visible:ring-orange-500/30",
        active &&
          "bg-orange-50 text-orange-700 hover:bg-orange-100 hover:text-orange-800",
        disabled && "cursor-not-allowed opacity-40",
      )}
    >
      {children}
    </Button>
  );
}