"use client";

import { useState, useRef } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import { downloadJSON, importFromJSON } from "@/lib/export/json";
import { downloadSVG } from "@/lib/export/svg";
import t from "@/lib/i18n";
import { ShutdownButton } from "@/components/runtime/ShutdownButton";
import { normalizeSectionOrder } from "@/lib/resume/sectionOrder";
import type { ResumeData, TemplateName, SectionKey, SectionEmphasis } from "@/types/resume";

interface PrintPayload {
  data: ResumeData;
  template: TemplateName;
  sectionOrder: SectionKey[];
  emphasis: Partial<Record<SectionKey, SectionEmphasis>>;
  language: "zh" | "en";
  createdAt: number;
}

export function ExportBar() {
  const store = useResumeStore();
  const [feedback, setFeedback] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showFeedback = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2500);
  };

  const handlePrintPDF = () => {
    const payload: PrintPayload = {
      data: store.data,
      template: store.template,
      sectionOrder: normalizeSectionOrder(store.sectionOrder),
      emphasis: store.emphasis,
      language: store.activeLanguage,
      createdAt: Date.now(),
    };
    sessionStorage.setItem("resume-export-payload", JSON.stringify(payload));
    const printWindow = window.open("/export", "_blank");
    if (!printWindow) {
      sessionStorage.removeItem("resume-export-payload");
      showFeedback(t("export.popupBlocked"));
      return;
    }
    sessionStorage.removeItem("resume-export-payload");
  };

  const handleExportSVG = () => {
    try {
      downloadSVG({
        data: store.data,
        sectionOrder: normalizeSectionOrder(store.sectionOrder),
        emphasis: store.emphasis,
        language: store.activeLanguage,
        template: store.template,
      });
    } catch (err) {
      console.error("SVG export failed:", err);
      showFeedback(t("export.svgFailed"));
    }
  };

  const handleExportJSON = () => {
    try {
      downloadJSON(store.data);
    } catch (err) {
      console.error("JSON export failed:", err);
    }
  };

  const handleImportJSON = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const imported = importFromJSON(content);
      if (imported) {
        store.loadResumeData(imported);
        showFeedback(t("export.importSuccess"));
      } else {
        showFeedback(t("export.importFailed"));
      }
    };
    reader.readAsText(file);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="no-print flex items-center gap-2 px-5 py-2 bg-[var(--color-bg-tertiary)] border-b border-[var(--color-border)]">
      <div className="flex items-center gap-1.5">
        <button onClick={handlePrintPDF} className="btn-primary text-xs px-3 py-1.5">
          {t("export.oneClickPdf")}
        </button>
        <button onClick={handleExportSVG} className="btn-secondary text-xs px-3 py-1.5">
          SVG
        </button>
        <button onClick={handleExportJSON} className="btn-secondary text-xs px-3 py-1.5">
          JSON
        </button>
        <button onClick={handleImportJSON} className="btn-secondary text-xs px-3 py-1.5">
          {t("export.importJson")}
        </button>
      </div>

      {feedback && (
        <span className="text-xs text-[var(--color-primary)] font-medium ml-1">{feedback}</span>
      )}

      <div className="flex-1" />

      <button
        onClick={() => {
          if (confirm("加载示例数据将覆盖当前编辑的简历内容，确定要继续吗？")) {
            store.loadDemoData();
          }
        }}
        title="加载虚构的示例简历以供预览，将会覆盖当前内容"
        className="btn-secondary text-xs px-3 py-1.5 text-[var(--color-primary)] border-[var(--color-primary-light)] hover:bg-blue-50"
      >
        加载示例
      </button>
      <button
        onClick={() => {
          if (confirm("确定要清空所有内容吗？")) {
            store.resetResumeData();
          }
        }}
        className="btn-danger text-xs px-3 py-1.5"
      >
        {t("editor.reset")}
      </button>
      <ShutdownButton />

      <input

        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
