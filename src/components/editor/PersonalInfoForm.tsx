"use client";

import { useResumeStore } from "@/store/useResumeStore";
import t from "@/lib/i18n";

export function PersonalInfoForm() {
  const { data, setPersonalInfo } = useResumeStore();
  const info = data.personalInfo;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-[var(--color-text)]">
        {t("sections.personalInfo")}
      </h3>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="field-label">{t("personalInfo.nameZh")}</label>
          <input
            type="text"
            value={info.name.zh}
            onChange={(e) => setPersonalInfo({ name: { ...info.name, zh: e.target.value } })}
            className="field-input"
            placeholder="张三"
          />
        </div>
        <div>
          <label className="field-label">{t("personalInfo.nameEn")}</label>
          <input
            type="text"
            value={info.name.en}
            onChange={(e) => setPersonalInfo({ name: { ...info.name, en: e.target.value } })}
            className="field-input"
            placeholder="San Zhang"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="field-label">{t("personalInfo.titleZh")}</label>
          <input
            type="text"
            value={info.title.zh}
            onChange={(e) => setPersonalInfo({ title: { ...info.title, zh: e.target.value } })}
            className="field-input"
            placeholder="高级前端工程师"
          />
        </div>
        <div>
          <label className="field-label">{t("personalInfo.titleEn")}</label>
          <input
            type="text"
            value={info.title.en}
            onChange={(e) => setPersonalInfo({ title: { ...info.title, en: e.target.value } })}
            className="field-input"
            placeholder="Senior Frontend Engineer"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="field-label">{t("personalInfo.gender")}</label>
          <input
            type="text"
            value={info.gender}
            onChange={(e) => setPersonalInfo({ gender: e.target.value })}
            className="field-input"
            placeholder="男"
          />
        </div>
        <div>
          <label className="field-label">{t("personalInfo.birthDate")}</label>
          <input
            type="text"
            value={info.birthDate}
            onChange={(e) => setPersonalInfo({ birthDate: e.target.value })}
            className="field-input"
            placeholder="2000.01"
          />
        </div>
        <div>
          <label className="field-label">{t("personalInfo.politicalStatus")}</label>
          <input
            type="text"
            value={info.politicalStatus}
            onChange={(e) => setPersonalInfo({ politicalStatus: e.target.value })}
            className="field-input"
            placeholder="中共党员"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="field-label">{t("personalInfo.email")}</label>
          <input
            type="email"
            value={info.email}
            onChange={(e) => setPersonalInfo({ email: e.target.value })}
            className="field-input"
            placeholder="email@example.com"
          />
        </div>
        <div>
          <label className="field-label">{t("personalInfo.phone")}</label>
          <input
            type="tel"
            value={info.phone}
            onChange={(e) => setPersonalInfo({ phone: e.target.value })}
            className="field-input"
            placeholder="+86 138-xxxx-xxxx"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="field-label">{t("personalInfo.locationZh")}</label>
          <input
            type="text"
            value={info.location.zh}
            onChange={(e) => setPersonalInfo({ location: { ...info.location, zh: e.target.value } })}
            className="field-input"
            placeholder="北京"
          />
        </div>
        <div>
          <label className="field-label">{t("personalInfo.locationEn")}</label>
          <input
            type="text"
            value={info.location.en}
            onChange={(e) => setPersonalInfo({ location: { ...info.location, en: e.target.value } })}
            className="field-input"
            placeholder="Beijing, China"
          />
        </div>
      </div>

      <div>
        <label className="field-label">{t("personalInfo.website")}</label>
        <input
          type="url"
          value={info.website}
          onChange={(e) => setPersonalInfo({ website: e.target.value })}
          className="field-input"
          placeholder="https://github.com/username"
        />
      </div>

      <div>
        <label className="field-label">{t("personalInfo.avatarUrl")}</label>
        <input
          type="url"
          value={info.avatarUrl}
          onChange={(e) => setPersonalInfo({ avatarUrl: e.target.value })}
          className="field-input"
          placeholder="https://example.com/photo.jpg"
        />
      </div>

      <div>
        <label className="field-label">{t("personalInfo.summaryZh")}</label>
        <textarea
          value={info.summary.zh}
          onChange={(e) => setPersonalInfo({ summary: { ...info.summary, zh: e.target.value } })}
          className="field-input min-h-[80px] resize-y"
          placeholder="简短介绍自己的核心能力..."
          rows={3}
        />
      </div>

      <div>
        <label className="field-label">{t("personalInfo.summaryEn")}</label>
        <textarea
          value={info.summary.en}
          onChange={(e) => setPersonalInfo({ summary: { ...info.summary, en: e.target.value } })}
          className="field-input min-h-[80px] resize-y"
          placeholder="Brief summary of your core competencies..."
          rows={3}
        />
      </div>
    </div>
  );
}