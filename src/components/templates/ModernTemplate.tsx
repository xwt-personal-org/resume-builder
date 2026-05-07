"use client";

import type { ResumeData, SectionKey, SectionEmphasis } from "@/types";
import { RESUME_TOKENS } from "@/lib/templates/designTokens";
import { normalizeSectionOrder } from "@/lib/resume/sectionOrder";

interface TemplateProps {
  data: ResumeData;
  sectionOrder: SectionKey[];
  emphasis: Partial<Record<SectionKey, SectionEmphasis>>;
  language: "zh" | "en";
}

const TOKENS = RESUME_TOKENS;
const C = RESUME_TOKENS.colors;
const SIDEBAR_BG = C.modernSidebar;
const SIDEBAR_TEXT = C.modernSidebarText;
const SIDEBAR_TEXT_LIGHT = C.modernSidebarMuted;
const SIDEBAR_ACCENT = C.accentBlue;
const MAIN_TEXT = C.text;
const MAIN_TEXT_SECONDARY = C.textSecondary;
const MAIN_TEXT_MUTED = C.textMuted;
const MAIN_BORDER = C.lineSubtle;
const SECTION_LINE = C.accentBlue;

const SECTION_LABELS: Record<SectionKey, { zh: string; en: string }> = {
  personalInfo: { zh: "基本信息", en: "Personal Info" },
  education: { zh: "教育背景", en: "Education" },
  researchExperience: { zh: "科研经历", en: "Research Experience" },
  honors: { zh: "荣誉奖项", en: "Honors & Awards" },
  experience: { zh: "实习经历", en: "Internship" },
  projects: { zh: "项目经历", en: "Projects" },
  campusActivities: { zh: "校园经历", en: "Campus Activities" },
  skills: { zh: "技能特长", en: "Skills" },
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

export function ModernTemplate({
  data,
  sectionOrder,
  emphasis,
  language,
}: TemplateProps) {
  const getText = (b: { zh: string; en: string } | undefined | null) => {
    if (!b) return "";
    return language === "zh" ? b.zh || b.en : b.en || b.zh;
  };
  const normalizedSectionOrder = normalizeSectionOrder(sectionOrder);

  const renderSidebarPersonalInfo = () => {
    const info = data.personalInfo;
    const name = getText(info.name);
    if (!name && !info.email) return null;

    return (
      <div>
        <div style={{ margin: "0 auto 10px", display: "flex", justifyContent: "center" }}>
          <PhotoSlot src={info.avatarUrl} language={language} width={TOKENS.photo.modern.width} height={TOKENS.photo.modern.height} />
        </div>
        <div
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: SIDEBAR_TEXT,
            textAlign: "center",
            lineHeight: 1.3,
          }}
        >
          {name}
        </div>
        {getText(info.title) && (
          <div
            style={{
              fontSize: "11px",
              color: SIDEBAR_TEXT_LIGHT,
              textAlign: "center",
              marginTop: "3px",
            }}
          >
            {getText(info.title)}
          </div>
        )}
        <div
          style={{
            height: "1px",
            background: "rgba(255,255,255,0.2)",
            margin: "10px 0",
          }}
        />
        <div
          style={{
            fontSize: "10px",
            color: SIDEBAR_TEXT_LIGHT,
            lineHeight: 1.8,
          }}
        >
          {[info.gender, info.birthDate, info.politicalStatus]
            .filter(Boolean)
            .map((v) => v)
            .length > 0 && (
            <div>
              {[info.gender, info.birthDate, info.politicalStatus]
                .filter(Boolean)
                .join(" · ")}
            </div>
          )}
          {info.phone && <div>📱 {info.phone}</div>}
          {info.email && <div>✉ {info.email}</div>}
          {getText(info.location) && <div>📍 {getText(info.location)}</div>}
          {info.website && <div>🔗 {info.website}</div>}
        </div>
      </div>
    );
  };

  const renderMainSectionHeader = (sectionKey: SectionKey) => (
    <div
      style={{
        fontSize: `${TOKENS.fontSize.sectionTitle}px`,
        fontWeight: 700,
        color: MAIN_TEXT,
        marginBottom: `${TOKENS.spacing.sectionTitleBottom}px`,
        paddingBottom: "3px",
        borderBottom: `${TOKENS.line.sectionStrongPx}px solid ${SECTION_LINE}`,
        display: "flex",
        alignItems: "center",
        gap: "6px",
      }}
    >
      {getText(SECTION_LABELS[sectionKey])}
    </div>
  );

  const renderSkills = () => {
    if (data.skills.length === 0) return null;
    return (
      <div style={{ marginBottom: "12px" }}>
        {renderMainSectionHeader("skills")}
        {data.skills.map((cat) => (
          <div key={cat.id} style={{ marginBottom: "5px", fontSize: `${TOKENS.fontSize.body}px`, lineHeight: 1.6 }}>
            <span style={{ fontWeight: 600, color: MAIN_TEXT }}>{getText(cat.category)}</span>
            <span style={{ color: MAIN_TEXT_SECONDARY }}>: {cat.items.join(" | ")}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderEducation = () => {
    if (data.education.length === 0) return null;
    return (
      <div style={{ marginBottom: "12px" }}>
        {renderMainSectionHeader("education")}
        {data.education.map((edu) => {
          const parts = [getText(edu.school)];
          if (getText(edu.degree)) parts.push(getText(edu.degree));
          if (getText(edu.major)) parts.push(getText(edu.major));
          return (
            <div
              key={edu.id}
              style={{ marginBottom: "8px" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 600,
                      color: MAIN_TEXT,
                    }}
                  >
                    {parts.join(" · ")}
                  </span>
                  {edu.gpa && (
                    <span
                      style={{
                        fontSize: "10px",
                        color: SIDEBAR_ACCENT,
                        fontWeight: 600,
                        marginLeft: "8px",
                      }}
                    >
                      GPA: {edu.gpa}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    color: MAIN_TEXT_MUTED,
                    flexShrink: 0,
                  }}
                >
                  {edu.period}
                </div>
              </div>
              {edu.courses && edu.courses.length > 0 && (
                <div
                  style={{
                    fontSize: "9px",
                    color: MAIN_TEXT_SECONDARY,
                    marginTop: "3px",
                  }}
                >
                  {edu.courses.join(" · ")}
                </div>
              )}
              {getText(edu.description) && (
                <div
                  style={{
                    fontSize: `${TOKENS.fontSize.meta}px`,
                    color: MAIN_TEXT_SECONDARY,
                    marginTop: `${TOKENS.spacing.paragraphTop}px`,
                    lineHeight: 1.6,
                  }}
                >
                  {getText(edu.description)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderResearchExperience = () => {
    if (!data.researchExperience || data.researchExperience.length === 0) return null;
    return (
      <div style={{ marginBottom: "12px" }}>
        {renderMainSectionHeader("researchExperience")}
        {data.researchExperience.map((item, idx) => (
          <div
            key={item.id}
            style={{
              marginBottom: idx < data.researchExperience.length - 1 ? "8px" : 0,
              paddingBottom: idx < data.researchExperience.length - 1 ? "8px" : 0,
              borderBottom:
                idx < data.researchExperience.length - 1
                  ? `1px solid ${MAIN_BORDER}`
                  : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <div>
                <span
                  style={{ fontWeight: 600, fontSize: "11px", color: MAIN_TEXT }}
                >
                  {getText(item.project) || getText(item.institution)}
                </span>
                {getText(item.role) && (
                  <span
                    style={{
                      fontSize: "11px",
                      color: MAIN_TEXT_SECONDARY,
                      fontWeight: 400,
                    }}
                  >
                    {" · "}
                    {getText(item.role)}
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: "10px",
                  color: MAIN_TEXT_MUTED,
                  flexShrink: 0,
                }}
              >
                {item.period}
              </span>
            </div>
            <div style={{ fontSize: "10px", color: MAIN_TEXT_MUTED, marginTop: "1px" }}>
              {getText(item.institution)}
            </div>
            {getText(item.description) && (
              <div style={{ fontSize: "10.5px", color: MAIN_TEXT_SECONDARY, lineHeight: 1.6, marginTop: "2px" }}>
                {getText(item.description)}
              </div>
            )}
            {item.highlights && item.highlights.length > 0 && (
              <ul
                style={{
                  margin: "3px 0 0 0",
                  paddingLeft: "14px",
                  fontSize: "10.5px",
                  color: MAIN_TEXT_SECONDARY,
                  lineHeight: 1.6,
                }}
              >
                {item.highlights.map((h, i) => (
                  <li key={i}>{getText(h)}</li>
                ))}
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
      <div style={{ marginBottom: "12px" }}>
        {renderMainSectionHeader("honors")}
        {data.honors.map((honor) => {
          return (
            <div key={honor.id} style={{ marginBottom: "4px", fontSize: `${TOKENS.fontSize.body}px` }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontWeight: 600, color: MAIN_TEXT }}>
                    {getText(honor.title)}
                  </span>
                  {honor.level && (
                    <span
                      style={{
                        fontSize: "9px",
                        color: MAIN_TEXT_MUTED,
                        fontWeight: 600,
                        flexShrink: 0,
                      }}
                    >
                      [{honor.level}]
                    </span>
                  )}
                </div>
                <span
                  style={{
                    fontSize: "10px",
                    color: MAIN_TEXT_MUTED,
                    flexShrink: 0,
                  }}
                >
                  {honor.period}
                </span>
              </div>
              {getText(honor.description) && (
                <div style={{ fontSize: `${TOKENS.fontSize.meta}px`, color: MAIN_TEXT_SECONDARY, lineHeight: 1.6, marginTop: `${TOKENS.spacing.paragraphTop}px` }}>
                  {getText(honor.description)}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderExperience = () => {
    if (data.experience.length === 0) return null;
    return (
      <div style={{ marginBottom: "12px" }}>
        {renderMainSectionHeader("experience")}
        {data.experience.map((exp, idx) => (
          <div
            key={exp.id}
            style={{
              marginBottom: idx < data.experience.length - 1 ? "8px" : 0,
              paddingBottom: idx < data.experience.length - 1 ? "8px" : 0,
              borderBottom:
                idx < data.experience.length - 1
                  ? `1px solid ${MAIN_BORDER}`
                  : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <div>
                <span
                  style={{ fontWeight: 600, fontSize: "11px", color: MAIN_TEXT }}
                >
                  {getText(exp.company)}
                </span>
                {getText(exp.role) && (
                  <span
                    style={{
                      fontSize: "11px",
                      color: MAIN_TEXT_SECONDARY,
                      fontWeight: 400,
                    }}
                  >
                    {" · "}
                    {getText(exp.role)}
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: "10px",
                  color: MAIN_TEXT_MUTED,
                  flexShrink: 0,
                }}
              >
                {exp.period}
              </span>
            </div>
            {getText(exp.description) && (
              <div style={{ fontSize: "10.5px", color: MAIN_TEXT_SECONDARY, lineHeight: 1.6, marginTop: "2px" }}>
                {getText(exp.description)}
              </div>
            )}
            {exp.highlights && exp.highlights.length > 0 && (
              <ul
                style={{
                  margin: "3px 0 0 0",
                  paddingLeft: "14px",
                  fontSize: "10.5px",
                  color: MAIN_TEXT_SECONDARY,
                  lineHeight: 1.6,
                }}
              >
                {exp.highlights.map((h, i) => (
                  <li key={i}>{getText(h)}</li>
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
      <div style={{ marginBottom: "12px" }}>
        {renderMainSectionHeader("projects")}
        {data.projects.map((proj, idx) => (
          <div
            key={proj.id}
            style={{
              marginBottom: idx < data.projects.length - 1 ? "8px" : 0,
              paddingBottom: idx < data.projects.length - 1 ? "8px" : 0,
              borderBottom:
                idx < data.projects.length - 1
                  ? `1px solid ${MAIN_BORDER}`
                  : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <div>
                <span
                  style={{ fontWeight: 600, fontSize: "11px", color: MAIN_TEXT }}
                >
                  {getText(proj.name)}
                </span>
                {getText(proj.role) && (
                  <span
                    style={{
                      fontSize: "11px",
                      color: MAIN_TEXT_SECONDARY,
                      fontWeight: 400,
                    }}
                  >
                    {" · "}
                    {getText(proj.role)}
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: "10px",
                  color: MAIN_TEXT_MUTED,
                  flexShrink: 0,
                }}
              >
                {proj.period}
              </span>
            </div>
            {proj.link && (
              <div style={{ fontSize: "10px", color: MAIN_TEXT_MUTED, marginTop: "1px" }}>
                {proj.link}
              </div>
            )}
            {proj.tech && proj.tech.length > 0 && (
              <div
                style={{
                  fontSize: "9px",
                  color: MAIN_TEXT_SECONDARY,
                  marginTop: "3px",
                }}
              >
                {proj.tech.join(" · ")}
              </div>
            )}
            {getText(proj.description) && (
              <div style={{ fontSize: "10.5px", color: MAIN_TEXT_SECONDARY, lineHeight: 1.6, marginTop: "2px" }}>
                {getText(proj.description)}
              </div>
            )}
            {proj.highlights && proj.highlights.length > 0 && (
              <ul
                style={{
                  margin: "3px 0 0 0",
                  paddingLeft: "14px",
                  fontSize: "10.5px",
                  color: MAIN_TEXT_SECONDARY,
                  lineHeight: 1.6,
                }}
              >
                {proj.highlights.map((h, i) => (
                  <li key={i}>{getText(h)}</li>
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
      <div style={{ marginBottom: "12px" }}>
        {renderMainSectionHeader("campusActivities")}
        {data.campusActivities.map((act, idx) => (
          <div
            key={act.id}
            style={{
              marginBottom: idx < data.campusActivities.length - 1 ? "8px" : 0,
              paddingBottom: idx < data.campusActivities.length - 1 ? "8px" : 0,
              borderBottom:
                idx < data.campusActivities.length - 1
                  ? `1px solid ${MAIN_BORDER}`
                  : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
              }}
            >
              <div>
                <span
                  style={{ fontWeight: 600, fontSize: "11px", color: MAIN_TEXT }}
                >
                  {getText(act.organization)}
                </span>
                {getText(act.role) && (
                  <span
                    style={{
                      fontSize: "11px",
                      color: MAIN_TEXT_SECONDARY,
                      fontWeight: 400,
                    }}
                  >
                    {" · "}
                    {getText(act.role)}
                  </span>
                )}
              </div>
              <span
                style={{
                  fontSize: "10px",
                  color: MAIN_TEXT_MUTED,
                  flexShrink: 0,
                }}
              >
                {act.period}
              </span>
            </div>
            {getText(act.description) && (
              <div style={{ fontSize: "10.5px", color: MAIN_TEXT_SECONDARY, lineHeight: 1.6, marginTop: "2px" }}>
                {getText(act.description)}
              </div>
            )}
            {act.highlights && act.highlights.length > 0 && (
              <ul
                style={{
                  margin: "3px 0 0 0",
                  paddingLeft: "14px",
                  fontSize: "10.5px",
                  color: MAIN_TEXT_SECONDARY,
                  lineHeight: 1.6,
                }}
              >
                {act.highlights.map((h, i) => (
                  <li key={i}>{getText(h)}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    );
  };

  const mainSections: SectionKey[] = [
    "education",
    "researchExperience",
    "honors",
    "experience",
    "projects",
    "campusActivities",
    "skills",
  ];

  const sidebarRenderers: Record<string, () => React.ReactNode> = {
    personalInfo: renderSidebarPersonalInfo,
  };

  const mainRenderers: Record<string, () => React.ReactNode> = {
    education: renderEducation,
    researchExperience: renderResearchExperience,
    honors: renderHonors,
    experience: renderExperience,
    projects: renderProjects,
    campusActivities: renderCampusActivities,
    skills: renderSkills,
  };

  const visibleSidebarSections: SectionKey[] = ["personalInfo"];
  const visibleMainSections = normalizedSectionOrder.filter(
    (key) =>
      mainSections.includes(key) &&
      emphasis[key] !== "hidden"
  );

  return (
    <div
      style={{
        width: `${TOKENS.page.widthPx}px`,
        minHeight: `${TOKENS.page.minHeightPx}px`,
        fontFamily: "system-ui, -apple-system, sans-serif",
        lineHeight: 1.5,
        display: "flex",
        color: MAIN_TEXT,
        background: "#ffffff",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          width: "30%",
          background: SIDEBAR_BG,
          color: SIDEBAR_TEXT,
          padding: "24px 16px",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {visibleSidebarSections.map((key) => (
          <div key={key}>{sidebarRenderers[key]?.()}</div>
        ))}
      </div>
      <div
        style={{
          width: "70%",
          padding: `${TOKENS.page.padding.modern.top}px ${TOKENS.page.padding.modern.right}px ${TOKENS.page.padding.modern.bottom}px ${TOKENS.page.padding.modern.left}px`,
        }}
      >
        {visibleMainSections.map((key) => (
          <div key={key}>{mainRenderers[key]?.()}</div>
        ))}
      </div>
    </div>
  );
}
