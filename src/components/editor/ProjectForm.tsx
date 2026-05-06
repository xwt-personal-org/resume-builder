"use client";

import { useResumeStore } from "@/store/useResumeStore";
import t from "@/lib/i18n";
import { TagInput } from "@/components/ui/TagInput";
import { BilingualListInput } from "@/components/ui/BilingualListInput";

export function ProjectForm() {
  const { data, addProject, updateProject, removeProject } = useResumeStore();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--color-text)]">
          {t("sections.projects")}
        </h3>
        <button onClick={() => addProject()} className="btn-primary text-xs">
          + {t("editor.addSection")}
        </button>
      </div>

      {(data.projects?.length ?? 0) === 0 && (
        <p className="text-sm text-[var(--color-text-muted)] text-center py-8">
          暂无项目，点击上方按钮添加
        </p>
      )}

      {data.projects.map((proj, index) => (
        <div key={proj.id} className="section-card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-[var(--color-text-muted)]">#{index + 1}</span>
            <button onClick={() => removeProject(proj.id)} className="btn-danger text-xs">
              {t("editor.deleteSection")}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="field-label">{t("projects.nameZh")}</label>
              <input
                type="text"
                value={proj.name.zh}
                onChange={(e) => updateProject(proj.id, { name: { ...proj.name, zh: e.target.value } })}
                className="field-input"
              />
            </div>
            <div>
              <label className="field-label">{t("projects.nameEn")}</label>
              <input
                type="text"
                value={proj.name.en}
                onChange={(e) => updateProject(proj.id, { name: { ...proj.name, en: e.target.value } })}
                className="field-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="field-label">{t("projects.roleZh")}</label>
              <input
                type="text"
                value={proj.role.zh}
                onChange={(e) => updateProject(proj.id, { role: { ...proj.role, zh: e.target.value } })}
                className="field-input"
                placeholder="前端开发"
              />
            </div>
            <div>
              <label className="field-label">{t("projects.roleEn")}</label>
              <input
                type="text"
                value={proj.role.en}
                onChange={(e) => updateProject(proj.id, { role: { ...proj.role, en: e.target.value } })}
                className="field-input"
                placeholder="Frontend Developer"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="field-label">{t("projects.period")}</label>
              <input
                type="text"
                value={proj.period}
                onChange={(e) => updateProject(proj.id, { period: e.target.value })}
                className="field-input"
                placeholder="2023.09 - 2024.01"
              />
            </div>
          </div>

          <div className="mb-3">
            <TagInput
              label={t("projects.tech")}
              value={proj.tech}
              onChange={(tech) => updateProject(proj.id, { tech })}
              placeholder="例如：React / TypeScript / Node.js"
              emptyText="暂无技术栈，点击添加一项"
            />
          </div>

          <div className="mb-3">
            <label className="field-label">{t("projects.descriptionZh")}</label>
            <textarea
              value={proj.description.zh}
              onChange={(e) => updateProject(proj.id, { description: { ...proj.description, zh: e.target.value } })}
              className="field-input min-h-[60px] resize-y"
              rows={2}
            />
          </div>

          <div>
            <label className="field-label">{t("projects.descriptionEn")}</label>
            <textarea
              value={proj.description.en}
              onChange={(e) => updateProject(proj.id, { description: { ...proj.description, en: e.target.value } })}
              className="field-input min-h-[60px] resize-y"
              rows={2}
            />
          </div>

          <div className="mb-3">
            <BilingualListInput
              label={t("projects.highlights")}
              value={proj.highlights}
              onChange={(highlights) => updateProject(proj.id, { highlights })}
              zhPlaceholder="例如：实现核心交易链路，支持 2000+ 注册用户"
              enPlaceholder="e.g. Implemented the core transaction flow for 2,000+ registered users"
              addButtonLabel={`+ ${t("projects.addHighlight")}`}
              emptyText="暂无项目亮点，点击添加一项"
            />
          </div>

          <div className="mt-3">
            <label className="field-label">{t("projects.link")}</label>
            <input
              type="url"
              value={proj.link}
              onChange={(e) => updateProject(proj.id, { link: e.target.value })}
              className="field-input"
              placeholder="https://github.com/..."
            />
          </div>
        </div>
      ))}
    </div>
  );
}
