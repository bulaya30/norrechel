export interface NavItem {
  translationKey: "home" | "blogs" | "projects" | "about" | "contact";
  path: string;
}

export const navItems: NavItem[] = [
  { translationKey: "home", path: "/" },
  { translationKey: "blogs", path: "/blogs" },
  { translationKey: "projects", path: "/projects" },
  { translationKey: "about", path: "/about" },
  { translationKey: "contact", path: "/contact" },
];