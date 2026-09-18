import { NavItem } from "@/types";

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const BRAND = {
  name: "PHISHGUARD-AR",
  tagline: "Detect · Analyze · Resist · Stay Safe",
  shortDesc: "AI-Powered Adversarially Robust Cybersecurity Defense Platform",
  version: "Phase 9 (History · Reports · Alerts · Settings)",
};

export const NAV_SECTIONS: NavSection[] = [
  {
    title: "COMMAND CENTER",
    items: [
      {
        name: "Home",
        href: "/home",
        icon: "Shield",
        description: "Command center & threat overview",
        section: "COMMAND CENTER",
      },
      {
        name: "Scan",
        href: "/scan",
        icon: "Search",
        description: "Analyze suspicious messages & links",
        section: "COMMAND CENTER",
      },
    ],
  },
  {
    title: "AI SECURITY",
    items: [
      {
        name: "Robustness Lab",
        href: "/robustness",
        icon: "FlaskConical",
        description: "Test adversarial attacks & defenses",
        section: "AI SECURITY",
      },
      {
        name: "Dashboard",
        href: "/dashboard",
        icon: "LayoutDashboard",
        description: "Live threat telemetry & metrics",
        section: "AI SECURITY",
      },
      {
        name: "AI Intelligence",
        href: "/dashboard/intelligence",
        icon: "Cpu",
        description: "Deep neural network & explainability",
        section: "AI SECURITY",
      },
    ],
  },
  {
    title: "INTELLIGENCE",
    items: [
      {
        name: "History",
        href: "/history",
        icon: "History",
        description: "Previous threat scans & audit logs",
        section: "INTELLIGENCE",
      },
      {
        name: "Reports",
        href: "/reports",
        icon: "FileText",
        description: "Export intelligence & forensic reports",
        section: "INTELLIGENCE",
      },
      {
        name: "Alerts",
        href: "/alerts",
        icon: "Bell",
        description: "Simulated SOC incident alerts & feed",
        section: "INTELLIGENCE",
      },
    ],
  },
  {
    title: "SYSTEM",
    items: [
      {
        name: "Settings",
        href: "/settings",
        icon: "Settings",
        description: "Integrations & defense configuration",
        section: "SYSTEM",
      },
    ],
  },
];

export const NAV_ITEMS: NavItem[] = NAV_SECTIONS.flatMap((s) => s.items);
