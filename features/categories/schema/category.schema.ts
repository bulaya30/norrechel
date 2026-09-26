import { z } from "zod";

const requiredCategoryNameSchema = z
  .string()
  .trim()
  .min(
    3,
    "Category name must contain at least 3 characters.",
  )
  .max(
    80,
    "Category name must not exceed 80 characters.",
  );

export const createCategorySchema = z.object({
  name: requiredCategoryNameSchema,
});

export type CreateCategoryFormValues = z.infer<typeof createCategorySchema>;
