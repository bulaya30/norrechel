
"use client";

import { useTranslations } from "next-intl";

type ContactPurpose = "general" | "business";

interface ContactTypeSelectorProps {
  value: ContactPurpose;
  onChange: (value: ContactPurpose) => void;
}

export default function ContactTypeSelector({
  value,
  onChange,
}: ContactTypeSelectorProps) {
  const t = useTranslations("ContactTypeSelector");

  const options: {
    value: ContactPurpose;
    label: string;
  }[] = [
    { value: "general", label: t("general") },
    { value: "business", label: t("business") },
  ];

  return (
    <div
      role="group"
      aria-label={t("label")}
      className="flex flex-wrap gap-3"
    >
      {options.map((option) => {
        const isSelected = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onChange(option.value)}
            className={`rounded-xl border px-5 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-600 focus-visible:ring-offset-2 ${
              isSelected
                ? "border-orange-600 bg-orange-600 text-white"
                : "border-slate-200 bg-white text-slate-700 hover:border-orange-300 hover:text-orange-700"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
