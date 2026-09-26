import { z } from "zod";

export type SupportedLocale = "en" | "fr";

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
  },
} as const;

export function createContactSchema(locale: SupportedLocale) {
  const messages = validationMessages[locale];

  return z.object({
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
  });
}

export type ContactFormValues = z.infer<
  ReturnType<typeof createContactSchema>
>;