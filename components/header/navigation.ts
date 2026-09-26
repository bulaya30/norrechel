export interface NavItem {
  name: string;
  path: string;
}

export const navItems: NavItem[] = [
  { name: "Home", path: "/" },
  { name: "Blogs", path: "/blogs" },
  { name: "Projects", path: "/projects" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];