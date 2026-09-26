"use client";

import {
  useEffect,
  useTransition,
} from "react";

import { useForm } from "react-hook-form";

import {
  AtSign,
  BriefcaseBusiness,
  Building2,
  Loader2,
  MapPin,
  Phone,
  Save,
  UserRound,
} from "lucide-react";

import {
  FaFacebook,
  FaGithub,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";

import type { User } from "@/features/interfaces/user";

import {
  updateProfileAction,
} from "@/features/users/actions/user.actions";

import ProfileFormField from "./ProfileFormField";
import ProfileFormSection from "./ProfileFormSection";
import ProfilePhotoField from "./ProfilePhotoField";

type SupportedLocale = "en" | "fr";

interface UpdateProfileProps {
  user: User;
  locale: SupportedLocale;
}

interface ProfileFormValues {
  firstName: string;
  lastName: string;
  title: string;
  contact: string;
  company: string;
  address: string;
  about: string;

  photo: File | null;

  facebook: string;
  linkedin: string;
  twitter: string;
  github: string;
  instagram: string;
}

const inputClassName =
  "h-11 w-full rounded-xl border bg-background px-3.5 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60";

const textareaClassName =
  "min-h-36 w-full resize-y rounded-xl border bg-background px-3.5 py-3 text-sm leading-6 outline-none transition placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/10";

function getDefaultValues(
  user: User
): ProfileFormValues {
  return {
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    title: user.title ?? "",
    contact: user.contact ?? "",
    company: user.company ?? "",
    address: user.address ?? "",
    about: user.about ?? "",

    photo: null,

    facebook: user.facebook ?? "",
    linkedin: user.linkedin ?? "",
    twitter: user.twitter ?? "",
    github: user.github ?? "",
    instagram: user.instagram ?? "",
  };
}

export default function UpdateProfile({
  user,
  locale,
}: UpdateProfileProps) {
  const [isPending, startTransition] =
    useTransition();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    defaultValues:
      getDefaultValues(user),
  });

  const selectedPhoto = watch("photo");

  useEffect(() => {
    reset(getDefaultValues(user));
  }, [user, reset]);

  const onSubmit = (
    values: ProfileFormValues
  ) => {
    startTransition(async () => {
      const result =
        await updateProfileAction(values);

      if (!result.success) {
        window.alert(result.message);
        return;
      }

      window.alert(result.message);
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      {/* Personal Information */}
      <ProfileFormSection
        title="Personal Information"
        description="Update your basic personal information."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <ProfileFormField
            label="First Name"
            error={errors.firstName?.message}
          >
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                {...register("firstName", {
                  required:
                    "First name is required.",
                })}
                className={`${inputClassName} pl-10`}
                placeholder="First name"
              />
            </div>
          </ProfileFormField>

          <ProfileFormField
            label="Last Name"
            error={errors.lastName?.message}
          >
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                {...register("lastName", {
                  required:
                    "Last name is required.",
                })}
                className={`${inputClassName} pl-10`}
                placeholder="Last name"
              />
            </div>
          </ProfileFormField>

          <ProfileFormField
            label="Email"
            hint="Your email is managed by your account."
          >
            <div className="relative">
              <AtSign className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                value={user.email}
                disabled
                className={`${inputClassName} pl-10`}
              />
            </div>
          </ProfileFormField>

          <ProfileFormField
            label="Role"
            hint="Your account role cannot be changed here."
          >
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                value={
                  user.role
                    .charAt(0)
                    .toUpperCase() +
                  user.role.slice(1)
                }
                disabled
                className={`${inputClassName} pl-10`}
              />
            </div>
          </ProfileFormField>
        </div>
      </ProfileFormSection>

      {/* Professional Information */}
      <ProfileFormSection
        title="Professional Information"
        description="Tell people what you do and where you work."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <ProfileFormField label="Professional Title">
            <div className="relative">
              <BriefcaseBusiness className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                {...register("title")}
                className={`${inputClassName} pl-10`}
                placeholder="e.g. Full Stack Developer"
              />
            </div>
          </ProfileFormField>

          <ProfileFormField label="Company">
            <div className="relative">
              <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                {...register("company")}
                className={`${inputClassName} pl-10`}
                placeholder="Company name"
              />
            </div>
          </ProfileFormField>

          <ProfileFormField label="Phone">
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                {...register("contact")}
                className={`${inputClassName} pl-10`}
                placeholder="Phone number"
              />
            </div>
          </ProfileFormField>

          <ProfileFormField label="Address">
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                {...register("address")}
                className={`${inputClassName} pl-10`}
                placeholder="Your address"
              />
            </div>
          </ProfileFormField>
        </div>
      </ProfileFormSection>

      {/* About */}
      <ProfileFormSection
        title="About"
        description="Write a short introduction that describes who you are."
      >
        <ProfileFormField label="About Me">
          <textarea
            {...register("about")}
            rows={6}
            placeholder="Write something about yourself..."
            className={textareaClassName}
          />
        </ProfileFormField>
      </ProfileFormSection>

      {/* Profile Photo */}
      <ProfileFormSection
        title="Profile Photo"
        description="Choose a profile photo that represents you."
      >
        <ProfilePhotoField
          locale={locale}
          value={selectedPhoto}
          existingImageUrl={user.photo}
          onChange={(file) => {
            setValue(
              "photo",
              file,
              {
                shouldDirty: true,
                shouldValidate: true,
              }
            );
          }}
          error={errors.photo?.message}
        />
      </ProfileFormSection>

      {/* Social Profiles */}
      <ProfileFormSection
        title="Social Profiles"
        description="Connect your public social and professional profiles."
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <ProfileFormField label="LinkedIn">
            <div className="relative">
              <FaLinkedin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                {...register("linkedin")}
                placeholder="https://linkedin.com/in/..."
                className={`${inputClassName} pl-10`}
              />
            </div>
          </ProfileFormField>

          <ProfileFormField label="GitHub">
            <div className="relative">
              <FaGithub className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                {...register("github")}
                placeholder="https://github.com/..."
                className={`${inputClassName} pl-10`}
              />
            </div>
          </ProfileFormField>

          <ProfileFormField label="Twitter">
            <div className="relative">
              <AtSign className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                {...register("twitter")}
                placeholder="https://twitter.com/..."
                className={`${inputClassName} pl-10`}
              />
            </div>
          </ProfileFormField>

          <ProfileFormField label="Facebook">
            <div className="relative">
              <FaFacebook className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                {...register("facebook")}
                placeholder="https://facebook.com/..."
                className={`${inputClassName} pl-10`}
              />
            </div>
          </ProfileFormField>

          <ProfileFormField label="Instagram">
            <div className="relative">
              <FaInstagram className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                {...register("instagram")}
                placeholder="https://instagram.com/..."
                className={`${inputClassName} pl-10`}
              />
            </div>
          </ProfileFormField>
        </div>
      </ProfileFormSection>

      {/* Save bar */}
      <div className="sticky bottom-4 z-10 flex justify-end">
        <div className="flex items-center gap-3 rounded-xl border bg-background/95 p-2 shadow-lg backdrop-blur">
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
