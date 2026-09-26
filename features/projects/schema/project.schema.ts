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
    "Project content is required.",
  );

export const projectDraftSchema = z.object({
  title: z.object({
      en: requiredTitleSchema,
      fr: requiredTitleSchema,
    }),
    
    categoryId: z
     .string()
     .trim()
     .min(1, "Category is required."),

    content: z.object({
      en: optionalContentSchema,
      fr: optionalContentSchema,
    }),
  
    details: z.object({
      en: optionalContentSchema,
      fr: optionalContentSchema,
    }),

    tech_stack: z.array(z.string()),

    live_url: z.string(),

    github_url: z.string(),

    coverImage: z
      .instanceof(File)
      .nullable()
      .optional(),
})

export const createProjectSchema =
  z.object({
    title: z.object({
      en: requiredTitleSchema,

      fr: requiredTitleSchema,
    }),

    content: z.object({
      en: requiredContentSchema,

      fr:requiredContentSchema,
    }),

    details: z.object({
      en: requiredContentSchema,

      fr: requiredContentSchema,
    }),

    categoryId: z
      .string()
      .trim()
      .min(
        1,
        "Category is required.",
      ),

    tech_stack: z
      .array(
        z.string().trim().min(1),
      )
      .min(
        1,
        "Add at least one technology.",
      ),

    live_url: z
      .string()
      .trim(),

    github_url: z
      .string()
      .trim(),

    coverImage: z
      .instanceof(File)
      .nullable(),
  });

export type ProjectFormValues = z.infer<typeof createProjectSchema>;