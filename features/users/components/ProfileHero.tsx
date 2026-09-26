import Link from "next/link";
import Image from "next/image";

import {
  Building2,
  Camera,
  MapPin,
  Pencil,
} from "lucide-react";

import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";

import StatusBadge from "@/components/StatusBadge";

import type { User } from "@/features/interfaces/user";

type SupportedLocale = "en" | "fr";

interface ProfileHeroProps {
  user: User;
  locale: SupportedLocale;
}

export default function ProfileHero({
  user,
  locale,
}: ProfileHeroProps) {
  const fullName =
    `${user.firstName} ${user.lastName}`.trim();

  const initials =
    `${user.firstName?.charAt(0) ?? ""}${user.lastName?.charAt(0) ?? ""}`
      .toUpperCase();

  const socialLinks = [
    {
      href: user.twitter,
      label: "Twitter",
      icon: FaTwitter,
    },
    {
      href: user.linkedin,
      label: "LinkedIn",
      icon: FaLinkedin,
    },
    {
      href: user.github,
      label: "GitHub",
      icon: FaGithub,
    },
    {
      href: user.instagram,
      label: "Instagram",
      icon: FaInstagram,
    },
    {
      href: user.facebook,
      label: "Facebook",
      icon: FaFacebook,
    },
  ].filter((social) => social.href);

  const editHref = user.id
    ? `/${locale}/dashboard/profile/${user.id}/edit`
    : `/${locale}/dashboard/profile`;

  return (
    <section className="relative overflow-hidden rounded-md border bg-card shadow-sm">
      {/* =========================================================
          Cover image
          ========================================================= */}
      <div
        className="relative h-58 overflow-hidden bg-cover bg-center bg-no-repeat sm:h-56"
        style={{
          backgroundImage: "url('/img/cover.png')",
        }}
      >
        {/* Dark overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-black/40"
        />

        {/* Primary color overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-primary"
          style={{
            opacity: 0.25,
          }}
        />

        {/* Edit button */}
        <div className="absolute right-5 top-5 z-20">
          <p
            className="text-bold text-sm text-white mb-24"
          >
            "Build. Learn. Share. <br />
            Make an impact."
          </p>
          <Link
            href={editHref}
            className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/95 px-4 py-2.5 text-sm font-medium text-foreground shadow-sm backdrop-blur transition hover:bg-white"
          >
            <Pencil className="h-4 w-4" />
            Edit Profile
          </Link>
        </div>
      </div>

      {/* =========================================================
          User information
          ========================================================= */}
      <div className="relative bg-muted/10 pb-6 pt-20 sm:px-7 sm:pt-20">
        {/* Profile photo */}
        <div className="absolute left-5 top-0 z-20 -translate-y-1/2 sm:left-7">
          <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-muted shadow-xl sm:h-36 sm:w-36">
            {user.photo ? (
              <Image
                src={user.photo}
                alt={`${fullName} profile photo`}
                fill
                sizes="(max-width: 640px) 128px, 144px"
                className="object-contain"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-3xl font-semibold">
                {initials}
              </div>
            )}

            {/* Change photo */}
            <Link
              href={editHref}
              aria-label="Change profile photo"
              className="absolute bottom-1 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-background shadow-md transition hover:bg-muted"
            >
              <Camera className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Main information */}
        <div className="flex flex-col gap-5 items-left justify-left">
          <div className="min-w-0 pl-0 sm:pl-44">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {fullName}
              </h1>

              <StatusBadge
                status={
                  user.active === false
                    ? "inactive"
                    : "active"
                }
              />
            </div>

            {user.title && (
              <p className="mt-1 text-base text-muted-foreground">
                {user.title}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              {user.company && (
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  <span>{user.company}</span>
                </div>
              )}

              {user.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{user.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Social links */}
          {socialLinks.length > 0 && (
            <div className="flex mx-45 gap-2">
              {socialLinks.map(
                ({
                  href,
                  label,
                  icon: Icon,
                }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-blue/70 bg-background text-blue-800 transition hover:-translate-y-0.5 hover:border-blue-600 hover:text-blue-600"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
