import { z } from "zod";
import { hasMeaningfulHtmlContent } from "@/lib/helpers";

const requiredTitleSchema = z
  .string()
  .trim()
  .min(3, "Title must contain at least 3 characters.")
  .max(180, "Title must not exceed 180 characters.");

const optionalContentSchema = z.string();

const requiredContentSchema = z
  .string()
  .refine(
    hasMeaningfulHtmlContent,
    "Article content is required.",
  );

/*
 * Draft:
 */
export const draftArticleSchema = z.object({
  title: z.object({
    en: requiredTitleSchema,
    fr: requiredTitleSchema,
  }),

  content: z.object({
    en: optionalContentSchema,
    fr: optionalContentSchema,
  }),

  categoryId: z
   .string()
   .trim()
   .min(1, "Category is required."),

  coverImage: z
    .instanceof(File)
    .nullable()
    .optional(),
});

/*
 * Published
 */
export const publishArticleSchema = z.object({
  title: z.object({
    en: requiredTitleSchema,
    fr: requiredTitleSchema,
  }),

  content: z.object({
    en: requiredContentSchema,
    fr: requiredContentSchema,
  }),

  categoryId: z
    .string()
    .trim()
    .min(1, "Category is required."),

  coverImage: z
    .instanceof(File)
    .refine((file) => file !== null, ("Cover image is required.")),
});

export type DraftArticleFormValues =
  z.infer<typeof draftArticleSchema>;

export type PublishArticleFormValues =
  z.infer<typeof publishArticleSchema>;