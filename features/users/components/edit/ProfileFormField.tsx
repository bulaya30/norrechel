import type { ReactNode } from "react";

interface ProfileFormFieldProps {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}

export default function ProfileFormField({
  label,
  error,
  hint,
  children,
}: ProfileFormFieldProps) {
  return (
    <div className="space-y-2">
      <div>
        <label className="text-sm font-medium">
          {label}
        </label>

        {hint && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            {hint}
          </p>
        )}
      </div>

      {children}

      {error && (
        <p className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
