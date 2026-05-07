"use client";

import { useRef, useState } from "react";
import { useResumeStore } from "@/store/useResumeStore";
import t from "@/lib/i18n";
import {
  AVATAR_ACCEPTED_MIME_TYPES,
  readFileAsDataUrl,
  validateAvatarFile,
} from "@/lib/image/avatarImage";
import { ImageCropper } from "@/components/ui/ImageCropper";

export function PersonalInfoForm() {
  const { data, activeLanguage, setPersonalInfo } = useResumeStore();
  const info = data.personalInfo;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarError, setAvatarError] = useState("");
  const [cropSource, setCropSource] = useState<string | null>(null);

  const handleAvatarFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const errorKey = validateAvatarFile(file);
    if (errorKey) {
      setAvatarError(t(errorKey));
      event.target.value = "";
      return;
    }

    try {
      setAvatarError("");
      const dataUrl = await readFileAsDataUrl(file);
      setCropSource(dataUrl);
    } catch (err) {
      console.error("Avatar file read failed:", err);
      setAvatarError(t("avatar.readFailed"));
    } finally {
      event.target.value = "";
    }
  };

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

      <div className="rounded-md border border-[var(--color-border)] p-3">
        <label className="field-label">{t("personalInfo.avatarUrl")}</label>
        <div className="mt-2 flex gap-3">
          <div className="flex h-[88px] w-[66px] shrink-0 items-center justify-center overflow-hidden rounded border border-dashed border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[11px] text-[var(--color-text-muted)]">
            {info.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={info.avatarUrl} alt={t("personalInfo.avatarPreview")} className="h-full w-full object-cover" />
            ) : (
              <span>{t("personalInfo.avatarPreview")}</span>
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <input
              type="text"
              value={info.avatarUrl}
              onChange={(e) => {
                setAvatarError("");
                setPersonalInfo({ avatarUrl: e.target.value });
              }}
              className="field-input"
              placeholder="https://example.com/photo.jpg"
            />
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="btn-secondary px-3 py-1.5 text-xs"
                onClick={() => fileInputRef.current?.click()}
              >
                {t("personalInfo.avatarUpload")}
              </button>
              <button
                type="button"
                className="btn-danger px-3 py-1.5 text-xs"
                disabled={!info.avatarUrl}
                onClick={() => {
                  setAvatarError("");
                  setPersonalInfo({ avatarUrl: "" });
                }}
              >
                {t("personalInfo.avatarRemove")}
              </button>
            </div>
            {avatarError && <div className="text-xs text-red-600">{avatarError}</div>}
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept={AVATAR_ACCEPTED_MIME_TYPES.join(",")}
          className="hidden"
          onChange={handleAvatarFileChange}
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

      {cropSource && (
        <ImageCropper
          imageDataUrl={cropSource}
          language={activeLanguage}
          onCancel={() => setCropSource(null)}
          onConfirm={(croppedDataUrl) => {
            setAvatarError("");
            setPersonalInfo({ avatarUrl: croppedDataUrl });
            setCropSource(null);
          }}
        />
      )}
    </div>
  );
}
