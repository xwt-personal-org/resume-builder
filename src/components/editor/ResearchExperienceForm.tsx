"use client";

import { useResumeStore } from "@/store/useResumeStore";
import t from "@/lib/i18n";
import { BilingualListInput } from "@/components/ui/BilingualListInput";

export function ResearchExperienceForm() {
  const { data, addResearchExperience, updateResearchExperience, removeResearchExperience } = useResumeStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--color-text)]">
          {t("sections.researchExperience")}
        </h3>
        <button onClick={() => addResearchExperience()} className="btn-primary text-xs">
          + {t("editor.addSection")}
        </button>
      </div>

      {(data.researchExperience?.length ?? 0) === 0 && (
        <p className="text-sm text-[var(--color-text-muted)] text-center py-8">
          暂无科研经历，点击上方按钮添加
        </p>
      )}

      {data.researchExperience.map((item, index) => (
        <div key={item.id} className="section-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[var(--color-text-muted)]">#{index + 1}</span>
            <button onClick={() => removeResearchExperience(item.id)} className="btn-danger text-xs">
              {t("editor.deleteSection")}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="field-label">{t("research.institutionZh")}</label>
              <input
                type="text"
                value={item.institution.zh}
                onChange={(e) => updateResearchExperience(item.id, { institution: { ...item.institution, zh: e.target.value } })}
                className="field-input"
                placeholder="北京大学计算机视觉实验室"
              />
            </div>
            <div>
              <label className="field-label">{t("research.institutionEn")}</label>
              <input
                type="text"
                value={item.institution.en}
                onChange={(e) => updateResearchExperience(item.id, { institution: { ...item.institution, en: e.target.value } })}
                className="field-input"
                placeholder="PKU Computer Vision Lab"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="field-label">{t("research.projectZh")}</label>
              <input
                type="text"
                value={item.project.zh}
                onChange={(e) => updateResearchExperience(item.id, { project: { ...item.project, zh: e.target.value } })}
                className="field-input"
                placeholder="基于深度学习的医学图像分割研究"
              />
            </div>
            <div>
              <label className="field-label">{t("research.projectEn")}</label>
              <input
                type="text"
                value={item.project.en}
                onChange={(e) => updateResearchExperience(item.id, { project: { ...item.project, en: e.target.value } })}
                className="field-input"
                placeholder="Deep Learning for Medical Image Segmentation"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="field-label">{t("research.roleZh")}</label>
              <input
                type="text"
                value={item.role.zh}
                onChange={(e) => updateResearchExperience(item.id, { role: { ...item.role, zh: e.target.value } })}
                className="field-input"
                placeholder="研究助理"
              />
            </div>
            <div>
              <label className="field-label">{t("research.roleEn")}</label>
              <input
                type="text"
                value={item.role.en}
                onChange={(e) => updateResearchExperience(item.id, { role: { ...item.role, en: e.target.value } })}
                className="field-input"
                placeholder="Research Assistant"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="field-label">{t("research.period")}</label>
            <input
              type="text"
              value={item.period}
              onChange={(e) => updateResearchExperience(item.id, { period: e.target.value })}
              className="field-input"
              placeholder="2023.03 - 2023.12"
            />
          </div>

          <div className="mb-3">
            <label className="field-label">{t("research.descriptionZh")}</label>
            <textarea
              value={item.description.zh}
              onChange={(e) => updateResearchExperience(item.id, { description: { ...item.description, zh: e.target.value } })}
              className="field-input min-h-[60px] resize-y"
              rows={2}
              placeholder="研究概述..."
            />
          </div>

          <div className="mb-3">
            <label className="field-label">{t("research.descriptionEn")}</label>
            <textarea
              value={item.description.en}
              onChange={(e) => updateResearchExperience(item.id, { description: { ...item.description, en: e.target.value } })}
              className="field-input min-h-[60px] resize-y"
              rows={2}
              placeholder="Research overview..."
            />
          </div>

          <div>
            <BilingualListInput
              label={t("research.highlights")}
              value={item.highlights}
              onChange={(highlights) => updateResearchExperience(item.id, { highlights })}
              zhPlaceholder="例如：在公开数据集上达到Dice系数0.91"
              enPlaceholder="e.g. Achieved Dice coefficient of 0.91 on public dataset"
              addButtonLabel={`+ ${t("research.addHighlight")}`}
              emptyText={t("research.empty")}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
