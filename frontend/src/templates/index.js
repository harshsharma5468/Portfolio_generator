import ModernTemplate from "./ModernTemplate";
import MinimalTemplate from "./MinimalTemplate";
import CreativeTemplate from "./CreativeTemplate";
import CorporateTemplate from "./CorporateTemplate";

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
};

export default templates;
