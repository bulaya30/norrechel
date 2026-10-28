
import {
  BarChart3,
  Code2,
  Globe,
  type LucideIcon,
} from "lucide-react";

export const services = [
  {
    key: "websites",
    number: "01",
    icon: Globe,
  },
  {
    key: "software",
    number: "02",
    icon: Code2,
  },
  {
    key: "dashboards",
    number: "03",
    icon: BarChart3,
  },
] as const;

export type ServiceKey = (typeof services)[number]["key"];

export const processSteps = [
  { key: "understand", number: "01" },
  { key: "plan", number: "02" },
  { key: "build", number: "03" },
  { key: "refine", number: "04" },
] as const;
