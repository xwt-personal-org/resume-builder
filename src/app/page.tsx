"use client";

import { useEffect } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import { SidebarEditor } from "@/components/editor/SidebarEditor";
import { PreviewPanel } from "@/components/preview/PreviewPanel";
import { ExportBar } from "@/components/export/ExportBar";
import t, { setLocale } from "@/lib/i18n";
import { TEMPLATE_NAMES } from "@/types";
import type { TemplateName } from "@/types";

export default function Home() {
  const { activeLanguage, setActiveLanguage, template, setTemplate } = useResumeStore();

  useEffect(() => {
    setLocale(activeLanguage);
  }, [activeLanguage]);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[var(--color-bg-secondary)]">
      <header className="no-print flex items-center justify-between px-5 py-2.5 bg-white border-b border-[var(--color-border)] shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <h1 className="text-base font-bold text-[var(--color-text)] tracking-tight">
            {t("app.title")}
          </h1>
          <span className="text-[11px] text-[var(--color-text-muted)] hidden sm:inline">
            {t("app.subtitle")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[var(--color-bg-tertiary)] rounded-lg p-0.5">
            {(Object.keys(TEMPLATE_NAMES) as TemplateName[]).map((tmpl) => (
              <button
                key={tmpl}
                onClick={() => setTemplate(tmpl)}
                className={`text-xs px-3 py-1.5 rounded-md transition-all duration-150 font-medium ${
                  template === tmpl
                    ? "bg-white shadow-sm text-[var(--color-primary)]"
                    : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
                }`}
              >
                {TEMPLATE_NAMES[tmpl][activeLanguage]}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              const next = activeLanguage === "zh" ? "en" : "zh";
              setActiveLanguage(next);
              setLocale(next);
            }}
            className="text-xs px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)] hover:text-[var(--color-text)] transition-all font-medium"
          >
            {activeLanguage === "zh" ? "EN" : "中文"}
          </button>
        </div>
      </header>

      <ExportBar />

      <div className="flex flex-1 overflow-hidden">
        <div className="no-print w-[420px] min-w-[420px] border-r border-[var(--color-border)] overflow-y-auto bg-white flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <SidebarEditor />
          </div>
          <div className="p-4 bg-[var(--color-bg-tertiary)] border-t border-[var(--color-border)] text-xs text-[var(--color-text-muted)] text-center">
            🔒 隐私说明：您的简历数据仅保存在浏览器本地，我们不会收集或上传任何个人信息。
          </div>
        </div>

        <main className="flex-1 overflow-auto bg-[var(--color-bg-secondary)] p-6">
          <PreviewPanel />
        </main>
      </div>
    </div>
  );
}
