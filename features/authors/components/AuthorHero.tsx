import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  Globe,
  Mail,
} from "lucide-react";

import { FaGithub, FaLinkedin } from "react-icons/fa";
  

interface AuthorHeroProps {
  firstName: string;
  lastName: string;
  title?: string;
  description?: string;
  photo?: string | null;
  email?: string;
  github?: string;
  linkedin?: string;
  website?: string;
  skills?: string[];
}

interface SocialLinkProps {
  href?: string;
  label: string;
  external?: boolean;
  children: React.ReactNode;
}

function SocialLink({
  href,
  label,
  external = false,
  children,
}: SocialLinkProps) {
  if (!href) {
    return null;
  }

  return (
    <Link
      href={href}
      aria-label={label}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="
        inline-flex size-10 items-center justify-center
        rounded-full border border-white/15 bg-white/10
        text-white backdrop-blur-sm
        transition-all duration-200
        hover:-translate-y-0.5 hover:border-white/30
        hover:bg-white/20
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-white
        focus-visible:ring-offset-2
        focus-visible:ring-offset-slate-950
      "
    >
      {children}
    </Link>
  );
}

export default function AuthorHero({
  firstName,
  lastName,
  title = "Software Engineer · Builder · Entrepreneur",
  description = "I build practical digital products, explore data-driven solutions, and share lessons from technology, entrepreneurship, and continuous learning.",
  photo,
  email,
  github,
  linkedin,
  website,
  skills = [],
}: AuthorHeroProps) {
  const fullName =
    [firstName, lastName].filter(Boolean).join(" ") ||
    "Unknown author";

  const profileImage = photo || "/img/logo.png";

  console.log(profileImage)

  return (
    <section
      aria-labelledby="author-heading"
      className="
        relative isolate overflow-hidden rounded-3xl
        bg-slate-950 px-6 py-12 text-white
        sm:px-10 sm:py-16
      "
    >
      <div
        aria-hidden="true"
        className="
          absolute inset-0 -z-20
          bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.35),_transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(234,88,12,0.2),_transparent_32%)]
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

      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:text-left">
          <figure className="shrink-0">
            <div
              className="
                relative size-36 overflow-hidden rounded-3xl
                border-4 border-white/15 bg-white/10
                shadow-2xl shadow-slate-950/40
                sm:size-40
              "
            >
              <Image
                src={profileImage}
                alt={`${fullName} profile picture`}
                fill
                priority
                sizes="(max-width: 640px) 144px, 160px"
                className="object-cover"
              />
            </div>
          </figure>

          <div className="min-w-0 flex-1">
            <header>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-400">
                About the creator
              </p>

              <h1
                id="author-heading"
                className="
                  mt-3 text-4xl font-bold tracking-tight
                  sm:text-5xl
                "
              >
                {fullName}
              </h1>

              <p className="mt-3 text-base font-medium text-blue-200 sm:text-lg">
                {title}
              </p>
            </header>

            <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-slate-300 lg:mx-0">
              {description}
            </p>

            {skills.length > 0 && (
              <ul
                aria-label="Professional skills"
                className="mt-6 flex flex-wrap justify-center gap-2 lg:justify-start"
              >
                {skills.map((skill) => (
                  <li
                    key={skill}
                    className="
                      rounded-full border border-white/10
                      bg-white/10 px-3 py-1.5 text-sm
                      font-medium text-slate-100
                      backdrop-blur-sm
                    "
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            )}

            <nav
              aria-label={`${fullName} social and contact links`}
              className="mt-7 flex items-center justify-center gap-3 lg:justify-start"
            >
              <SocialLink
                href={github}
                label={`Visit ${fullName}'s GitHub profile`}
                external
              >
                <FaGithub className="size-5" aria-hidden="true" />
              </SocialLink>

              <SocialLink
                href={linkedin}
                label={`Visit ${fullName}'s LinkedIn profile`}
                external
              >
                <FaLinkedin className="size-5" aria-hidden="true" />
              </SocialLink>

              <SocialLink
                href={website}
                label={`Visit ${fullName}'s website`}
                external
              >
                <Globe className="size-5" aria-hidden="true" />
              </SocialLink>

              <SocialLink
                href={email ? `mailto:${email}` : undefined}
                label={`Send an email to ${fullName}`}
              >
                <Mail className="size-5" aria-hidden="true" />
              </SocialLink>
            </nav>

            {website && (
              <Link
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  mt-6 inline-flex items-center gap-2
                  text-sm font-semibold text-orange-400
                  transition-colors hover:text-orange-300
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-orange-400
                "
              >
                Visit personal website
                <ExternalLink className="size-4" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}