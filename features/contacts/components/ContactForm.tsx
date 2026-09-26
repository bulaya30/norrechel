"use client";

import { useState } from "react";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  Send,
  UserRound,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createContactSchema,
  type ContactFormValues,
  type SupportedLocale,
} from "@/features/contacts/schema/contact.schema";

interface ContactFormProps {
  locale: SupportedLocale;
}

const content = {
  en: {
    badge: "Contact",
    title: "Let’s Discuss Your Next Idea",
    introduction:
      "Have a project, collaboration opportunity, or question about technology, data, or software development? Send me a message and I will get back to you.",
    informationLabel: "Contact information",
    informationTitle: "Let’s Start a Conversation",
    informationDescription:
      "Use the contact form or reach me directly through one of the channels below.",
    addressLabel: "Location",
    address: "Kansanga, Kampala, Uganda",
    phoneLabel: "Phone",
    emailLabel: "Email",
    availabilityLabel: "Availability",
    availability: "Open to projects and collaboration",
    formLabel: "Send a message",
    formTitle: "How Can I Help?",
    formDescription:
      "Provide a few details about your question, project, or collaboration proposal.",
    nameLabel: "Full name",
    namePlaceholder: "Enter your full name",
    emailFieldLabel: "Email address",
    emailPlaceholder: "you@example.com",
    messageLabel: "Message",
    messagePlaceholder:
      "Tell me about your project, question, or collaboration idea...",
    submit: "Send message",
    submitting: "Sending...",
    successTitle: "Message received",
    successMessage:
      "Thank you for reaching out. I will respond as soon as possible.",
    privacy:
      "Your contact details will only be used to respond to your message.",
    alternateAction: "Learn more about me",
  },

  fr: {
    badge: "Contact",
    title: "Discutons de votre prochaine idée",
    introduction:
      "Vous avez un projet, une proposition de collaboration ou une question sur la technologie, les données ou le développement logiciel ? Envoyez-moi un message et je vous répondrai.",
    informationLabel: "Coordonnées",
    informationTitle: "Commençons une conversation",
    informationDescription:
      "Utilisez le formulaire de contact ou contactez-moi directement par l’un des moyens ci-dessous.",
    addressLabel: "Localisation",
    address: "Kansanga, Kampala, Ouganda",
    phoneLabel: "Téléphone",
    emailLabel: "E-mail",
    availabilityLabel: "Disponibilité",
    availability: "Ouvert aux projets et aux collaborations",
    formLabel: "Envoyer un message",
    formTitle: "Comment puis-je vous aider ?",
    formDescription:
      "Donnez quelques informations sur votre question, votre projet ou votre proposition de collaboration.",
    nameLabel: "Nom complet",
    namePlaceholder: "Entrez votre nom complet",
    emailFieldLabel: "Adresse e-mail",
    emailPlaceholder: "vous@exemple.com",
    messageLabel: "Message",
    messagePlaceholder:
      "Présentez votre projet, votre question ou votre idée de collaboration...",
    submit: "Envoyer le message",
    submitting: "Envoi en cours...",
    successTitle: "Message reçu",
    successMessage:
      "Merci de m’avoir contacté. Je vous répondrai dès que possible.",
    privacy:
      "Vos coordonnées seront uniquement utilisées pour répondre à votre message.",
    alternateAction: "En savoir plus sur moi",
  },
} as const;

export default function ContactForm({ locale }: ContactFormProps) {
  const text = content[locale] ?? content.en;
  const contactSchema = createContactSchema(locale);

  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitted(false);

    try {
      console.log(data);

      setIsSubmitted(true);
      reset();
    } catch (error) {
      console.error("Failed to submit contact form:", error);
    }
  };

  const getFieldClasses = (hasError: boolean) => `
    w-full rounded-xl border bg-white px-4 py-3
    text-sm text-slate-950 outline-none
    transition-colors placeholder:text-slate-400
    disabled:cursor-not-allowed disabled:bg-slate-100
    ${
      hasError
        ? "border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100"
        : "border-slate-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
    }
  `;

  return (
    <div className="mx-auto max-w-6xl">
      {/* Page introduction */}
      <section
        aria-labelledby="contact-page-heading"
        className="max-w-3xl"
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700">
          <MessageSquareText
            aria-hidden="true"
            className="h-4 w-4"
          />

          {text.badge}
        </div>

        <h1
          id="contact-page-heading"
          className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl"
        >
          {text.title}
        </h1>

        <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
          {text.introduction}
        </p>
      </section>

      {/* Contact content */}
      <section
        aria-label={text.informationLabel}
        className="mt-14 grid gap-8 lg:grid-cols-[360px_minmax(0,1fr)]"
      >
        {/* Contact information */}
        <aside className="h-fit overflow-hidden rounded-3xl bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 p-6 text-white shadow-lg sm:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-orange-300">
            <UserRound
              aria-hidden="true"
              className="h-6 w-6"
            />
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-orange-300">
            {text.informationLabel}
          </p>

          <h2 className="mt-2 text-2xl font-bold tracking-tight">
            {text.informationTitle}
          </h2>

          <p className="mt-4 text-sm leading-7 text-blue-100">
            {text.informationDescription}
          </p>

          <address className="mt-8 space-y-6 not-italic">
            {/* Location */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-orange-300">
                <MapPin
                  aria-hidden="true"
                  className="h-5 w-5"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  {text.addressLabel}
                </p>

                <p className="mt-1 text-sm leading-6 text-blue-100">
                  {text.address}
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-orange-300">
                <Phone
                  aria-hidden="true"
                  className="h-5 w-5"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  {text.phoneLabel}
                </p>

                <a
                  href="tel:+256750274516"
                  className="mt-1 inline-block text-sm text-blue-100 transition-colors hover:text-white"
                >
                  +256 750 274 516
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-orange-300">
                <Mail
                  aria-hidden="true"
                  className="h-5 w-5"
                />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">
                  {text.emailLabel}
                </p>

                <a
                  href="mailto:norbertbulaya3@gmail.com"
                  className="mt-1 block break-all text-sm text-blue-100 transition-colors hover:text-white"
                >
                  norbertbulaya3@gmail.com
                </a>
              </div>
            </div>

            {/* Availability */}
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 text-orange-300">
                <Clock3
                  aria-hidden="true"
                  className="h-5 w-5"
                />
              </div>

              <div>
                <p className="text-sm font-semibold text-white">
                  {text.availabilityLabel}
                </p>

                <p className="mt-1 text-sm leading-6 text-blue-100">
                  {text.availability}
                </p>
              </div>
            </div>
          </address>

          <div className="mt-8 border-t border-white/10 pt-6">
            <Link
              href={`/${locale}/about`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-orange-300 transition-colors hover:text-orange-200"
            >
              {text.alternateAction}

              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4"
              />
            </Link>
          </div>
        </aside>

        {/* Contact form */}
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <header>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-orange-600">
              {text.formLabel}
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              {text.formTitle}
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              {text.formDescription}
            </p>
          </header>

          {isSubmitted && (
            <div
              role="status"
              className="mt-6 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800"
            >
              <CheckCircle2
                aria-hidden="true"
                className="mt-0.5 h-5 w-5 shrink-0"
              />

              <div>
                <p className="font-semibold">
                  {text.successTitle}
                </p>

                <p className="mt-1 text-sm leading-6">
                  {text.successMessage}
                </p>
              </div>
            </div>
          )}

          <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 space-y-6"
          >
            {/* Name */}
            <div>
              <label
                htmlFor="contact-name"
                className="text-sm font-semibold text-slate-800"
              >
                {text.nameLabel}
              </label>

              <input
                id="contact-name"
                type="text"
                autoComplete="name"
                placeholder={text.namePlaceholder}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={
                  errors.name
                    ? "contact-name-error"
                    : undefined
                }
                disabled={isSubmitting}
                className={getFieldClasses(Boolean(errors.name))}
                {...register("name")}
              />

              {errors.name && (
                <p
                  id="contact-name-error"
                  role="alert"
                  className="mt-2 text-sm font-medium text-red-600"
                >
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="contact-email"
                className="text-sm font-semibold text-slate-800"
              >
                {text.emailFieldLabel}
              </label>

              <input
                id="contact-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder={text.emailPlaceholder}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email
                    ? "contact-email-error"
                    : undefined
                }
                disabled={isSubmitting}
                className={getFieldClasses(Boolean(errors.email))}
                {...register("email")}
              />

              {errors.email && (
                <p
                  id="contact-email-error"
                  role="alert"
                  className="mt-2 text-sm font-medium text-red-600"
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Message */}
            <div>
              <label
                htmlFor="contact-message"
                className="text-sm font-semibold text-slate-800"
              >
                {text.messageLabel}
              </label>

              <textarea
                id="contact-message"
                rows={7}
                placeholder={text.messagePlaceholder}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={
                  errors.message
                    ? "contact-message-error"
                    : "contact-message-description"
                }
                disabled={isSubmitting}
                className={`${getFieldClasses(
                  Boolean(errors.message),
                )} min-h-44 resize-y`}
                {...register("message")}
              />

              {errors.message && (
                <p
                  id="contact-message-error"
                  role="alert"
                  className="mt-2 text-sm font-medium text-red-600"
                >
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="flex flex-col gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p
                id="contact-message-description"
                className="max-w-md text-xs leading-5 text-slate-500"
              >
                {text.privacy}
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="
                  inline-flex min-w-40 items-center
                  justify-center gap-2 rounded-lg
                  bg-orange-600 px-6 py-3
                  text-sm font-semibold text-white
                  transition-colors hover:bg-orange-700
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-orange-600
                  focus-visible:ring-offset-2
                "
              >
                <Send
                  aria-hidden="true"
                  className="h-4 w-4"
                />

                {isSubmitting
                  ? text.submitting
                  : text.submit}
              </button>
            </div>
          </form>
        </article>
      </section>
    </div>
  );
}