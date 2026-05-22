"use client";

import { useResumeStore } from "@/store/useResumeStore";
import type { AiResumeResponse } from "@/lib/ai/schema";
import t from "@/lib/i18n";

interface AiApplyControlsProps {
  result: AiResumeResponse;
  onDiscard: () => void;
}

export function AiApplyControls({ result, onDiscard }: AiApplyControlsProps) {
  const { applyAiPatch } = useResumeStore();

  const handleApply = () => {
    applyAiPatch(result.proposedResumePatch);
    onDiscard();
  };

  return (
    <div className="shrink-0 border-t border-[var(--color-border)] bg-[var(--color-bg-tertiary)] p-4 space-y-2">
      <button
        onClick={handleApply}
        className="btn-primary w-full py-2.5 text-sm"
      >
        {t("ai.applyBtn")}
      </button>
      <button
        onClick={onDiscard}
        className="btn-secondary w-full py-2 text-sm"
      >
        {t("ai.discardBtn")}
      </button>
    </div>
  );
}
