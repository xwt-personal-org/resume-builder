"use client";

import { useResumeStore } from "@/store/useResumeStore";
import { SECTION_LABELS } from "@/types";
import type { SectionKey } from "@/types";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { EducationForm } from "./EducationForm";
import { HonorForm } from "./HonorForm";
import { ExperienceForm } from "./ExperienceForm";
import { ProjectForm } from "./ProjectForm";
import { CampusActivityForm } from "./CampusActivityForm";
import { SkillForm } from "./SkillForm";
import { ResearchExperienceForm } from "./ResearchExperienceForm";
import { LayoutControls } from "./LayoutControls";

const SECTIONS: SectionKey[] = ["personalInfo", "education", "researchExperience", "honors", "experience", "projects", "campusActivities", "skills"];

const SECTION_ICONS: Record<SectionKey, string> = {
  personalInfo: "👤",
  education: "🎓",
  researchExperience: "🔬",
  honors: "🏆",
  experience: "💼",
  projects: "🔧",
  campusActivities: "🏫",
  skills: "💡",
};

export function SidebarEditor() {
  const { activeSection, setActiveSection, activeLanguage } = useResumeStore();
  const lang = activeLanguage;

  const getLabel = (key: SectionKey) => {
    const label = SECTION_LABELS[key];
    return label[lang] || label.zh;
  };

  const renderSection = () => {
    switch (activeSection) {
      case "personalInfo":
        return <PersonalInfoForm />;
      case "education":
        return <EducationForm />;
      case "honors":
        return <HonorForm />;
      case "experience":
        return <ExperienceForm />;
      case "projects":
        return <ProjectForm />;
      case "campusActivities":
        return <CampusActivityForm />;
      case "skills":
        return <SkillForm />;
      case "researchExperience":
        return <ResearchExperienceForm />;
      default:
        return <PersonalInfoForm />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-wrap border-b border-[var(--color-border)] px-1 shrink-0">
        {SECTIONS.map((key) => (
          <button
            key={key}
            onClick={() => setActiveSection(key)}
            className={`flex items-center gap-1 px-2.5 py-2.5 text-xs whitespace-nowrap transition-all duration-150 border-b-2 -mb-px ${
              activeSection === key
                ? "border-[var(--color-primary)] text-[var(--color-primary)] font-semibold"
                : "border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:border-[var(--color-border-dark)]"
            }`}
          >
            <span>{SECTION_ICONS[key]}</span>
            <span>{getLabel(key)}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <LayoutControls />
        {renderSection()}
      </div>
    </div>
  );
}
