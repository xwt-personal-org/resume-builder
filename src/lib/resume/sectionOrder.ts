import { DEFAULT_SECTION_ORDER } from "@/types";
import type { SectionKey } from "@/types";

export const ALL_SECTION_KEYS: readonly SectionKey[] = DEFAULT_SECTION_ORDER;

export const CONTROLLABLE_SECTION_KEYS: readonly SectionKey[] = DEFAULT_SECTION_ORDER.filter(
  (section) => section !== "personalInfo",
);

const SECTION_KEY_SET = new Set<SectionKey>(DEFAULT_SECTION_ORDER);

export function isSectionKey(value: unknown): value is SectionKey {
  return typeof value === "string" && SECTION_KEY_SET.has(value as SectionKey);
}

export function normalizeSectionOrder(order?: readonly unknown[]): SectionKey[] {
  const seen = new Set<SectionKey>();
  const provided: SectionKey[] = [];

  for (const item of order ?? []) {
    if (!isSectionKey(item) || seen.has(item)) continue;
    if (item !== "personalInfo") provided.push(item);
    seen.add(item);
  }

  const defaultIndex = new Map<SectionKey, number>(
    DEFAULT_SECTION_ORDER.map((section, index) => [section, index]),
  );
  const followsDefaultOrder = provided.every((section, index) => {
    if (index === 0) return true;
    return (defaultIndex.get(provided[index - 1]) ?? 0) < (defaultIndex.get(section) ?? 0);
  });

  if (followsDefaultOrder) {
    return [...DEFAULT_SECTION_ORDER];
  }

  const normalized: SectionKey[] = ["personalInfo", ...provided];
  const normalizedSet = new Set(normalized);

  for (const section of DEFAULT_SECTION_ORDER) {
    if (normalizedSet.has(section)) continue;
    normalized.push(section);
    normalizedSet.add(section);
  }

  return normalized;
}

export function getControllableSectionOrder(order?: readonly unknown[]): SectionKey[] {
  return normalizeSectionOrder(order).filter((section) => section !== "personalInfo");
}
