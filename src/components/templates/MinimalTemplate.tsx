"use client";

import type { ResumeData, SectionKey, SectionEmphasis } from "@/types";
import { RESUME_TEMPLATE_ROOT_STYLE, RESUME_TOKENS } from "@/lib/templates/designTokens";
import { normalizeSectionOrder } from "@/lib/resume/sectionOrder";

interface TemplateProps {
  data: ResumeData;
  sectionOrder: SectionKey[];
  emphasis: Partial<Record<SectionKey, SectionEmphasis>>;
  language: "zh" | "en";
}

const TOKENS = RESUME_TOKENS;
const C = {
  text: TOKENS.colors.text,
  secondary: TOKENS.colors.textSecondary,
  muted: TOKENS.colors.textMuted,
  line: TOKENS.colors.line,
  bg: "#fff",
};

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

export function MinimalTemplate({ data, sectionOrder, emphasis, language }: TemplateProps) {
  const getText = (b: { zh: string; en: string } | undefined | null) =>
    language === "zh" ? (b?.zh || b?.en || "") : (b?.en || b?.zh || "");

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

  const normalizedSectionOrder = normalizeSectionOrder(sectionOrder);
  const visibleSections = normalizedSectionOrder.filter(
    (key) => key === "personalInfo" || emphasis[key] !== "hidden"
  );

  function SectionHeader({ label }: { label: string }) {
    return (
      <div style={{ marginTop: TOKENS.spacing.sectionTop }}>
        <div
          style={{
            height: `${TOKENS.line.sectionNormalPx}px`,
            background: C.line,
            marginBottom: TOKENS.spacing.sectionTitleBottom,
          }}
        />
        <div
          style={{
            fontSize: TOKENS.fontSize.sectionTitle,
            fontWeight: 700,
            color: C.text,
            letterSpacing: 0,
          }}
        >
          {label}
        </div>
      </div>
    );
  }

  function renderPersonalInfo() {
    const info = data.personalInfo;
    const name = getText(info.name);
    if (!name) return null;
    const title = getText(info.title);

    const identityParts: string[] = [];
    if (info.gender) identityParts.push(info.gender);
    if (info.birthDate) identityParts.push(info.birthDate);
    if (info.politicalStatus) identityParts.push(info.politicalStatus);
    const identity = identityParts.join(" · ");

    const contactParts: string[] = [];
    if (identity) contactParts.push(identity);
    if (info.phone) contactParts.push(info.phone);
    if (info.email) contactParts.push(info.email);
    if (getText(info.location)) contactParts.push(getText(info.location));
    if (info.website) contactParts.push(info.website);

    return (
      <div style={{ marginBottom: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: C.text,
                  lineHeight: 1.3,
                }}
              >
                {name}
              </span>
              {title && (
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 400,
                    color: C.secondary,
                  }}
                >
                  {title}
                </span>
              )}
            </div>
            {contactParts.length > 0 && (
              <div
                style={{
                  fontSize: 10,
                  color: C.secondary,
                  marginTop: 3,
                  lineHeight: 1.5,
                }}
              >
                {contactParts.join(" | ")}
              </div>
            )}
            {getText(info.summary) && (
              <div
                style={{
                  fontSize: 10,
                  color: C.muted,
                  marginTop: 4,
                  lineHeight: 1.6,
                }}
              >
                {getText(info.summary)}
              </div>
            )}
          </div>
          <PhotoSlot src={info.avatarUrl} language={language} width={TOKENS.photo.minimal.width} height={TOKENS.photo.minimal.height} />
        </div>
      </div>
    );
  }

  function renderEducation() {
    if (data.education.length === 0) return null;
    return (
      <div>
        <SectionHeader label={language === "zh" ? "教育背景" : "Education"} />
        {data.education.map((edu) => {
          const school = getText(edu.school);
          const degree = getText(edu.degree);
          const major = getText(edu.major);
          const parts: string[] = [];
          if (degree) parts.push(degree);
          if (major) parts.push(major);
          const degreeMajor = parts.join(" · ");

          const details: string[] = [];
          if (edu.gpa) details.push(`GPA: ${edu.gpa}`);
          if (edu.courses && edu.courses.length > 0)
            details.push(
              `${language === "zh" ? "课程" : "Courses"}: ${edu.courses.join(", ")}`
            );

          return (
            <div key={edu.id} style={{ marginTop: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <div style={{ fontSize: 11, color: C.text }}>
                  <span style={{ fontWeight: 600 }}>{school}</span>
                  {degreeMajor && (
                    <span style={{ fontWeight: 400, color: C.secondary }}> · {degreeMajor}</span>
                  )}
                </div>
                <span style={{ fontSize: 10, color: C.muted, flexShrink: 0, marginLeft: 8 }}>
                  {edu.period}
                </span>
              </div>
              {details.length > 0 && (
                <div style={{ fontSize: 10, color: C.muted, marginTop: 1, lineHeight: 1.5 }}>
                  {details.join("; ")}
                </div>
              )}
              {getText(edu.description) && (
                <div style={{ fontSize: 10, color: C.muted, marginTop: TOKENS.spacing.paragraphTop, lineHeight: 1.5 }}>
                  {getText(edu.description)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  function renderResearchExperience() {
    if (!data.researchExperience || data.researchExperience.length === 0) return null;
    return (
      <div>
        <SectionHeader label={language === "zh" ? "科研经历" : "Research Experience"} />
        {data.researchExperience.map((item) => {
          const project = getText(item.project) || getText(item.institution);
          const role = getText(item.role);
          return (
            <div key={item.id} style={{ marginTop: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: 11, color: C.text }}>
                  <span style={{ fontWeight: 600 }}>{project}</span>
                  {role && (
                    <span style={{ fontWeight: 400, color: C.secondary }}> · {role}</span>
                  )}
                </span>
                <span style={{ fontSize: 10, color: C.muted, flexShrink: 0, marginLeft: 8 }}>
                  {item.period}
                </span>
              </div>
              {getText(item.description) && (
                <div style={{ fontSize: 10, color: C.muted, marginTop: 2, lineHeight: 1.6 }}>
                  {getText(item.description)}
                </div>
              )}
              {item.highlights && item.highlights.length > 0 && (
                <ul
                  style={{
                    margin: "2px 0 0 0",
                    paddingLeft: 14,
                    fontSize: 10,
                    color: C.muted,
                    lineHeight: 1.6,
                  }}
                >
                  {item.highlights.map((h, i) => (
                    <li key={i}>{getText(h)}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  function renderHonors() {
    if (data.honors.length === 0) return null;
    return (
      <div>
        <SectionHeader label={language === "zh" ? "荣誉奖项" : "Honors & Awards"} />
        {data.honors.map((honor) => {
          const title = getText(honor.title);
          const level = honor.level;
          const desc = getText(honor.description);
          return (
            <div key={honor.id} style={{ marginTop: 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: 11, color: C.text }}>
                  {title}
                  {level && (
                    <span style={{ color: C.muted, fontSize: 10 }}> [{level}]</span>
                  )}
                </span>
                <span style={{ fontSize: 10, color: C.muted, flexShrink: 0, marginLeft: 8 }}>
                  {honor.period}
                </span>
              </div>
              {desc && (
                <div style={{ fontSize: 10, color: C.muted, marginTop: 1, lineHeight: 1.5 }}>
                  {desc}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  function renderExperience() {
    if (data.experience.length === 0) return null;
    return (
      <div>
        <SectionHeader label={language === "zh" ? "实习经历" : "Experience"} />
        {data.experience.map((exp) => {
          const company = getText(exp.company);
          const role = getText(exp.role);
          return (
            <div key={exp.id} style={{ marginTop: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: 11, color: C.text }}>
                  <span style={{ fontWeight: 600 }}>{company}</span>
                  {role && (
                    <span style={{ fontWeight: 400, color: C.secondary }}> · {role}</span>
                  )}
                </span>
                <span style={{ fontSize: 10, color: C.muted, flexShrink: 0, marginLeft: 8 }}>
                  {exp.period}
                </span>
              </div>
              {getText(exp.description) && (
                <div style={{ fontSize: 10, color: C.muted, marginTop: 2, lineHeight: 1.6 }}>
                  {getText(exp.description)}
                </div>
              )}
              {exp.highlights && exp.highlights.length > 0 && (
                <ul
                  style={{
                    margin: "2px 0 0 0",
                    paddingLeft: 14,
                    fontSize: 10,
                    color: C.muted,
                    lineHeight: 1.6,
                  }}
                >
                  {exp.highlights.map((h, i) => (
                    <li key={i}>{getText(h)}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  function renderProjects() {
    if (data.projects.length === 0) return null;
    return (
      <div>
        <SectionHeader label={language === "zh" ? "项目经历" : "Projects"} />
        {data.projects.map((proj) => {
          const name = getText(proj.name);
          const role = getText(proj.role);
          return (
            <div key={proj.id} style={{ marginTop: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: 11, color: C.text }}>
                  <span style={{ fontWeight: 600 }}>{name}</span>
                  {role && (
                    <span style={{ fontWeight: 400, color: C.secondary }}> · {role}</span>
                  )}
                </span>
                <span style={{ fontSize: 10, color: C.muted, flexShrink: 0, marginLeft: 8 }}>
                  {proj.period}
                </span>
              </div>
              {proj.tech && proj.tech.length > 0 && (
                <div style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>
                  Tech: {proj.tech.join(", ")}
                </div>
              )}
              {proj.link && (
                <div style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>
                  {proj.link}
                </div>
              )}
              {getText(proj.description) && (
                <div style={{ fontSize: 10, color: C.muted, marginTop: 2, lineHeight: 1.6 }}>
                  {getText(proj.description)}
                </div>
              )}
              {proj.highlights && proj.highlights.length > 0 && (
                <ul
                  style={{
                    margin: "2px 0 0 0",
                    paddingLeft: 14,
                    fontSize: 10,
                    color: C.muted,
                    lineHeight: 1.6,
                  }}
                >
                  {proj.highlights.map((h, i) => (
                    <li key={i}>{getText(h)}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  function renderCampusActivities() {
    if (data.campusActivities.length === 0) return null;
    return (
      <div>
        <SectionHeader label={language === "zh" ? "校园经历" : "Campus Activities"} />
        {data.campusActivities.map((act) => {
          const org = getText(act.organization);
          const role = getText(act.role);
          return (
            <div key={act.id} style={{ marginTop: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontSize: 11, color: C.text }}>
                  <span style={{ fontWeight: 600 }}>{org}</span>
                  {role && (
                    <span style={{ fontWeight: 400, color: C.secondary }}> · {role}</span>
                  )}
                </span>
                <span style={{ fontSize: 10, color: C.muted, flexShrink: 0, marginLeft: 8 }}>
                  {act.period}
                </span>
              </div>
              {getText(act.description) && (
                <div style={{ fontSize: 10, color: C.muted, marginTop: 2, lineHeight: 1.6 }}>
                  {getText(act.description)}
                </div>
              )}
              {act.highlights && act.highlights.length > 0 && (
                <ul
                  style={{
                    margin: "2px 0 0 0",
                    paddingLeft: 14,
                    fontSize: 10,
                    color: C.muted,
                    lineHeight: 1.6,
                  }}
                >
                  {act.highlights.map((h, i) => (
                    <li key={i}>{getText(h)}</li>
                  ))}
                </ul>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  function renderSkills() {
    if (data.skills.length === 0) return null;
    return (
      <div>
        <SectionHeader label={language === "zh" ? "技能特长" : "Skills"} />
        {data.skills.map((cat) => (
          <div key={cat.id} style={{ marginTop: 4, fontSize: 11, lineHeight: 1.6 }}>
            <span style={{ fontWeight: 600, color: C.text }}>{getText(cat.category)}</span>
            <span style={{ fontWeight: 400, color: C.secondary }}>: {cat.items.join(" | ")}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      style={{
        ...RESUME_TEMPLATE_ROOT_STYLE,
        padding: `${TOKENS.page.padding.minimal.top}px ${TOKENS.page.padding.minimal.right}px ${TOKENS.page.padding.minimal.bottom}px ${TOKENS.page.padding.minimal.left}px`,
        fontFamily: TOKENS.fontFamily,
        lineHeight: 1.5,
        color: C.text,
        background: C.bg,
      }}
    >
      {visibleSections.map((key) => (
        <div key={key}>{sectionRenderers[key]?.()}</div>
      ))}
    </div>
  );
}
