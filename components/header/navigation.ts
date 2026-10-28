export interface NavItem {
  translationKey:
    | "home"
    | "services"
    | "blogs"
    | "projects"
    | "about"
    | "contact";
  path: string;
}

export const navItems: NavItem[] = [
  { translationKey: "home", path: "/" },
  { translationKey: "services", path: "/services" },
  { translationKey: "projects", path: "/projects" },
  { translationKey: "blogs", path: "/blogs" },
  { translationKey: "about", path: "/about" },
  { translationKey: "contact", path: "/contact" },
];