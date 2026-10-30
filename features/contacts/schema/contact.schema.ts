
import { z } from "zod";

import type {
  ProjectType,
  ProjectBudget,
} from "@/features/interfaces/contact";

export type { ProjectType, ProjectBudget } from "@/features/interfaces/contact";

export type SupportedLocale = "en" | "fr";

const projectTypes = [
  "website",
  "custom-software",
  "dashboard",
  "management-system",
  "other",
] as const satisfies readonly ProjectType[];

const projectBudgets = [
  "under-500k",
  "500k-1m",
  "1m-3m",
  "3m-5m",
  "5m-10m",
  "above-10m",
  "not-sure",
] as const satisfies readonly ProjectBudget[];

const validationMessages = {
  en: {
    nameRequired: "Your full name is required.",
    nameTooShort: "Your name must contain at least 3 characters.",
    nameTooLong: "Your name cannot exceed 60 characters.",
    nameInvalid:
      "Your name can only contain letters, spaces, apostrophes, and hyphens.",
    emailRequired: "Your email address is required.",
    emailInvalid: "Enter a valid email address.",
    messageRequired: "Your message is required.",
    messageTooShort: "Your message must contain at least 10 characters.",
    messageTooLong: "Your message cannot exceed 2,000 characters.",
    businessNameTooLong:
      "Business name cannot exceed 100 characters.",
    projectTypeRequired: "Please select a project type.",
    projectTypeInvalid: "Please select a valid project type.",
    budgetInvalid: "Please select a valid budget range.",
  },

  fr: {
    nameRequired: "Votre nom complet est obligatoire.",
    nameTooShort: "Votre nom doit contenir au moins 3 caractères.",
    nameTooLong: "Votre nom ne peut pas dépasser 60 caractères.",
    nameInvalid:
      "Votre nom ne peut contenir que des lettres, des espaces, des apostrophes et des traits d’union.",
    emailRequired: "Votre adresse e-mail est obligatoire.",
    emailInvalid: "Entrez une adresse e-mail valide.",
    messageRequired: "Votre message est obligatoire.",
    messageTooShort: "Votre message doit contenir au moins 10 caractères.",
    messageTooLong: "Votre message ne peut pas dépasser 2 000 caractères.",
    businessNameTooLong:
      "Le nom de l’entreprise ne peut pas dépasser 100 caractères.",
    projectTypeRequired: "Veuillez sélectionner un type de projet.",
    projectTypeInvalid: "Veuillez sélectionner un type de projet valide.",
    budgetInvalid: "Veuillez sélectionner une fourchette de budget valide.",
  },
} as const;

function createCommonFields(locale: SupportedLocale) {
  const messages = validationMessages[locale];

  return {
    name: z
      .string()
      .trim()
      .min(1, messages.nameRequired)
      .min(3, messages.nameTooShort)
      .max(60, messages.nameTooLong)
      .regex(/^[\p{L}\p{M}' -]+$/u, messages.nameInvalid),

    email: z
      .string()
      .trim()
      .min(1, messages.emailRequired)
      .email(messages.emailInvalid),

    message: z
      .string()
      .trim()
      .min(1, messages.messageRequired)
      .min(10, messages.messageTooShort)
      .max(2000, messages.messageTooLong),
  };
}

export function createContactSchema(locale: SupportedLocale) {
  return z.object({
    ...createCommonFields(locale),
  });
}

export function createBusinessContactSchema(
  locale: SupportedLocale,
) {
  const messages = validationMessages[locale];

  return z.object({
    ...createCommonFields(locale),

    purpose: z.literal("business"),

    businessName: z
      .string()
      .trim()
      .max(100, messages.businessNameTooLong)
      .optional()
      .or(z.literal("")),

    projectType: z.enum(projectTypes, {
      error: messages.projectTypeRequired,
    }),

    budget: z
      .enum(projectBudgets, {
        error: messages.budgetInvalid,
      })
      .optional(),
  });
}

export type ContactFormValues = z.infer<
  ReturnType<typeof createContactSchema>
>;

export type BusinessContactFormValues = z.infer<
  ReturnType<typeof createBusinessContactSchema>
>;
