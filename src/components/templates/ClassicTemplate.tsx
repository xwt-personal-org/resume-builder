"use client";

import type { ResumeData, SectionKey, SectionEmphasis } from "@/types";
import { RESUME_TOKENS } from "@/lib/templates/designTokens";

interface TemplateProps {
  data: ResumeData;
  sectionOrder: SectionKey[];
  emphasis: Partial<Record<SectionKey, SectionEmphasis>>;
  language: "zh" | "en";
}

const TOKENS = RESUME_TOKENS;
const C = RESUME_TOKENS.colors;

function getText(b: { zh: string; en: string } | undefined | null, lang: "zh" | "en"): string {
  if (!b) return "";
  return lang === "zh" ? b.zh || b.en : b.en || b.zh;
}

function SectionHead({ title }: { title: string }) {
  return (
    <div style={{ borderBottom: `${TOKENS.line.sectionStrongPx}px solid ${C.lineStrong}`, paddingBottom: "3px", marginBottom: `${TOKENS.spacing.sectionTitleBottom}px`, marginTop: `${TOKENS.spacing.sectionTop}px` }}>
      <span style={{ fontSize: `${TOKENS.fontSize.sectionTitle}px`, fontWeight: 700, color: C.text }}>{title}</span>
    </div>
  );
}

function PhotoSlot({ src, language, width, height }: { src: string; language: "zh" | "en"; width: number; height: number }) {
  if (src) {
    return (
      <div style={{ width: `${width}px`, height: `${height}px`, borderRadius: "2px", overflow: "hidden", flexShrink: 0, border: "1px solid #d1d5db" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </div>
    );
  }
  return (
    <div style={{ width: `${width}px`, height: `${height}px`, borderRadius: "2px", flexShrink: 0, border: "1px dashed #d1d5db", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9px", color: "#9ca3af" }}>
      {language === "zh" ? "证件照" : "Photo"}
    </div>
  );
}

export function ClassicTemplate({ data, sectionOrder, emphasis, language }: TemplateProps) {
  const visibleSections = sectionOrder.filter(
    (key) => key === "personalInfo" || emphasis[key] !== "hidden"
  );
  const info = data.personalInfo;
  const name = getText(info.name, language);

  const renderPersonalInfo = () => {
    if (!name && !info.email) return null;
    const contactParts = [
      info.gender, info.birthDate, info.politicalStatus,
      info.phone, info.email, getText(info.location, language), info.website,
    ].filter(Boolean);
    return (
      <div style={{ display: "flex", gap: "14px", alignItems: "flex-start", marginBottom: "6px", paddingBottom: "8px", borderBottom: `${TOKENS.line.sectionNormalPx}px solid ${C.line}` }}>
        <div style={{ flex: 1, textAlign: "center" }}>
          <div style={{ fontSize: `${TOKENS.fontSize.name}px`, fontWeight: 700, color: C.text, letterSpacing: "0" }}>{name}</div>
          {getText(info.title, language) && (
            <div style={{ fontSize: `${TOKENS.fontSize.sectionTitle}px`, color: C.textSecondary, marginTop: "2px" }}>{getText(info.title, language)}</div>
          )}
          {contactParts.length > 0 && (
            <div style={{ fontSize: `${TOKENS.fontSize.body}px`, color: C.textSecondary, marginTop: "6px" }}>
              {contactParts.join(" | ")}
            </div>
          )}
          {getText(info.summary, language) && (
            <div style={{ fontSize: `${TOKENS.fontSize.body}px`, color: C.textSecondary, marginTop: "10px", lineHeight: 1.5, textAlign: "left" }}>{getText(info.summary, language)}</div>
          )}
        </div>
        <PhotoSlot src={info.avatarUrl} language={language} width={TOKENS.photo.classic.width} height={TOKENS.photo.classic.height} />
      </div>
    );
  };

  const renderEducation = () => {
    if (data.education.length === 0) return null;
    return (
      <div>
        <SectionHead title={language === "zh" ? "教育背景" : "Education"} />
        {data.education.map((edu) => (
          <div key={edu.id} style={{ marginBottom: `${TOKENS.spacing.itemBottom}px` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div>
                <span style={{ fontWeight: 700, fontSize: `${TOKENS.fontSize.itemTitle}px` }}>{getText(edu.school, language)}</span>
                {getText(edu.major, language) && <span style={{ fontSize: `${TOKENS.fontSize.body}px`, color: C.textSecondary }}> · {getText(edu.major, language)}</span>}
                {getText(edu.degree, language) && <span style={{ fontSize: `${TOKENS.fontSize.body}px`, color: C.textSecondary }}> · {getText(edu.degree, language)}</span>}
              </div>
              <span style={{ fontSize: `${TOKENS.fontSize.body}px`, color: C.textMuted, flexShrink: 0 }}>{edu.period}</span>
            </div>
            {(edu.gpa || edu.courses.length > 0) && (
              <div style={{ fontSize: `${TOKENS.fontSize.meta}px`, color: C.textSecondary, marginTop: "1px" }}>
                {edu.gpa && <span>GPA: {edu.gpa}</span>}
                {edu.gpa && edu.courses.length > 0 && <span> | </span>}
                {edu.courses.length > 0 && <span>{language === "zh" ? "主修" : "Core"}: {edu.courses.join("、")}</span>}
              </div>
            )}
            {getText(edu.description, language) && (
              <div style={{ fontSize: `${TOKENS.fontSize.body}px`, color: C.textSecondary, lineHeight: 1.5, marginTop: `${TOKENS.spacing.paragraphTop}px` }}>
                {getText(edu.description, language)}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderResearchExperience = () => {
    if (!data.researchExperience || data.researchExperience.length === 0) return null;
    return (
      <div>
        <SectionHead title={language === "zh" ? "科研经历" : "Research Experience"} />
        {data.researchExperience.map((item) => (
          <div key={item.id} style={{ marginBottom: `${TOKENS.spacing.itemBottom}px` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontWeight: 700, fontSize: `${TOKENS.fontSize.itemTitle}px` }}>{getText(item.project, language) || getText(item.institution, language)}<span style={{ fontWeight: 400 }}> · {getText(item.role, language)}</span></span>
              <span style={{ fontSize: `${TOKENS.fontSize.body}px`, color: C.textMuted, flexShrink: 0 }}>{item.period}</span>
            </div>
            {getText(item.description, language) && (
              <div style={{ fontSize: `${TOKENS.fontSize.body}px`, color: C.textSecondary, lineHeight: 1.5, marginTop: "2px" }}>{getText(item.description, language)}</div>
            )}
            {item.highlights && item.highlights.length > 0 && (
              <ul style={{ margin: `${TOKENS.spacing.listTop}px 0 0 0`, paddingLeft: "14px", fontSize: `${TOKENS.fontSize.body}px`, color: C.textSecondary }}>
                {item.highlights.map((h, i) => <li key={i} style={{ lineHeight: 1.5 }}>{getText(h, language)}</li>)}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderHonors = () => {
    if (data.honors.length === 0) return null;
    return (
      <div>
        <SectionHead title={language === "zh" ? "荣誉奖项" : "Honors & Awards"} />
        {data.honors.map((h) => (
          <div key={h.id} style={{ marginBottom: "3px", fontSize: `${TOKENS.fontSize.body}px` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div>
                <span style={{ fontWeight: 600 }}>{getText(h.title, language)}</span>
                {h.level && <span style={{ color: C.textMuted, marginLeft: "4px" }}>[{h.level}]</span>}
              </div>
              <span style={{ color: C.textMuted, flexShrink: 0 }}>{h.period}</span>
            </div>
            {getText(h.description, language) && (
              <div style={{ fontSize: `${TOKENS.fontSize.body}px`, color: C.textSecondary, lineHeight: 1.5, marginTop: `${TOKENS.spacing.paragraphTop}px` }}>{getText(h.description, language)}</div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderExperience = () => {
    if (data.experience.length === 0) return null;
    return (
      <div>
        <SectionHead title={language === "zh" ? "实习经历" : "Internship"} />
        {data.experience.map((exp) => (
          <div key={exp.id} style={{ marginBottom: `${TOKENS.spacing.itemBottom}px` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontWeight: 700, fontSize: `${TOKENS.fontSize.itemTitle}px` }}>{getText(exp.company, language)}<span style={{ fontWeight: 400 }}> · {getText(exp.role, language)}</span></span>
              <span style={{ fontSize: `${TOKENS.fontSize.body}px`, color: C.textMuted, flexShrink: 0 }}>{exp.period}</span>
            </div>
            {getText(exp.description, language) && (
              <div style={{ fontSize: `${TOKENS.fontSize.body}px`, color: C.textSecondary, lineHeight: 1.5, marginTop: "2px" }}>{getText(exp.description, language)}</div>
            )}
            {exp.highlights && exp.highlights.length > 0 && (
              <ul style={{ margin: `${TOKENS.spacing.listTop}px 0 0 0`, paddingLeft: "14px", fontSize: `${TOKENS.fontSize.body}px`, color: C.textSecondary }}>
                {exp.highlights.map((h, i) => <li key={i} style={{ lineHeight: 1.5 }}>{getText(h, language)}</li>)}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderProjects = () => {
    if (!data.projects || data.projects.length === 0) return null;
    return (
      <div>
        <SectionHead title={language === "zh" ? "项目经历" : "Projects"} />
        {data.projects.map((proj) => (
          <div key={proj.id} style={{ marginBottom: `${TOKENS.spacing.itemBottom}px` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontWeight: 700, fontSize: `${TOKENS.fontSize.itemTitle}px` }}>{getText(proj.name, language)}{getText(proj.role, language) ? <span style={{ fontWeight: 400 }}> · {getText(proj.role, language)}</span> : null}</span>
              {proj.period && <span style={{ fontSize: `${TOKENS.fontSize.body}px`, color: C.textMuted, flexShrink: 0 }}>{proj.period}</span>}
            </div>
            {proj.link && (
              <div style={{ fontSize: "10px", color: C.textMuted, marginTop: "1px" }}>{proj.link}</div>
            )}
            {proj.tech.length > 0 && (
              <div style={{ fontSize: `${TOKENS.fontSize.tag}px`, color: C.textSecondary, marginTop: "2px" }}>
                {proj.tech.join(" · ")}
              </div>
            )}
            {getText(proj.description, language) && (
              <div style={{ fontSize: `${TOKENS.fontSize.body}px`, color: C.textSecondary, lineHeight: 1.5, marginTop: "2px" }}>{getText(proj.description, language)}</div>
            )}
            {proj.highlights && proj.highlights.length > 0 && (
              <ul style={{ margin: `${TOKENS.spacing.listTop}px 0 0 0`, paddingLeft: "14px", fontSize: `${TOKENS.fontSize.body}px`, color: C.textSecondary }}>
                {proj.highlights.map((h, i) => <li key={i} style={{ lineHeight: 1.5 }}>{getText(h, language)}</li>)}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderCampusActivities = () => {
    if (data.campusActivities.length === 0) return null;
    return (
      <div>
        <SectionHead title={language === "zh" ? "校园经历" : "Campus Activities"} />
        {data.campusActivities.map((act) => (
          <div key={act.id} style={{ marginBottom: "5px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontWeight: 700, fontSize: `${TOKENS.fontSize.itemTitle}px` }}>{getText(act.organization, language)}<span style={{ fontWeight: 400 }}> · {getText(act.role, language)}</span></span>
              <span style={{ fontSize: `${TOKENS.fontSize.body}px`, color: C.textMuted, flexShrink: 0 }}>{act.period}</span>
            </div>
            {getText(act.description, language) && (
              <div style={{ fontSize: `${TOKENS.fontSize.body}px`, color: C.textSecondary, lineHeight: 1.5, marginTop: "2px" }}>{getText(act.description, language)}</div>
            )}
            {act.highlights && act.highlights.length > 0 && (
              <ul style={{ margin: `${TOKENS.spacing.listTop}px 0 0 0`, paddingLeft: "14px", fontSize: `${TOKENS.fontSize.body}px`, color: C.textSecondary }}>
                {act.highlights.map((h, i) => <li key={i} style={{ lineHeight: 1.5 }}>{getText(h, language)}</li>)}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderSkills = () => {
    if (data.skills.length === 0) return null;
    return (
      <div>
        <SectionHead title={language === "zh" ? "技能特长" : "Skills"} />
        {data.skills.map((cat) => (
          <div key={cat.id} style={{ marginBottom: "3px", fontSize: `${TOKENS.fontSize.body}px` }}>
            <span style={{ fontWeight: 600 }}>{getText(cat.category, language)}：</span>
            <span style={{ color: C.textSecondary }}>{cat.items.join(" | ")}</span>
          </div>
        ))}
      </div>
    );
  };

  const sectionRenderers: Record<SectionKey, () => React.ReactNode> = {
    personalInfo: renderPersonalInfo,
    education: renderEducation,
    researchExperience: renderResearchExperience,
    honors: renderHonors,
    experience: renderExperience,
    projects: renderProjects,
    campusActivities: renderCampusActivities,
    skills: renderSkills,
  };

  return (
    <div style={{ padding: `${TOKENS.page.padding.classic.top}px ${TOKENS.page.padding.classic.right}px ${TOKENS.page.padding.classic.bottom}px ${TOKENS.page.padding.classic.left}px`, fontFamily: "system-ui, -apple-system, 'PingFang SC', 'Microsoft YaHei', sans-serif", lineHeight: 1.5, color: C.text, background: "#ffffff" }}>
      {visibleSections.map((key) => (
        <div key={key}>{sectionRenderers[key]?.()}</div>
      ))}
    </div>
  );
}
