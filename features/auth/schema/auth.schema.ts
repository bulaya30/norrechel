import { z } from "zod";

export const createLoginSchema = (messages: {
  emailRequired: string;
  emailInvalid: string;
  passwordRequired: string;
  passwordMinLength: string;
}) =>
  z.object({
    email: z
      .string()
      .trim()
      .min(1, messages.emailRequired)
      .pipe(
        z.email({
          error: messages.emailInvalid,
        })
      ),

    password: z
      .string()
      .min(1, messages.passwordRequired)
      .min(6, messages.passwordMinLength),
  });

export type LoginFormValues = z.infer<
  ReturnType<typeof createLoginSchema>
>;