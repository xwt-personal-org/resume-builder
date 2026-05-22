"use client";

import { useState } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import { requestAiResume } from "@/lib/ai/client";
import type { AiMode } from "@/lib/ai/schema";
import type { AiResumeResponse } from "@/lib/ai/schema";
import { AiResultPreview } from "./AiResultPreview";
import t from "@/lib/i18n";

const AI_MODES: { value: AiMode; labelKey: string; code: string }[] = [
  { value: "generate", labelKey: "ai.modeGenerate", code: "GN" },
  { value: "optimize", labelKey: "ai.modeOptimize", code: "OP" },
  { value: "polish", labelKey: "ai.modePolish", code: "PL" },
  { value: "translate", labelKey: "ai.modeTranslate", code: "TR" },
];

export function AiAssistantPanel() {
  const { data, activeLanguage } = useResumeStore();
  const [mode, setMode] = useState<AiMode>("optimize");
  const [targetRole, setTargetRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [personalMaterials, setPersonalMaterials] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AiResumeResponse | null>(null);

  const canSubmit = !loading && (
    mode === "polish" || mode === "translate" ||
    jobDescription.trim().length > 0 || personalMaterials.trim().length > 0
  );

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    const response = await requestAiResume({
      mode,
      language: activeLanguage,
      targetRole: targetRole.trim() || undefined,
      jobDescription: jobDescription.trim() || undefined,
      personalMaterials: personalMaterials.trim() || undefined,
      currentResume: data,
    });

    setLoading(false);

    if (!response.success) {
      setError(response.error);
      return;
    }

    setResult(response.data);
  };

  const handleDiscard = () => {
    setResult(null);
    setError(null);
  };

  if (result) {
    return (
      <AiResultPreview
        result={result}
        onDiscard={handleDiscard}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Mode selector */}
      <div>
        <label className="field-label">{t("ai.modeLabel")}</label>
        <div className="grid grid-cols-2 gap-2">
          {AI_MODES.map((m) => (
            <button
              key={m.value}
              onClick={() => setMode(m.value)}
              className={`ai-mode-card ${mode === m.value ? "ai-mode-card--active" : ""}`}
            >
              <span className="ai-mode-token">{m.code}</span>
              <span className="text-xs font-medium">{t(m.labelKey)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Target role */}
      {(mode === "generate" || mode === "optimize") && (
        <div>
          <label className="field-label">{t("ai.targetRole")}</label>
          <input
            type="text"
            className="field-input"
            placeholder={t("ai.targetRolePlaceholder")}
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
          />
        </div>
      )}

      {/* Job description */}
      {(mode === "generate" || mode === "optimize") && (
        <div>
          <label className="field-label">{t("ai.jdLabel")}</label>
          <textarea
            className="field-input min-h-[100px] resize-y"
            placeholder={t("ai.jdPlaceholder")}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>
      )}

      {/* Personal materials */}
      {mode === "generate" && (
        <div>
          <label className="field-label">{t("ai.materialsLabel")}</label>
          <textarea
            className="field-input min-h-[100px] resize-y"
            placeholder={t("ai.materialsPlaceholder")}
            value={personalMaterials}
            onChange={(e) => setPersonalMaterials(e.target.value)}
          />
        </div>
      )}

      {/* Error display */}
      {error && (
        <div className="ai-error-banner" role="alert">
          <span className="text-sm font-medium">Error: {error}</span>
        </div>
      )}

      {/* Generate button */}
      <button
        onClick={handleGenerate}
        disabled={!canSubmit}
        className="btn-primary w-full py-2.5 text-sm"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="ai-spinner" />
            {t("ai.generating")}
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            {t("ai.generateBtn")}
          </span>
        )}
      </button>

      {/* Privacy notice */}
      <div className="ai-privacy-notice">
        <p className="text-xs leading-relaxed text-[var(--color-text-muted)]">
          {t("ai.privacyNotice")}
        </p>
      </div>
    </div>
  );
}
