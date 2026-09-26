import {
  ExternalLink,
  Share2,
} from "lucide-react";

import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";

import type { User } from "@/features/interfaces/user";

interface ProfileSocialCardProps {
  user: User;
}

interface SocialLinkProps {
  href?: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

function SocialLink({
  href,
  label,
  icon: Icon,
}: SocialLinkProps) {
  if (!href) {
    return null;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex min-w-0 items-center gap-3 rounded-xl border bg-background/50 p-3 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-muted/40"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium">
          {label}
        </p>

        <p className="mt-0.5 truncate text-xs text-muted-foreground">
          {href}
        </p>
      </div>

      <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
    </a>
  );
}

export default function ProfileSocialCard({
  user,
}: ProfileSocialCardProps) {
  const socialLinks = [
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
      href: user.twitter,
      label: "Twitter",
      icon: FaTwitter,
    },
    {
      href: user.facebook,
      label: "Facebook",
      icon: FaFacebook,
    },
    {
      href: user.instagram,
      label: "Instagram",
      icon: FaInstagram,
    },
  ];

  const hasSocialLinks = socialLinks.some(
    (social) => social.href
  );

  return (
    <section className="rounded-2xl border bg-card p-6 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Share2 className="h-5 w-5" />
        </div>

        <div>
          <h2 className="text-base font-semibold tracking-tight">
            Social Profiles
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Your public social and professional profiles.
          </p>
        </div>
      </div>

      {hasSocialLinks ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {socialLinks.map((social) => (
            <SocialLink
              key={social.label}
              href={social.href}
              label={social.label}
              icon={social.icon}
            />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-xl border border-dashed bg-muted/20 px-5 py-8 text-center">
          <p className="text-sm text-muted-foreground">
            No social profiles have been added yet.
          </p>
        </div>
      )}
    </section>
  );
}
