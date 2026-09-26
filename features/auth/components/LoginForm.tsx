"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  ArrowRight,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  LogIn,
  Mail,
  ShieldCheck,
} from "lucide-react";

import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import {
  useForm,
  type SubmitHandler,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { auth } from "@/lib/firebase/client";
import { loginAction } from "@/features/auth/actions/auth.actions";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  loginSchema,
  type LoginFormValues,
} from "../schema/auth.schema";

type SupportedLocale = "en" | "fr";

interface LoginFormProps {
  locale: SupportedLocale;
}

export default function LoginForm({
  locale,
}: LoginFormProps) {
  const router = useRouter();

  const [showPassword, setShowPassword] =
    useState(false);

  const [serverError, setServerError] =
    useState<string | null>(null);

  const labels =
    locale === "fr"
      ? {
          eyebrow: "Espace sécurisé",
          welcome: "Bienvenue",
          description:
            "Connectez-vous pour accéder à votre tableau de bord et gérer votre contenu.",
          email: "Adresse e-mail",
          emailPlaceholder: "nom@exemple.com",
          password: "Mot de passe",
          passwordPlaceholder:
            "Entrez votre mot de passe",
          login: "Se connecter",
          loggingIn: "Connexion...",
          noAccount: "Vous n’avez pas de compte ?",
          register: "Créer un compte",
          showPassword: "Afficher le mot de passe",
          hidePassword: "Masquer le mot de passe",
          genericError:
            "Impossible de vous connecter. Vérifiez vos identifiants.",
          privacy:
            "Votre connexion est protégée et vos identifiants ne sont jamais stockés dans le navigateur.",
        }
      : {
          eyebrow: "Secure access",
          welcome: "Welcome back",
          description:
            "Sign in to access your dashboard and manage your content.",
          email: "Email address",
          emailPlaceholder: "name@example.com",
          password: "Password",
          passwordPlaceholder: "Enter your password",
          login: "Sign in",
          loggingIn: "Signing in...",
          noAccount: "Don’t have an account?",
          register: "Create an account",
          showPassword: "Show password",
          hidePassword: "Hide password",
          genericError:
            "Unable to sign in. Check your credentials.",
          privacy:
            "Your connection is protected and your credentials are never stored in the browser.",
        };

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<
    LoginFormValues
  > = async ({ email, password }) => {
    setServerError(null);

    try {
      const credential =
        await signInWithEmailAndPassword(
          auth,
          email.trim(),
          password,
        );

      const idToken = await credential.user.getIdToken();

      const result = await loginAction(idToken);

      if (!result.success) {
        await signOut(auth);

        setServerError(
          result.message || labels.genericError,
        );

        return;
      }

      router.replace(`/${locale}/dashboard`);
      router.refresh();
    } catch (error) {

      await signOut(auth).catch(() => undefined);

      setServerError(labels.genericError);
    }
  };

  return (
    <section
      aria-labelledby="login-heading"
      className="
        relative isolate flex min-h-[calc(100vh-4rem)]
        w-full items-center justify-center
        overflow-hidden bg-slate-950 px-4 py-16
        text-white sm:px-6 mt-5
      "
    >
      <div
        aria-hidden="true"
        className="
          absolute inset-0 -z-20
          bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.35),_transparent_35%),radial-gradient(circle_at_bottom_right,_rgba(234,88,12,0.22),_transparent_32%)]
        "
      />

      <div
        aria-hidden="true"
        className="
          absolute inset-0 -z-10
          bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)]
          bg-[size:48px_48px]
        "
      />

      <Card
        className="
          w-full max-w-md overflow-hidden
          border border-white/15
          bg-white/95 text-slate-950
          shadow-2xl shadow-black/30
          backdrop-blur-xl
        "
      >
        <CardHeader className="space-y-4 px-6 pt-4 text-center sm:px-8">
          <div
            className="
              mx-auto flex size-14 items-center
              justify-center rounded-2xl
              bg-orange-100 text-orange-700
              ring-1 ring-orange-200
            "
          >
            <LogIn
              className="size-7"
              aria-hidden="true"
            />
          </div>

          <div>
            <p
              className="
                text-xs font-bold uppercase
                tracking-[0.22em] text-orange-600
              "
            >
              {labels.eyebrow}
            </p>

            <CardTitle
              id="login-heading"
              className="
                mt-3 text-3xl font-bold
                tracking-tight text-slate-950
              "
            >
              {labels.welcome}
            </CardTitle>

            <CardDescription
              className="
                mx-auto mt-3 max-w-sm
                text-sm leading-6 text-slate-600
              "
            >
              {labels.description}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="px-6 sm:px-8">
          <form
            id="login-form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-5"
          >
            {serverError && (
              <div
                role="alert"
                aria-live="polite"
                className="
                  rounded-xl border border-red-200
                  bg-red-50 px-4 py-3
                  text-sm font-medium text-red-700
                "
              >
                {serverError}
              </div>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="font-semibold text-slate-800"
              >
                {labels.email}
              </Label>

              <div className="relative">
                <Mail
                  className="
                    pointer-events-none absolute
                    left-3 top-1/2 size-4
                    -translate-y-1/2 text-slate-400
                  "
                  aria-hidden="true"
                />

                <Input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder={labels.emailPlaceholder}
                  aria-invalid={
                    errors.email ? "true" : "false"
                  }
                  aria-describedby={
                    errors.email
                      ? "email-error"
                      : undefined
                  }
                  className="
                    h-12 border-slate-300
                    bg-white pl-10 text-slate-950
                    placeholder:text-slate-400
                    focus-visible:border-blue-700
                    focus-visible:ring-blue-700/20
                  "
                  {...register("email")}
                />
              </div>

              {errors.email && (
                <p
                  id="email-error"
                  role="alert"
                  className="text-sm font-medium text-red-600"
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="font-semibold text-slate-800"
              >
                {labels.password}
              </Label>

              <div className="relative">
                <LockKeyhole
                  className="
                    pointer-events-none absolute
                    left-3 top-1/2 size-4
                    -translate-y-1/2 text-slate-400
                  "
                  aria-hidden="true"
                />

                <Input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  autoComplete="current-password"
                  placeholder={labels.passwordPlaceholder}
                  aria-invalid={
                    errors.password
                      ? "true"
                      : "false"
                  }
                  aria-describedby={
                    errors.password
                      ? "password-error"
                      : undefined
                  }
                  className="
                    h-12 border-slate-300
                    bg-white px-10 text-slate-950
                    placeholder:text-slate-400
                    focus-visible:border-blue-700
                    focus-visible:ring-blue-700/20
                  "
                  {...register("password")}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) => !current,
                    )
                  }
                  aria-label={
                    showPassword
                      ? labels.hidePassword
                      : labels.showPassword
                  }
                  aria-pressed={showPassword}
                  className="
                    absolute right-3 top-1/2
                    inline-flex size-8
                    -translate-y-1/2
                    items-center justify-center
                    rounded-md text-slate-500
                    transition-colors
                    hover:bg-slate-100
                    hover:text-slate-950
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-blue-700
                  "
                >
                  {showPassword ? (
                    <EyeOff
                      className="size-4"
                      aria-hidden="true"
                    />
                  ) : (
                    <Eye
                      className="size-4"
                      aria-hidden="true"
                    />
                  )}
                </button>
              </div>

              {errors.password && (
                <p
                  id="password-error"
                  role="alert"
                  className="text-sm font-medium text-red-600"
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="
                group h-12 w-full
                bg-orange-600 font-semibold
                text-white shadow-lg
                shadow-orange-950/15
                transition-all duration-200
                hover:-translate-y-0.5
                hover:bg-orange-500
                hover:shadow-xl
                focus-visible:ring-orange-500
                disabled:translate-y-0
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle
                    className="size-4 animate-spin"
                    aria-hidden="true"
                  />
                  {labels.loggingIn}
                </>
              ) : (
                <>
                  <LogIn
                    className="size-4"
                    aria-hidden="true"
                  />

                  {labels.login}

                  <ArrowRight
                    className="
                      size-4 transition-transform
                      duration-200
                      group-hover:translate-x-1
                    "
                    aria-hidden="true"
                  />
                </>
              )}
            </Button>

            <div
              className="
                flex items-start gap-3
                rounded-xl bg-slate-50
                px-4 py-3
              "
            >
              <ShieldCheck
                className="
                  mt-0.5 size-4 shrink-0
                  text-blue-700
                "
                aria-hidden="true"
              />

              <p className="text-left text-xs leading-5 text-slate-500">
                {labels.privacy}
              </p>
            </div>
          </form>
        </CardContent>

        {/* <CardFooter
          className="
            justify-center border-t
            border-slate-200 bg-slate-50/70
            px-6 py-5 sm:px-8
          "
        >
          <p className="text-center text-sm text-slate-600">
            {labels.noAccount}{" "}
            <Link
              href={`/${locale}/register`}
              className="
                font-semibold text-blue-700
                transition-colors
                hover:text-orange-600
                hover:underline
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-blue-700
                focus-visible:ring-offset-2
              "
            >
              {labels.register}
            </Link>
          </p>
        </CardFooter> */}
      </Card>

      <div
        aria-hidden="true"
        className="
          absolute bottom-0 left-0 h-px w-full
          bg-gradient-to-r
          from-transparent via-white/30 to-transparent
        "
      />
    </section>
  );
}