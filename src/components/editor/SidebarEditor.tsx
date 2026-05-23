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

const SECTIONS: SectionKey[] = ["personalInfo", "education", "researchExperience", "honors", "experience", "projects", "campusActivities", "skills"];

const SECTION_CODES: Record<SectionKey, string> = {
  personalInfo: "PI",
  education: "ED",
  researchExperience: "RE",
  honors: "AW",
  experience: "EX",
  projects: "PR",
  campusActivities: "CA",
  skills: "SK",
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
      <div className="section-pill-bar">
        {SECTIONS.map((key) => (
          <button
            key={key}
            onClick={() => setActiveSection(key)}
            className={`section-pill ${activeSection === key ? "section-pill--active" : ""}`}
          >
            <span>{SECTION_CODES[key]}</span>
            <span>{getLabel(key)}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {renderSection()}
      </div>
    </div>
  );
}
