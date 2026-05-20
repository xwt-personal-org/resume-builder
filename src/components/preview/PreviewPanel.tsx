"use client";

import { forwardRef, useEffect, useMemo } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import { normalizeSectionOrder } from "@/lib/resume/sectionOrder";
import { RESUME_TOKENS } from "@/lib/templates/designTokens";
import { ClassicTemplate } from "@/components/templates/ClassicTemplate";
import { ModernTemplate } from "@/components/templates/ModernTemplate";
import { MinimalTemplate } from "@/components/templates/MinimalTemplate";
import { CompactTemplate } from "@/components/templates/CompactTemplate";
import type { ResumeData, SectionEmphasis, SectionKey, TemplateName } from "@/types";

export interface PreviewSnapshot {
  data: ResumeData;
  template: TemplateName;
  sectionOrder: SectionKey[];
  emphasis: Partial<Record<SectionKey, SectionEmphasis>>;
  language: "zh" | "en";
}

interface PreviewPanelProps {
  snapshot?: PreviewSnapshot;
  exportMode?: boolean;
  onRendered?: () => void;
}

export const PreviewPanel = forwardRef<HTMLDivElement, PreviewPanelProps>(function PreviewPanel(
  { snapshot, exportMode = false, onRendered },
  ref,
) {
  const store = useResumeStore();
  const data = snapshot?.data ?? store.data;
  const template = snapshot?.template ?? store.template;
  const sectionOrder = snapshot?.sectionOrder ?? store.sectionOrder;
  const emphasis = snapshot?.emphasis ?? store.emphasis;
  const language = snapshot?.language ?? store.activeLanguage;
  const normalizedSectionOrder = useMemo(
    () => normalizeSectionOrder(sectionOrder),
    [sectionOrder],
  );

  const props = {
    data,
    sectionOrder: normalizedSectionOrder,
    emphasis,
    language,
  };

  useEffect(() => {
    onRendered?.();
  }, [onRendered, data, template, normalizedSectionOrder, emphasis, language]);

  return (
    <div className={`flex justify-center${exportMode ? " export-preview-shell" : ""}`}>
      <div
        ref={ref}
        id="resume-preview"
        data-template={template}
        data-language={language}
        data-export-mode={exportMode ? "true" : "false"}
        className="bg-white shadow-lg resume-print-area"
        style={{
          width: `${RESUME_TOKENS.page.widthPx}px`,
          minHeight: `${RESUME_TOKENS.page.minHeightPx}px`,
        }}
      >
        {template === "modern" && <ModernTemplate {...props} />}
        {template === "minimal" && <MinimalTemplate {...props} />}
        {template === "compact" && <CompactTemplate {...props} />}
        {(template === "classic" || !["modern", "minimal", "compact"].includes(template)) && <ClassicTemplate {...props} />}
      </div>
    </div>
  );
});
