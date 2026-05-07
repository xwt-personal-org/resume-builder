"use client";

import { useEffect, useState } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import { PreviewPanel } from "@/components/preview/PreviewPanel";
import type { ResumeData, TemplateName, SectionKey, SectionEmphasis } from "@/types";
import { ALL_SECTION_KEYS, normalizeSectionOrder } from "@/lib/resume/sectionOrder";

interface PrintPayload {
  data: ResumeData;
  template: TemplateName;
  sectionOrder: SectionKey[];
  emphasis: Partial<Record<SectionKey, SectionEmphasis>>;
  language: "zh" | "en";
  createdAt: number;
}

const TEMPLATE_NAMES: TemplateName[] = ["classic", "modern", "minimal", "compact"];
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isTemplateName(value: unknown): value is TemplateName {
  return typeof value === "string" && (TEMPLATE_NAMES as string[]).includes(value);
}

function isLanguage(value: unknown): value is "zh" | "en" {
  return value === "zh" || value === "en";
}

function isSectionOrder(value: unknown): value is SectionKey[] {
  return Array.isArray(value);
}

function isSectionEmphasisMap(value: unknown): value is Partial<Record<SectionKey, SectionEmphasis>> {
  if (!isRecord(value)) return false;
  return Object.entries(value).every(
    ([key, item]) =>
      (ALL_SECTION_KEYS as readonly string[]).includes(key) &&
      (item === "expanded" || item === "normal" || item === "compact" || item === "hidden"),
  );
}

function isPrintPayload(value: unknown): value is PrintPayload {
  if (!isRecord(value)) return false;
  const candidate = value as Record<string, unknown>;
  return (
    isRecord(candidate.data) &&
    isTemplateName(candidate.template) &&
    isSectionOrder(candidate.sectionOrder) &&
    isLanguage(candidate.language) &&
    (candidate.emphasis === undefined || isSectionEmphasisMap(candidate.emphasis))
  );
}

function readPrintPayload(): PrintPayload | null {
  try {
    const raw = sessionStorage.getItem("resume-export-payload");
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isPrintPayload(parsed)) {
      sessionStorage.removeItem("resume-export-payload");
      return null;
    }
    return {
      ...parsed,
      sectionOrder: normalizeSectionOrder(parsed.sectionOrder),
      emphasis: parsed.emphasis ?? {},
      createdAt: typeof parsed.createdAt === "number" ? parsed.createdAt : Date.now(),
    };
  } catch {
    return null;
  }
}

export default function ExportPage() {
  const [ready, setReady] = useState(false);
  const [noPayload, setNoPayload] = useState(false);
  const { loadResumeData, setTemplate, setSectionOrder, setEmphasis, setActiveLanguage } = useResumeStore();

  useEffect(() => {
    document.title = "Resume Print Export";

    const payload = readPrintPayload();
    if (!payload) {
      requestAnimationFrame(() => setNoPayload(true));
      return;
    }

    loadResumeData(payload.data);
    setTemplate(payload.template);
    setSectionOrder(payload.sectionOrder);
    setEmphasis(payload.emphasis);
    setActiveLanguage(payload.language);

    requestAnimationFrame(() => {
      setReady(true);
      setTimeout(() => {
        window.print();
      }, 500);
    });

    const onAfterPrint = () => {
      sessionStorage.removeItem("resume-export-payload");
    };
    window.addEventListener("afterprint", onAfterPrint);
    return () => window.removeEventListener("afterprint", onAfterPrint);
  }, [loadResumeData, setTemplate, setSectionOrder, setEmphasis, setActiveLanguage]);

  if (noPayload) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", fontFamily: "system-ui, sans-serif", color: "#1f2937" }}>
        未找到导出数据，请返回主页面重新导出。
      </div>
    );
  }

  if (!ready) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "system-ui, sans-serif", color: "#666" }}>
        Loading...
      </div>
    );
  }

  return (
    <div className="print-container" style={{ display: "flex", justifyContent: "center", padding: "0" }}>
      <PreviewPanel />
    </div>
  );
}
