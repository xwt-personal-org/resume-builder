"use client";

import { useResumeStore } from "@/store/useResumeStore";
import { SECTION_LABELS } from "@/types";
import type { SectionKey } from "@/types";
import t from "@/lib/i18n";

const CONTROLLABLE_SECTIONS: SectionKey[] = [
  "education",
  "researchExperience",
  "honors",
  "experience",
  "projects",
  "campusActivities",
  "skills",
];

export function LayoutControls() {
  const { sectionOrder, emphasis, activeLanguage, toggleSectionVisibility } = useResumeStore();
  const orderedSections = [
    ...sectionOrder.filter((section) => CONTROLLABLE_SECTIONS.includes(section)),
    ...CONTROLLABLE_SECTIONS.filter((section) => !sectionOrder.includes(section)),
  ];

  return (
    <section className="section-card mb-4" aria-label={t("layout.title")}>
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-[var(--color-text)]">{t("layout.title")}</h3>
        <p className="mt-1 text-xs leading-5 text-[var(--color-text-muted)]">
          {t("layout.description")}
        </p>
      </div>

      <div className="space-y-2">
        {orderedSections.map((section) => {
          const hidden = emphasis[section] === "hidden";
          const label = SECTION_LABELS[section][activeLanguage] || SECTION_LABELS[section].zh;

          return (
            <div
              key={section}
              className="flex items-center justify-between gap-3 rounded-md border border-[var(--color-border)] px-3 py-2"
            >
              <div>
                <div className="text-xs font-medium text-[var(--color-text)]">{label}</div>
                <div className="text-[11px] text-[var(--color-text-muted)]">
                  {hidden ? t("layout.hidden") : t("layout.visible")}
                </div>
              </div>
              <button
                type="button"
                className={hidden ? "btn-secondary text-xs px-2.5 py-1" : "btn-danger text-xs px-2.5 py-1"}
                aria-pressed={!hidden}
                aria-label={`${hidden ? t("layout.show") : t("layout.hide")} ${label}`}
                onClick={() => toggleSectionVisibility(section)}
              >
                {hidden ? t("layout.show") : t("layout.hide")}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
