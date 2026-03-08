// ============================================================
// Content types — derived from frontmatter in /content/*.md
// ============================================================

export interface NavLink {
  label: string;
  href: string;
}

export interface NavigationContent {
  links: NavLink[];
  ctaLabel: string;
  ctaHref: string;
}

export interface HeroContent {
  subtitle: string;
  title: string;
  titleHighlight: string;
  description: string;
  cta: string;
}

export interface Service {
  title: string;
  description: string;
  icon: LucideIconName;
}

export interface Branch {
  name: string;
  subtitle: string;
  services: Service[];
}

export interface ServicesContent {
  label: string;
  title: string;
  description: string;
  branches: Branch[];
}

export interface AboutContent {
  label: string;
  title: string;
  description: string;
  valueProposition: string;
  valuePoints: string[];
  mission: string;
  imageAlt?: string;
  imageTitle?: string;
  imageSubtitle?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  linkedin: string;
  avatarUrl: string;
}

export interface TeamContent {
  label: string;
  title: string;
  description: string;
  members: TeamMember[];
}

export interface ContactItemData {
  icon: string;
  label: string;
  value: string;
  href?: string;
}

export interface ContactContent {
  label: string;
  title: string;
  description: string;
  contactItems: ContactItemData[];
}

// ============================================================
// Utility types
// ============================================================

export type AsyncState<T> =
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };

export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object
    ? T[P] extends Function
      ? T[P]
      : DeepReadonly<T[P]>
    : T[P];
};

// ============================================================
// CVA variant types
// ============================================================

export type ButtonVariant =
  | "default"
  | "accent"
  | "outline"
  | "ghost"
  | "destructive"
  | "secondary"
  | "link";

export type ButtonSize = "sm" | "default" | "lg" | "xl" | "icon";

export type CardVariant = "default" | "elevated" | "dark";

export type BadgeVariant = "default" | "secondary" | "accent" | "outline" | "destructive";

// ============================================================
// Lucide icon name union (extensible)
// ============================================================

export type LucideIconName =
  | "Code"
  | "Cloud"
  | "FileText"
  | "BrainCircuit"
  | "Users"
  | "CheckCircle"
  | "CheckCircle2"
  | "Sparkles"
  | "UserCheck"
  | "Mail"
  | "Phone"
  | "MapPin"
  | "Linkedin"
  | "Instagram"
  | "MessageCircle"
  | "ArrowDown"
  | "Menu"
  | "X"
  | "Send"
  | "Loader2";

// ============================================================
// Contact form
// ============================================================

import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Email inválido"),
  company: z.string().optional(),
  message: z.string().min(10, "Mínimo 10 caracteres").max(500, "Máximo 500 caracteres"),
  service: z.enum(["producto", "staff", "otro"]).optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
