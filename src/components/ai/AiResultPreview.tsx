"use client";

import type { AiResumeResponse } from "@/lib/ai/schema";
import type { SectionKey } from "@/types";
import { SECTION_LABELS } from "@/types";
import { AiApplyControls } from "./AiApplyControls";
import { useResumeStore } from "@/store/useResumeStore";
import t from "@/lib/i18n";

interface AiResultPreviewProps {
  result: AiResumeResponse;
  onDiscard: () => void;
}

const SECTION_CODES: Partial<Record<SectionKey, string>> = {
  personalInfo: "PI",
  education: "ED",
  researchExperience: "RE",
  honors: "AW",
  experience: "EX",
  projects: "PR",
  campusActivities: "CA",
  skills: "SK",
};

export function AiResultPreview({ result, onDiscard }: AiResultPreviewProps) {
  const { activeLanguage } = useResumeStore();

  const patchedSections = Object.keys(result.proposedResumePatch) as SectionKey[];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Summary */}
        <div className="ai-result-card">
          <h3 className="text-sm font-semibold text-[var(--color-text)] mb-2 flex items-center gap-2">
            <span className="ai-mode-token">AI</span>
            {t("ai.resultSummary")}
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
            {result.summary}
          </p>
        </div>

        {/* Warnings */}
        {result.warnings.length > 0 && (
          <div className="ai-warning-card">
            <h3 className="text-sm font-semibold text-[var(--color-warning)] mb-2 flex items-center gap-2">
              <span className="ai-mode-token">!</span>
              {t("ai.resultWarnings")}
            </h3>
            <ul className="space-y-1">
              {result.warnings.map((warning, i) => (
                <li key={i} className="text-xs text-[var(--color-text-secondary)] flex gap-2">
                  <span className="shrink-0">•</span>
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Section notes */}
        {patchedSections.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2">
              <span className="ai-mode-token">CH</span>
              {t("ai.resultChanges")}
            </h3>
            {patchedSections.map((section) => {
              const label = SECTION_LABELS[section]?.[activeLanguage] || SECTION_LABELS[section]?.zh || section;
              const code = SECTION_CODES[section] || "SC";
              const note = result.sectionNotes[section];

              return (
                <div key={section} className="ai-section-note">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="ai-mode-token">{code}</span>
                    <span className="text-xs font-semibold text-[var(--color-text)]">{label}</span>
                  </div>
                  {note && (
                    <p className="text-xs text-[var(--color-text-muted)] ml-6">{note}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Apply / Discard controls */}
      <AiApplyControls result={result} onDiscard={onDiscard} />
    </div>
  );
}
