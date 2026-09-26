import {
  Bell,
  BookOpen,
  FolderKanban,
  Home,
  MailPlus,
  UserRound,
  Layers3,
  MessageSquare
} from "lucide-react";

export const dashboardNavigation = [
  {
    label: {
      en: "Dashboard",
      fr: "Tableau de bord",
    },
    href: "/dashboard",
    icon: Home,
  },
  {
    label: {
      en: "Notifications",
      fr: "Notifications",
    },
    href: "/dashboard/notifications",
    icon: Bell,
  },
  {
    label: {
      en: "Categories",
      fr: "Categories"
    },
    href: "/dashboard/categories",
    icon: Layers3,
  },
  {
    label: {
      en: "Articles",
      fr: "Articles",
    },
    href: "/dashboard/articles",
    icon: BookOpen,
  },
  {
    label: {
      en: "Projects",
      fr: "Projets",
    },
    href: "/dashboard/projects",
    icon: FolderKanban,
  },
  {
    label: {
      en: "Contacts",
      fr: "Contactes",
    },
    href: "/dashboard/contacts",
    icon: MessageSquare,
  },
  {
    label: {
      en: "Subscribers",
      fr:"Abonnées",
    },
    href: "/dashboard/subscribers",
    icon: MailPlus,
  },
  {
    label: {
      en: "Profile",
      fr: "Profil",
    },
    href: "/dashboard/profile",
    icon: UserRound,
  },
] as const;