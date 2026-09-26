"use client";

import { ArrowRight, Mail } from "lucide-react";
import { useForm } from "react-hook-form";

type NewsletterFormValues = {
  email: string;
};

export default function NewsletterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormValues>();

  const onSubmit = async (data: NewsletterFormValues) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="mx-auto mt-8 max-w-xl"
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>

      <div className="flex flex-col gap-3 rounded-md bg-white p-1 shadow-lg sm:flex-row">
        <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
          <Mail
            className="h-5 w-5 shrink-0 text-slate-400"
            aria-hidden="true"
          />

          <input
            id="newsletter-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Enter your email address"
            aria-invalid={errors.email ? "true" : "false"}
            aria-describedby={
              errors.email
                ? "newsletter-email-error"
                : "newsletter-email-description"
            }
            {...register("email", {
              required: "Email address is required",
              maxLength: {
                value: 254,
                message: "Email address is too long",
              },
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Please enter a valid email address",
              },
            })}
            className="min-h-12 w-full bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="group inline-flex min-h-12 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md bg-orange-600 px-6 font-semibold text-white transition-colors duration-200 hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Subscribing..." : "Subscribe"}

          {!isSubmitting && (
            <ArrowRight
              className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            />
          )}
        </button>
      </div>

      <p
        id="newsletter-email-description"
        className="mt-3 text-sm text-slate-400"
      >
        You can unsubscribe at any time. Your email address remains private.
      </p>

      {errors.email && (
        <p
          id="newsletter-email-error"
          role="alert"
          className="mt-3 text-sm font-medium text-red-400"
        >
          {errors.email.message}
        </p>
      )}
    </form>
  );
}