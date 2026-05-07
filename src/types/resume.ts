export interface BilingualText {
  zh: string;
  en: string;
}

export interface PersonalInfo {
  name: BilingualText;
  title: BilingualText;
  email: string;
  phone: string;
  location: BilingualText;
  website: string;
  summary: BilingualText;
  avatarUrl: string;
  gender: string;
  birthDate: string;
  politicalStatus: string;
}

export interface Experience {
  id: string;
  company: BilingualText;
  role: BilingualText;
  period: string;
  description: BilingualText;
  highlights: BilingualText[];
}

export interface Project {
  id: string;
  name: BilingualText;
  role: BilingualText;
  tech: string[];
  period: string;
  description: BilingualText;
  highlights: BilingualText[];
  link: string;
}

export interface SkillCategory {
  id: string;
  category: BilingualText;
  items: string[];
}

export interface Education {
  id: string;
  school: BilingualText;
  degree: BilingualText;
  major: BilingualText;
  period: string;
  gpa: string;
  courses: string[];
  description: BilingualText;
}

export interface Honor {
  id: string;
  title: BilingualText;
  level: string;
  period: string;
  description: BilingualText;
}

export interface CampusActivity {
  id: string;
  organization: BilingualText;
  role: BilingualText;
  period: string;
  description: BilingualText;
  highlights: BilingualText[];
}

export interface ResearchExperience {
  id: string;
  institution: BilingualText;
  project: BilingualText;
  role: BilingualText;
  period: string;
  description: BilingualText;
  highlights: BilingualText[];
}

export type SectionKey = 'personalInfo' | 'education' | 'researchExperience' | 'honors' | 'experience' | 'projects' | 'campusActivities' | 'skills';

export type SectionEmphasis = 'expanded' | 'normal' | 'compact' | 'hidden';

export interface ResumeData {
  personalInfo: PersonalInfo;
  education: Education[];
  honors: Honor[];
  experience: Experience[];
  projects: Project[];
  campusActivities: CampusActivity[];
  researchExperience: ResearchExperience[];
  skills: SkillCategory[];
}

export interface LayoutSuggestion {
  template: TemplateName;
  sectionOrder: SectionKey[];
  emphasis: Partial<Record<SectionKey, SectionEmphasis>>;
  language: 'zh' | 'en';
}

export type TemplateName = 'classic' | 'modern' | 'minimal' | 'compact';

export const TEMPLATE_NAMES: Record<TemplateName, BilingualText> = {
  classic: { zh: '经典', en: 'Classic' },
  modern: { zh: '现代', en: 'Modern' },
  minimal: { zh: '简约', en: 'Minimal' },
  compact: { zh: '紧凑', en: 'Compact' },
};

export const DEFAULT_RESUME_DATA: ResumeData = {
  personalInfo: {
    name: { zh: '', en: '' },
    title: { zh: '', en: '' },
    email: '',
    phone: '',
    location: { zh: '', en: '' },
    website: '',
    summary: { zh: '', en: '' },
    avatarUrl: '',
    gender: '',
    birthDate: '',
    politicalStatus: '',
  },
  education: [],
  honors: [],
  experience: [],
  projects: [],
  campusActivities: [],
  researchExperience: [],
  skills: [],
};

export const DEFAULT_SECTION_ORDER: SectionKey[] = [
  'personalInfo',
  'education',
  'researchExperience',
  'honors',
  'experience',
  'projects',
  'campusActivities',
  'skills',
];

export const SECTION_LABELS: Record<SectionKey, BilingualText> = {
  personalInfo: { zh: '基本信息', en: 'Personal Info' },
  education: { zh: '教育背景', en: 'Education' },
  researchExperience: { zh: '科研经历', en: 'Research Experience' },
  honors: { zh: '荣誉奖项', en: 'Honors & Awards' },
  experience: { zh: '实习经历', en: 'Internship' },
  projects: { zh: '项目经历', en: 'Projects' },
  campusActivities: { zh: '校园经历', en: 'Campus Activities' },
  skills: { zh: '技能特长', en: 'Skills' },
};