export const RESUME_TOKENS = {
  page: {
    widthPx: 794,
    minHeightPx: 1123,
    padding: {
      classic: { top: 28, right: 36, bottom: 28, left: 36 },
      minimal: { top: 24, right: 32, bottom: 24, left: 32 },
      compact: { top: 22, right: 30, bottom: 22, left: 30 },
      modern: { top: 24, right: 24, bottom: 20, left: 24 },
    },
  },
  colors: {
    text: "#1f2937",
    textSecondary: "#4b5563",
    textMuted: "#6b7280",
    lineStrong: "#374151",
    line: "#d1d5db",
    lineSubtle: "#e5e7eb",
    accentBlue: "#2563eb",
    modernSidebar: "#263445",
    modernSidebarText: "#f8fafc",
    modernSidebarMuted: "#cbd5e1",
  },
  line: {
    sectionStrongPx: 1.25,
    sectionNormalPx: 1,
    itemPx: 0.75,
  },
  spacing: {
    sectionTop: 12,
    sectionTitleBottom: 6,
    itemBottom: 6,
    paragraphTop: 2,
    listTop: 3,
  },
  fontSize: {
    name: 22,
    sectionTitle: 13,
    itemTitle: 12,
    body: 11,
    meta: 10.5,
    tag: 10,
  },
  radius: {
    tag: 3,
  },
  photo: {
    classic: { width: 76, height: 100 },
    modern: { width: 72, height: 96 },
    minimal: { width: 72, height: 96 },
    compact: { width: 60, height: 80 },
  },
} as const;
