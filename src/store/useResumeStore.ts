import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ResumeData, TemplateName, SectionKey, SectionEmphasis, Education, Honor, Experience, Project, CampusActivity, ResearchExperience, SkillCategory } from '@/types';
import { DEFAULT_RESUME_DATA, DEFAULT_SECTION_ORDER } from '@/types';
import { DEMO_RESUME_DATA } from '@/lib/demoData';
import { normalizeSectionOrder } from '@/lib/resume/sectionOrder';
import { v4 as uuidv4 } from 'uuid';

interface ResumeState {
  data: ResumeData;
  template: TemplateName;
  sectionOrder: SectionKey[];
  emphasis: Partial<Record<SectionKey, SectionEmphasis>>;
  activeLanguage: 'zh' | 'en';
  activeSection: SectionKey;

  setField: <K extends keyof ResumeData>(section: K, value: ResumeData[K]) => void;
  setPersonalInfo: (info: Partial<ResumeData['personalInfo']>) => void;

  addEducation: (edu?: Partial<ResumeData['education'][0]>) => void;
  updateEducation: (id: string, updates: Partial<ResumeData['education'][0]>) => void;
  removeEducation: (id: string) => void;

  addHonor: (honor?: Partial<ResumeData['honors'][0]>) => void;
  updateHonor: (id: string, updates: Partial<ResumeData['honors'][0]>) => void;
  removeHonor: (id: string) => void;

  addExperience: (exp?: Partial<ResumeData['experience'][0]>) => void;
  updateExperience: (id: string, updates: Partial<ResumeData['experience'][0]>) => void;
  removeExperience: (id: string) => void;

  addProject: (proj?: Partial<ResumeData['projects'][0]>) => void;
  updateProject: (id: string, updates: Partial<ResumeData['projects'][0]>) => void;
  removeProject: (id: string) => void;

  addCampusActivity: (act?: Partial<ResumeData['campusActivities'][0]>) => void;
  updateCampusActivity: (id: string, updates: Partial<ResumeData['campusActivities'][0]>) => void;
  removeCampusActivity: (id: string) => void;

  addResearchExperience: (item?: Partial<ResumeData['researchExperience'][0]>) => void;
  updateResearchExperience: (id: string, updates: Partial<ResumeData['researchExperience'][0]>) => void;
  removeResearchExperience: (id: string) => void;

  addSkillCategory: (cat?: Partial<ResumeData['skills'][0]>) => void;
  updateSkillCategory: (id: string, updates: Partial<ResumeData['skills'][0]>) => void;
  removeSkillCategory: (id: string) => void;

  setTemplate: (template: TemplateName) => void;
  setSectionOrder: (order: readonly unknown[]) => void;
  setEmphasis: (emphasis: Partial<Record<SectionKey, SectionEmphasis>>) => void;
  toggleSectionVisibility: (section: SectionKey) => void;
  setActiveLanguage: (lang: 'zh' | 'en') => void;
  setActiveSection: (section: SectionKey) => void;
  loadResumeData: (data: ResumeData) => void;
  loadDemoData: () => void;
  resetResumeData: () => void;
  applyAiPatch: (patch: Partial<ResumeData>) => void;
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set) => ({
      data: { ...DEMO_RESUME_DATA },
      template: 'classic',
      sectionOrder: normalizeSectionOrder(DEFAULT_SECTION_ORDER),
      emphasis: {},
      activeLanguage: 'zh',
      activeSection: 'personalInfo',

      setField: (section, value) =>
        set((state) => ({ data: { ...state.data, [section]: value } })),

      setPersonalInfo: (info) =>
        set((state) => ({
          data: { ...state.data, personalInfo: { ...state.data.personalInfo, ...info } },
        })),

      addEducation: (edu) =>
        set((state) => ({
          data: {
            ...state.data,
            education: [...state.data.education, {
              id: uuidv4(),
              school: edu?.school ?? { zh: '', en: '' },
              degree: edu?.degree ?? { zh: '', en: '' },
              major: edu?.major ?? { zh: '', en: '' },
              period: edu?.period ?? '',
              gpa: edu?.gpa ?? '',
              courses: edu?.courses ?? [],
              description: edu?.description ?? { zh: '', en: '' },
            }],
          },
        })),

      updateEducation: (id, updates) =>
        set((state) => ({
          data: { ...state.data, education: state.data.education.map((e) => e.id === id ? { ...e, ...updates } : e) },
        })),

      removeEducation: (id) =>
        set((state) => ({
          data: { ...state.data, education: state.data.education.filter((e) => e.id !== id) },
        })),

      addHonor: (honor) =>
        set((state) => ({
          data: {
            ...state.data,
            honors: [...state.data.honors, {
              id: uuidv4(),
              title: honor?.title ?? { zh: '', en: '' },
              level: honor?.level ?? '',
              period: honor?.period ?? '',
              description: honor?.description ?? { zh: '', en: '' },
            }],
          },
        })),

      updateHonor: (id, updates) =>
        set((state) => ({
          data: { ...state.data, honors: state.data.honors.map((h) => h.id === id ? { ...h, ...updates } : h) },
        })),

      removeHonor: (id) =>
        set((state) => ({
          data: { ...state.data, honors: state.data.honors.filter((h) => h.id !== id) },
        })),

      addExperience: (exp) =>
        set((state) => ({
          data: {
            ...state.data,
            experience: [...state.data.experience, {
              id: uuidv4(),
              company: exp?.company ?? { zh: '', en: '' },
              role: exp?.role ?? { zh: '', en: '' },
              period: exp?.period ?? '',
              description: exp?.description ?? { zh: '', en: '' },
              highlights: exp?.highlights ?? [],
            }],
          },
        })),

      updateExperience: (id, updates) =>
        set((state) => ({
          data: { ...state.data, experience: state.data.experience.map((e) => e.id === id ? { ...e, ...updates } : e) },
        })),

      removeExperience: (id) =>
        set((state) => ({
          data: { ...state.data, experience: state.data.experience.filter((e) => e.id !== id) },
        })),

      addProject: (proj) =>
        set((state) => ({
          data: {
            ...state.data,
            projects: [...state.data.projects, {
              id: uuidv4(),
              name: proj?.name ?? { zh: '', en: '' },
              role: proj?.role ?? { zh: '', en: '' },
              tech: proj?.tech ?? [],
              period: proj?.period ?? '',
              description: proj?.description ?? { zh: '', en: '' },
              highlights: proj?.highlights ?? [],
              link: proj?.link ?? '',
            }],
          },
        })),

      updateProject: (id, updates) =>
        set((state) => ({
          data: { ...state.data, projects: state.data.projects.map((p) => p.id === id ? { ...p, ...updates } : p) },
        })),

      removeProject: (id) =>
        set((state) => ({
          data: { ...state.data, projects: state.data.projects.filter((p) => p.id !== id) },
        })),

      addCampusActivity: (act) =>
        set((state) => ({
          data: {
            ...state.data,
            campusActivities: [...state.data.campusActivities, {
              id: uuidv4(),
              organization: act?.organization ?? { zh: '', en: '' },
              role: act?.role ?? { zh: '', en: '' },
              period: act?.period ?? '',
              description: act?.description ?? { zh: '', en: '' },
              highlights: act?.highlights ?? [],
            }],
          },
        })),

      updateCampusActivity: (id, updates) =>
        set((state) => ({
          data: { ...state.data, campusActivities: state.data.campusActivities.map((a) => a.id === id ? { ...a, ...updates } : a) },
        })),

      removeCampusActivity: (id) =>
        set((state) => ({
          data: { ...state.data, campusActivities: state.data.campusActivities.filter((a) => a.id !== id) },
        })),

      addResearchExperience: (item) =>
        set((state) => ({
          data: {
            ...state.data,
            researchExperience: [...state.data.researchExperience, {
              id: uuidv4(),
              institution: item?.institution ?? { zh: '', en: '' },
              project: item?.project ?? { zh: '', en: '' },
              role: item?.role ?? { zh: '', en: '' },
              period: item?.period ?? '',
              description: item?.description ?? { zh: '', en: '' },
              highlights: item?.highlights ?? [],
            }],
          },
        })),

      updateResearchExperience: (id, updates) =>
        set((state) => ({
          data: { ...state.data, researchExperience: state.data.researchExperience.map((r) => r.id === id ? { ...r, ...updates } : r) },
        })),

      removeResearchExperience: (id) =>
        set((state) => ({
          data: { ...state.data, researchExperience: state.data.researchExperience.filter((r) => r.id !== id) },
        })),

      addSkillCategory: (cat) =>
        set((state) => ({
          data: {
            ...state.data,
            skills: [...state.data.skills, {
              id: uuidv4(),
              category: cat?.category ?? { zh: '', en: '' },
              items: cat?.items ?? [],
            }],
          },
        })),

      updateSkillCategory: (id, updates) =>
        set((state) => ({
          data: { ...state.data, skills: state.data.skills.map((s) => s.id === id ? { ...s, ...updates } : s) },
        })),

      removeSkillCategory: (id) =>
        set((state) => ({
          data: { ...state.data, skills: state.data.skills.filter((s) => s.id !== id) },
        })),

      setTemplate: (template) => set({ template }),
      setSectionOrder: (sectionOrder) => set({ sectionOrder: normalizeSectionOrder(sectionOrder) }),
      setEmphasis: (emphasis) => set((state) => ({ emphasis: { ...state.emphasis, ...emphasis } })),
      toggleSectionVisibility: (section) =>
        set((state) => {
          if (section === 'personalInfo') return {};
          const current = state.emphasis[section];
          return {
            emphasis: {
              ...state.emphasis,
              [section]: current === 'hidden' ? 'normal' : 'hidden',
            },
          };
        }),
      setActiveLanguage: (activeLanguage) => set({ activeLanguage }),
      setActiveSection: (activeSection) => set({ activeSection }),
      loadResumeData: (data) => set(() => {
        const merged: ResumeData = {
          personalInfo: { ...DEFAULT_RESUME_DATA.personalInfo, ...data.personalInfo },
          education: (data.education || []).map((e: Partial<Education>) => ({
            id: e.id || uuidv4(), school: e.school || { zh: '', en: '' }, degree: e.degree || { zh: '', en: '' },
            major: e.major || { zh: '', en: '' }, period: e.period || '', gpa: e.gpa || '',
            courses: e.courses || [], description: e.description || { zh: '', en: '' },
          })),
          honors: (data.honors || []).map((h: Partial<Honor>) => ({
            id: h.id || uuidv4(), title: h.title || { zh: '', en: '' }, level: h.level || '',
            period: h.period || '', description: h.description || { zh: '', en: '' },
          })),
          experience: (data.experience || []).map((e: Partial<Experience>) => ({
            id: e.id || uuidv4(), company: e.company || { zh: '', en: '' }, role: e.role || { zh: '', en: '' },
            period: e.period || '', description: e.description || { zh: '', en: '' }, highlights: e.highlights || [],
          })),
          projects: (data.projects || []).map((p: Partial<Project>) => ({
            id: p.id || uuidv4(), name: p.name || { zh: '', en: '' }, role: p.role || { zh: '', en: '' },
            tech: p.tech || [], period: p.period || '', description: p.description || { zh: '', en: '' }, highlights: p.highlights || [], link: p.link || '',
          })),
          campusActivities: (data.campusActivities || []).map((a: Partial<CampusActivity>) => ({
            id: a.id || uuidv4(), organization: a.organization || { zh: '', en: '' }, role: a.role || { zh: '', en: '' },
            period: a.period || '', description: a.description || { zh: '', en: '' }, highlights: a.highlights || [],
          })),
          researchExperience: (data.researchExperience || []).map((r: Partial<ResearchExperience>) => ({
            id: r.id || uuidv4(), institution: r.institution || { zh: '', en: '' }, project: r.project || { zh: '', en: '' },
            role: r.role || { zh: '', en: '' }, period: r.period || '', description: r.description || { zh: '', en: '' }, highlights: r.highlights || [],
          })),
          skills: (data.skills || []).map((s: Partial<SkillCategory>) => ({
            id: s.id || uuidv4(), category: s.category || { zh: '', en: '' }, items: s.items || [],
          })),
        };
        return { data: merged };
      }),
      loadDemoData: () => set({ data: { ...DEMO_RESUME_DATA } }),
      resetResumeData: () => set({ data: { ...DEFAULT_RESUME_DATA } }),
      applyAiPatch: (patch) =>
        set((state) => {
          const merged = { ...state.data };
          for (const [key, value] of Object.entries(patch)) {
            if (value === undefined || value === null) continue;
            if (key === 'personalInfo') {
              merged.personalInfo = { ...merged.personalInfo, ...(value as Partial<ResumeData['personalInfo']>) };
            } else {
              // For array sections, replace the entire section with AI output
              (merged as Record<string, unknown>)[key] = value;
            }
          }
          return { data: merged };
        }),
    }),
    {
      name: 'resume-builder-data',
      merge: (persisted, current) => {
        const p = persisted as Partial<ResumeState>;
        if (!p || !p.data) return current;
        const d = p.data;
        return {
          ...current,
          ...p,
          sectionOrder: normalizeSectionOrder(p.sectionOrder),
          data: {
            personalInfo: { ...DEFAULT_RESUME_DATA.personalInfo, ...(d.personalInfo || {}) },
            education: (d.education || []).map((e: Partial<Education>) => ({
              id: e.id || uuidv4(), school: e.school || { zh: '', en: '' }, degree: e.degree || { zh: '', en: '' },
              major: e.major || { zh: '', en: '' }, period: e.period || '', gpa: e.gpa || '',
              courses: e.courses || [], description: e.description || { zh: '', en: '' },
            })),
            honors: (d.honors || []).map((h: Partial<Honor>) => ({
              id: h.id || uuidv4(), title: h.title || { zh: '', en: '' }, level: h.level || '',
              period: h.period || '', description: h.description || { zh: '', en: '' },
            })),
            experience: (d.experience || []).map((e: Partial<Experience>) => ({
              id: e.id || uuidv4(), company: e.company || { zh: '', en: '' }, role: e.role || { zh: '', en: '' },
              period: e.period || '', description: e.description || { zh: '', en: '' }, highlights: e.highlights || [],
            })),
            projects: (d.projects || []).map((p: Partial<Project>) => ({
              id: p.id || uuidv4(), name: p.name || { zh: '', en: '' }, role: p.role || { zh: '', en: '' },
              tech: p.tech || [], period: p.period || '', description: p.description || { zh: '', en: '' }, highlights: p.highlights || [], link: p.link || '',
            })),
            campusActivities: (d.campusActivities || []).map((a: Partial<CampusActivity>) => ({
              id: a.id || uuidv4(), organization: a.organization || { zh: '', en: '' }, role: a.role || { zh: '', en: '' },
              period: a.period || '', description: a.description || { zh: '', en: '' }, highlights: a.highlights || [],
            })),
            researchExperience: (d.researchExperience || []).map((r: Partial<ResearchExperience>) => ({
              id: r.id || uuidv4(), institution: r.institution || { zh: '', en: '' }, project: r.project || { zh: '', en: '' },
              role: r.role || { zh: '', en: '' }, period: r.period || '', description: r.description || { zh: '', en: '' }, highlights: r.highlights || [],
            })),
            skills: (d.skills || []).map((s: Partial<SkillCategory>) => ({
              id: s.id || uuidv4(), category: s.category || { zh: '', en: '' }, items: s.items || [],
            })),
          },
        };
      },
    }
  )
);
