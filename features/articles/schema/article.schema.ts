
import { z } from "zod";
import { hasMeaningfulHtmlContent } from "@/lib/helpers";

export function getArticleSchemas(
  messages: {
    titleMin: string;
    titleMax: string;
    contentRequired: string;
    categoryRequired: string;
    coverImageRequired: string;
  },
) {
  const requiredTitleSchema = z
    .string()
    .trim()
    .min(3, messages.titleMin)
    .max(180, messages.titleMax);

  const optionalContentSchema = z.string();

  const requiredContentSchema = z
    .string()
    .refine(
      hasMeaningfulHtmlContent,
      messages.contentRequired,
    );

  const draftArticleSchema = z.object({
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
      .min(1, messages.categoryRequired),

    coverImage: z
      .instanceof(File)
      .nullable()
      .optional(),
  });

  const publishArticleSchema = z.object({
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
      .min(1, messages.categoryRequired),

    coverImage: z
      .instanceof(File, {
        message: messages.coverImageRequired,
      }),
  });

  return {
    draftArticleSchema,
    publishArticleSchema,
  };
}

export type DraftArticleFormValues = z.infer<
  ReturnType<typeof getArticleSchemas>["draftArticleSchema"]
>;

export type PublishArticleFormValues = z.infer<
  ReturnType<typeof getArticleSchemas>["publishArticleSchema"]
>;
