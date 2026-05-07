"use client";

import dynamic from "next/dynamic";
import { forwardRef } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import { normalizeSectionOrder } from "@/lib/resume/sectionOrder";

const ClassicTemplate = dynamic(
  () => import("@/components/templates/ClassicTemplate").then((m) => ({ default: m.ClassicTemplate })),
  { ssr: false }
);
const ModernTemplate = dynamic(
  () => import("@/components/templates/ModernTemplate").then((m) => ({ default: m.ModernTemplate })),
  { ssr: false }
);
const MinimalTemplate = dynamic(
  () => import("@/components/templates/MinimalTemplate").then((m) => ({ default: m.MinimalTemplate })),
  { ssr: false }
);
const CompactTemplate = dynamic(
  () => import("@/components/templates/CompactTemplate").then((m) => ({ default: m.CompactTemplate })),
  { ssr: false }
);

export const PreviewPanel = forwardRef<HTMLDivElement>(function PreviewPanel(_, ref) {
  const { data, template, sectionOrder, emphasis, activeLanguage } = useResumeStore();

  const props = {
    data,
    sectionOrder: normalizeSectionOrder(sectionOrder),
    emphasis,
    language: activeLanguage,
  };

  return (
    <div className="flex justify-center">
      <div
        ref={ref}
        id="resume-preview"
        className="bg-white shadow-lg resume-print-area"
        style={{ width: "794px", minHeight: "1123px" }}
      >
        {template === "modern" && <ModernTemplate {...props} />}
        {template === "minimal" && <MinimalTemplate {...props} />}
        {template === "compact" && <CompactTemplate {...props} />}
        {(template === "classic" || !["modern", "minimal", "compact"].includes(template)) && <ClassicTemplate {...props} />}
      </div>
    </div>
  );
});
