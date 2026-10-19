import {
  Bell,
  BookOpen,
  FolderKanban,
  Home,
  MailPlus,
  UserRound,
  Layers3,
  MessageSquare,
  Users,
} from "lucide-react";

export const dashboardNavigation = [
  {
    key: "dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    key: "notifications",
    href: "/dashboard/notifications",
    icon: Bell,
  },
  {
    key: "categories",
    href: "/dashboard/categories",
    icon: Layers3,
  },
  {
    key: "articles",
    href: "/dashboard/articles",
    icon: BookOpen,
  },
  {
    key: "projects",
    href: "/dashboard/projects",
    icon: FolderKanban,
  },
  {
    key: "contacts",
    href: "/dashboard/contacts",
    icon: MessageSquare,
  },
  {
    key: "subscribers",
    href: "/dashboard/subscribers",
    icon: MailPlus,
  },
  {
    key: "visitors",
    href: "/dashboard/visitors",
    icon: Users,
  },
  {
    key: "profile",
    href: "/dashboard/profile",
    icon: UserRound,
  },
] as const;