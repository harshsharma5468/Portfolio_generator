import ModernTemplate from "./ModernTemplate";
import MinimalTemplate from "./MinimalTemplate";
import CreativeTemplate from "./CreativeTemplate";
import CorporateTemplate from "./CorporateTemplate";
import ProfessionalTemplate from "./ProfessionalTemplate";
import AcademicTemplate from "./AcademicTemplate";
import CoralTemplate from "./CoralTemplate";
import SerifTemplate from "./SerifTemplate";

const templates = {
  modern: {
    component: ModernTemplate,
    label: "Modern",
    description: "Clean two-column layout with sidebar",
    colors: ["#1e293b", "#6366f1", "#f0f4ff"],
  },
  minimal: {
    component: MinimalTemplate,
    label: "Minimal",
    description: "Whitespace-first, typography-driven",
    colors: ["#fff", "#111", "#888"],
  },
  creative: {
    component: CreativeTemplate,
    label: "Creative",
    description: "Bold, animated, storytelling style",
    colors: ["#0a0a0a", "#a855f7", "#1a0533"],
  },
  corporate: {
    component: CorporateTemplate,
    label: "Corporate",
    description: "Formal resume-style, achievement-focused",
    colors: ["#fff", "#003366", "#eff6ff"],
  },
  professional: {
    component: ProfessionalTemplate,
    label: "Professional",
    description: "Clean & structured, like Google Docs templates",
    colors: ["#fff", "#2563eb", "#eff6ff"],
  },
  academic: {
    component: AcademicTemplate,
    label: "Academic",
    description: "Research-focused CV with formal styling",
    colors: ["#fff", "#000", "#e5e7eb"],
  },
  coral: {
    component: CoralTemplate,
    label: "Coral",
    description: "Vibrant red accents with modern layout",
    colors: ["#fff", "#ff6b6b", "#fff0f0"],
  },
  serif: {
    component: SerifTemplate,
    label: "Serif",
    description: "Traditional two-column with elegant typography",
    colors: ["#fff", "#1a1a1a", "#f5f5f5"],
  },
};

export default templates;
