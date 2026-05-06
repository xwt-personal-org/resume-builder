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

export function CompactTemplate({ data, sectionOrder, emphasis, language }: TemplateProps) {
  const getText = (b: { zh: string; en: string } | undefined | null) =>
    language === "zh" ? (b?.zh || b?.en || "") : (b?.en || b?.zh || "");

  const sectionLabel: Record<SectionKey, string> = {
    personalInfo: "",
    education: language === "zh" ? "教育背景" : "Education",
    honors: language === "zh" ? "荣誉奖项" : "Honors",
    experience: language === "zh" ? "实习经历" : "Experience",
    projects: language === "zh" ? "项目经历" : "Projects",
    campusActivities: language === "zh" ? "校园经历" : "Campus Activities",
    skills: language === "zh" ? "技能特长" : "Skills",
  };

  const renderSectionHeader = (label: string) => (
    <div
      style={{
        borderLeft: `${TOKENS.line.sectionStrongPx}px solid ${C.accentBlue}`,
        paddingLeft: "8px",
        marginTop: `${TOKENS.spacing.sectionTop - 4}px`,
        marginBottom: "4px",
        fontSize: `${TOKENS.fontSize.sectionTitle - 2}px`,
        fontWeight: 700,
        color: C.text,
        lineHeight: 1.3,
      }}
    >
      {label}
    </div>
  );

  const renderPersonalInfo = () => {
    const info = data.personalInfo;
    const name = getText(info.name);
    if (!name && !info.email) return null;

    const title = getText(info.title);

    const contactParts: string[] = [];
    if (info.gender) contactParts.push(info.gender);
    if (info.birthDate) contactParts.push(info.birthDate);
    if (info.politicalStatus) contactParts.push(info.politicalStatus);
    if (info.phone) contactParts.push(info.phone);
    if (info.email) contactParts.push(info.email);
    if (getText(info.location)) contactParts.push(getText(info.location));
    if (info.website) contactParts.push(info.website);

    return (
      <div style={{ marginBottom: "6px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
          <span style={{ fontSize: "18px", fontWeight: 700, color: C.text, lineHeight: 1.3 }}>{name}</span>
          {title && <span style={{ fontSize: "12px", fontWeight: 400, color: C.textSecondary }}>{title}</span>}
        </div>
        {contactParts.length > 0 && (
          <div style={{ fontSize: "10px", color: C.textSecondary, marginTop: "2px", lineHeight: 1.4 }}>
            {contactParts.join(" | ")}
          </div>
        )}
        {getText(info.summary) && (
          <div style={{ fontSize: "10px", fontStyle: "italic", color: C.textMuted, marginTop: "3px", lineHeight: 1.45 }}>
            {getText(info.summary)}
          </div>
        )}
      </div>
    );
  };

  const renderEducation = () => {
    if (data.education.length === 0) return null;
    return (
      <div style={{ marginBottom: "4px" }}>
        {renderSectionHeader(sectionLabel.education)}
        {data.education.map((edu) => {
          const parts: string[] = [];
          if (getText(edu.school)) parts.push(getText(edu.school));
          if (getText(edu.degree)) parts.push(getText(edu.degree));
          if (getText(edu.major)) parts.push(getText(edu.major));

          return (
            <div key={edu.id} style={{ marginBottom: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontWeight: 600, fontSize: "10.5px", color: C.text }}>
                  {parts.join(" · ")}
                </span>
                <span style={{ fontSize: "10px", color: C.textMuted, flexShrink: 0 }}>{edu.period}</span>
              </div>
              {(edu.gpa || (edu.courses && edu.courses.length > 0)) && (
                <div style={{ fontSize: "10px", color: C.textSecondary, lineHeight: 1.4, marginTop: "1px" }}>
                  {edu.gpa && <span>GPA: {edu.gpa}</span>}
                  {edu.gpa && edu.courses && edu.courses.length > 0 && <span> | </span>}
                  {edu.courses && edu.courses.length > 0 && <span>{language === "zh" ? "核心课程" : "Core"}: {edu.courses.join(", ")}</span>}
                </div>
              )}
              {getText(edu.description) && (
                <div style={{ fontSize: "10px", color: C.textSecondary, lineHeight: 1.4, marginTop: "1px" }}>
                  {getText(edu.description)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderHonors = () => {
    if (data.honors.length === 0) return null;

    const shortHonors = data.honors.every(
      (h) => getText(h.title).length <= 12 && !getText(h.description)
    );

    return (
      <div style={{ marginBottom: "8px" }}>
        {renderSectionHeader(sectionLabel.honors)}
        {shortHonors ? (
          <div style={{ fontSize: "10.5px", color: C.text, lineHeight: 1.5 }}>
            {data.honors.map((h, i) => {
              const text = getText(h.title) + (h.level ? `[${h.level}]` : "");
              return (
                <span key={h.id}>
                  {text}
                  {i < data.honors.length - 1 ? " · " : ""}
                </span>
              );
            })}
          </div>
        ) : (
          data.honors.map((h) => (
            <div key={h.id} style={{ marginBottom: "2px", fontSize: "10.5px", lineHeight: 1.45 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontWeight: 600, color: C.text }}>
                  {getText(h.title)}{h.level ? ` [${h.level}]` : ""}
                </span>
                {h.period && <span style={{ fontSize: "10px", color: C.textMuted }}>{h.period}</span>}
              </div>
              {getText(h.description) && (
                <div style={{ fontSize: "10px", color: C.textSecondary }}>{getText(h.description)}</div>
              )}
            </div>
          ))
        )}
      </div>
    );
  };

  const renderExperience = () => {
    if (data.experience.length === 0) return null;
    return (
      <div style={{ marginBottom: "8px" }}>
        {renderSectionHeader(sectionLabel.experience)}
        {data.experience.map((exp) => (
          <div key={exp.id} style={{ marginBottom: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontWeight: 600, fontSize: "10.5px", color: C.text }}>
                {getText(exp.company)} · {getText(exp.role)}
              </span>
              <span style={{ fontSize: "10px", color: C.textMuted, flexShrink: 0 }}>{exp.period}</span>
            </div>
            {getText(exp.description) && (
              <div style={{ fontSize: "10px", color: C.textSecondary, lineHeight: 1.45, marginTop: "1px" }}>
                {getText(exp.description)}
              </div>
            )}
            {exp.highlights && exp.highlights.length > 0 && (
              <ul style={{ margin: "1px 0 0 0", paddingLeft: "14px", fontSize: "10.5px", color: C.textSecondary }}>
                {exp.highlights.map((h, i) => (
                  <li key={i} style={{ lineHeight: 1.45 }}>{getText(h)}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderProjects = () => {
    if (data.projects.length === 0) return null;
    return (
      <div style={{ marginBottom: "8px" }}>
        {renderSectionHeader(sectionLabel.projects)}
        {data.projects.map((proj) => (
          <div key={proj.id} style={{ marginBottom: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontWeight: 600, fontSize: "10.5px", color: C.text }}>
                {getText(proj.name)}{getText(proj.role) ? ` · ${getText(proj.role)}` : ""}
              </span>
              <span style={{ fontSize: "10px", color: C.textMuted, flexShrink: 0 }}>{proj.period}</span>
            </div>
            {proj.tech && proj.tech.length > 0 && (
              <div style={{ fontSize: "9.5px", color: C.textMuted, lineHeight: 1.4 }}>
                {language === "zh" ? "技术" : "Tech"}: {proj.tech.join(", ")}
              </div>
            )}
            {proj.link && (
              <div style={{ fontSize: "9px", color: C.textMuted, marginTop: "1px" }}>
                {proj.link}
              </div>
            )}
            {getText(proj.description) ? (
              <div style={{ fontSize: "10.5px", color: C.textSecondary, lineHeight: 1.45 }}>
                {getText(proj.description)}
              </div>
            ) : null}
            {proj.highlights && proj.highlights.length > 0 && (
              <ul style={{ margin: "1px 0 0 0", paddingLeft: "14px", fontSize: "10.5px", color: C.textSecondary }}>
                {proj.highlights.map((h, i) => (
                  <li key={i} style={{ lineHeight: 1.45 }}>{getText(h)}</li>
                ))}
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
      <div style={{ marginBottom: "8px" }}>
        {renderSectionHeader(sectionLabel.campusActivities)}
        {data.campusActivities.map((act) => (
          <div key={act.id} style={{ marginBottom: "4px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontWeight: 600, fontSize: "10.5px", color: C.text }}>
                {getText(act.organization)} · {getText(act.role)}
              </span>
              <span style={{ fontSize: "10px", color: C.textMuted, flexShrink: 0 }}>{act.period}</span>
            </div>
            {getText(act.description) && (
              <div style={{ fontSize: "10.5px", color: C.textSecondary, lineHeight: 1.45 }}>
                {getText(act.description)}
              </div>
            )}
            {act.highlights && act.highlights.length > 0 ? (
              <ul style={{ margin: "1px 0 0 0", paddingLeft: "14px", fontSize: "10.5px", color: C.textSecondary }}>
                {act.highlights.map((h, i) => (
                  <li key={i} style={{ lineHeight: 1.45 }}>{getText(h)}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </div>
    );
  };

  const renderSkills = () => {
    if (data.skills.length === 0) return null;
    return (
      <div style={{ marginBottom: "4px" }}>
        {renderSectionHeader(sectionLabel.skills)}
        <div style={{ fontSize: "10.5px", color: C.text, lineHeight: 1.6 }}>
          {data.skills.map((cat) => (
            <div key={cat.id} style={{ marginBottom: "1px" }}>
              <span style={{ fontWeight: 600 }}>{getText(cat.category)}</span>
              <span style={{ color: C.textSecondary }}>: {cat.items.join(", ")}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const sectionRenderers: Record<SectionKey, () => React.ReactNode> = {
    personalInfo: renderPersonalInfo,
    education: renderEducation,
    honors: renderHonors,
    experience: renderExperience,
    projects: renderProjects,
    campusActivities: renderCampusActivities,
    skills: renderSkills,
  };

  const visibleSections = sectionOrder.filter(
    (key) => key === "personalInfo" || emphasis[key] !== "hidden"
  );

  return (
    <div
      style={{
        padding: `${TOKENS.page.padding.compact.top}px ${TOKENS.page.padding.compact.right}px ${TOKENS.page.padding.compact.bottom}px ${TOKENS.page.padding.compact.left}px`,
        fontFamily: "system-ui, -apple-system, sans-serif",
        lineHeight: 1.45,
        color: C.text,
        background: "#ffffff",
      }}
    >
      {visibleSections.map((key) => (
        <div key={key}>{sectionRenderers[key]?.()}</div>
      ))}
    </div>
  );
}
