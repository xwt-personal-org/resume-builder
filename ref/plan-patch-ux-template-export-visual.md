# Plan Patch — UI 易用性、简历排版细节、一键 PDF 与视觉验收

## 元信息
- 变更日期：2026-05-01
- 变更类型：修改现有功能 + 新增功能 + 修复缺陷
- 关联原 plan.md 版本：2026-05-01 补建基线版
- 涉及模块数：7
- 新增步骤数：12
- 修改步骤数：15
- 删除步骤数：1
- 是否需要微调研：否
- 目标分支建议：`feat/ux-template-export-visual`
- 总体执行顺序：
  1. 修复视觉测试基线
  2. 增加逐项输入 UI
  3. 增加模块展示控制
  4. 抽取模板视觉 token 并统一 Web 模板
  5. 同步 PDF 样式与字段展示
  6. 重构一键 PDF 导出
  7. 补齐视觉与功能验收

## 操作清单（Codex 必须严格按此处理）

### [MODIFY] 模块 8 — Step 2：维护视觉测试文件

**原步骤**（参考 `docs/plan.md` 模块 8 Step 2）：
> 维护 `tests/visual.test.js`。当前文件存在但不可作为可靠验收依据。

**修改后**：
- 操作：
  1. 删除当前 `tests/visual.test.js` 中的全部内容。
  2. 新建 TypeScript 版本视觉测试文件 `tests/visual.spec.ts`。
  3. 如保留旧文件，必须把旧 `tests/visual.test.js` 删除，避免 Playwright 同时收集损坏测试。
  4. `tests/visual.spec.ts` 使用 `@playwright/test` 的 `test` 和 `expect`，不得再默认依赖 Applitools。
  5. 视觉测试必须覆盖：
     - 4 个模板：`classic / modern / minimal / compact`
     - 2 种语言：`zh / en`
     - 主页面整体：`page.screenshot({ fullPage: true })`
     - 简历区域：定位 `#resume-preview` 后截图
     - 模块隐藏控制：隐藏 `campusActivities` 后截图确认模块标题消失
     - 一键 PDF 按钮存在并可点击触发 download 事件
  6. 测试数据使用当前 demo data，不新增后端或网络依赖。
  7. 每个截图文件名固定：
     - `main-${template}-${lang}.png`
     - `preview-${template}-${lang}.png`
     - `layout-hidden-campus.png`
- 关键代码指引：
  ```ts
  import { test, expect } from "@playwright/test";

  const templates = ["classic", "modern", "minimal", "compact"] as const;
  const languages = ["zh", "en"] as const;

  async function selectTemplate(page, template: string) {
    await page.getByRole("button", { name: new RegExp(template, "i") }).click();
  }

  async function setLanguage(page, lang: "zh" | "en") {
    const buttonName = lang === "en" ? "EN" : "中文";
    const button = page.getByRole("button", { name: buttonName });
    if (await button.isVisible()) await button.click();
  }
  ```
- 验证：
  - `npm run lint`
  - `npm run build`
  - `npx playwright test --list`
  - `npx playwright test tests/visual.spec.ts --update-snapshots`
  - `npx playwright test tests/visual.spec.ts`

### [DELETE] 模块 8 — Step 2：移除旧 Applitools 强依赖测试

**原步骤**（参考 `docs/plan.md` 模块 8 Step 2）：
> 维护 `tests/visual.test.js`。

**删除原因**：
- 当前文件存在拼写错误、语法错误、错误路由假设和错误 wait state。
- 该文件阻塞 `npm run test:visual`，不能作为本轮 UI/视觉验收基础。

**Codex 处理**：
- 删除文件：`tests/visual.test.js`
- 如项目需要兼容原脚本名，不要保留损坏内容，改用 `tests/visual.spec.ts`。
- `progress.md` 中模块 8 Step 2 标记为 `[MODIFIED]`，不要标记为 `[REMOVED]`，因为视觉测试能力被新文件替代。
- 验证：
  - `test ! -f tests/visual.test.js`
  - `npx playwright test --list`

### [MODIFY] 模块 1 — Step 1：配置项目脚本与依赖

**原步骤**（参考 `docs/plan.md` 模块 1 Step 1）：
> 在 `package.json` 中定义项目脚本与依赖。

**修改后**：
- 操作：修改 `package.json`：
  1. 将 `scripts.test:visual` 改为：
     ```json
     "test:visual": "playwright test tests/visual.spec.ts"
     ```
  2. 新增脚本：
     ```json
     "test:visual:update": "playwright test tests/visual.spec.ts --update-snapshots"
     ```
  3. 不新增 Applitools 必需依赖。
  4. 保留已有 `@playwright/test`。
- 验证：
  - `npm run lint`
  - `npm run build`
  - `npm run test:visual:update`
  - `npm run test:visual`

### [ADD] 模块 4 — Step 9：新增通用逐项输入组件 `TagInput`

#### 概述
- 职责：替代逗号分隔字符串输入，让用户逐项填写课程、技术栈、技能项等数组字段。
- 前置依赖：模块 4 Step 3、Step 6、Step 8
- 预计步骤数：1

#### Step 9：实现 `TagInput`
- 操作：创建文件 `src/components/ui/TagInput.tsx`
- 导出：
  - `interface TagInputProps`
  - `function TagInput(props: TagInputProps)`
- `TagInputProps` 必须包含：
  ```ts
  interface TagInputProps {
    label: string;
    value: string[];
    onChange: (next: string[]) => void;
    placeholder?: string;
    addButtonLabel?: string;
    emptyText?: string;
  }
  ```
- 组件行为：
  1. 每个数组项渲染为一行：
     - `<input className="field-input">`
     - 删除按钮 `<button type="button" className="btn-danger">删除</button>`
  2. 新增按钮文案默认 `+ 添加一项`。
  3. 输入为空时保存为空字符串，但 `onBlur` 时自动清理首尾空格并移除完全空白项。
  4. 用户按 Enter 时：
     - 当前输入非空：追加一个空项并 focus 到新输入。
     - 阻止表单默认提交行为。
  5. 用户点击删除：
     - 删除当前项。
     - 如果删除后数组为空，保留空数组 `[]`，不要写入 `[""]`。
  6. 对外保持 `string[]`，不得改变 `ResumeData` 类型。
- 关键代码指引：
  ```tsx
  "use client";

  export function TagInput({ label, value, onChange, placeholder, addButtonLabel = "+ 添加一项", emptyText = "暂无条目" }: TagInputProps) {
    const normalized = Array.isArray(value) ? value : [];
    const updateItem = (index: number, nextValue: string) => {
      onChange(normalized.map((item, i) => (i === index ? nextValue : item)));
    };
    const cleanup = () => onChange(normalized.map((item) => item.trim()).filter(Boolean));
    return (...);
  }
  ```
- 验证：
  - `npm run lint`
  - `npm run build`

### [MODIFY] 模块 4 — Step 3：实现教育经历表单

**原步骤**（参考 `docs/plan.md` 模块 4 Step 3）：
> 在 `src/components/editor/EducationForm.tsx` 中实现教育经历表单，`courses` 当前使用逗号分割单输入框。

**修改后**：
- 操作：修改 `src/components/editor/EducationForm.tsx`
  1. 引入：
     ```ts
     import { TagInput } from "@/components/ui/TagInput";
     ```
  2. 用 `TagInput` 替换课程 input：
     - `label={t("education.courses")}`
     - `value={edu.courses}`
     - `onChange={(courses) => updateEducation(edu.id, { courses })}`
     - `placeholder="例如：数据结构 / 计算机网络 / 操作系统"`
     - `emptyText="暂无课程，点击添加一项"`
  3. 删除旧逻辑：
     ```ts
     value={edu.courses.join(", ")}
     onChange={(e) => updateEducation(...split(",")...)}
     ```
- 验证：
  - `npm run lint`
  - `npm run build`
  - `npx playwright test tests/visual.spec.ts --update-snapshots`

### [MODIFY] 模块 4 — Step 6：实现项目经历表单

**原步骤**（参考 `docs/plan.md` 模块 4 Step 6）：
> 在 `src/components/editor/ProjectForm.tsx` 中实现项目经历表单，`tech` 当前使用逗号分割单输入框。

**修改后**：
- 操作：修改 `src/components/editor/ProjectForm.tsx`
  1. 引入 `TagInput`。
  2. 用 `TagInput` 替换技术栈 input：
     - `label={t("projects.tech")}`
     - `value={proj.tech}`
     - `onChange={(tech) => updateProject(proj.id, { tech })}`
     - `placeholder="例如：React / TypeScript / Node.js"`
     - `emptyText="暂无技术栈，点击添加一项"`
  3. 保留 `Project.link` 输入。
  4. 不改变 `Project.tech: string[]` 类型。
- 验证：
  - `npm run lint`
  - `npm run build`
  - `npx playwright test tests/visual.spec.ts --update-snapshots`

### [MODIFY] 模块 4 — Step 8：实现技能表单

**原步骤**（参考 `docs/plan.md` 模块 4 Step 8）：
> 在 `src/components/editor/SkillForm.tsx` 中实现技能分类与技能项字段。

**修改后**：
- 操作：修改 `src/components/editor/SkillForm.tsx`
  1. 引入 `TagInput`。
  2. 用 `TagInput` 管理 `SkillCategory.items`：
     - `label={t("skills.items")}`；如果词典中没有该 key，直接使用 `"技能项"`。
     - `value={cat.items}`
     - `onChange={(items) => updateSkillCategory(cat.id, { items })}`
     - `placeholder="例如：TypeScript / Next.js / PostgreSQL"`
     - `emptyText="暂无技能项，点击添加一项"`
  3. 保留分类名称中英文输入。
- 验证：
  - `npm run lint`
  - `npm run build`
  - `npx playwright test tests/visual.spec.ts --update-snapshots`

### [ADD] 模块 4 — Step 10：新增双语亮点逐项输入组件 `BilingualListInput`

#### 概述
- 职责：替代经历/校园经历中不友好的多条亮点输入方式。
- 前置依赖：模块 4 Step 5、Step 7
- 预计步骤数：1

#### Step 10：实现 `BilingualListInput`
- 操作：创建文件 `src/components/ui/BilingualListInput.tsx`
- 导出：
  - `interface BilingualListInputProps`
  - `function BilingualListInput(props: BilingualListInputProps)`
- Props：
  ```ts
  import type { BilingualText } from "@/types";

  interface BilingualListInputProps {
    label: string;
    value: BilingualText[];
    onChange: (next: BilingualText[]) => void;
    zhPlaceholder?: string;
    enPlaceholder?: string;
    addButtonLabel?: string;
    emptyText?: string;
  }
  ```
- 组件行为：
  1. 每条亮点显示为一张小卡片。
  2. 卡片内包含两个 textarea：
     - 中文亮点
     - 英文亮点
  3. 每条可删除。
  4. 新增按钮追加 `{ zh: "", en: "" }`。
  5. `onBlur` 清理两端空白；`zh` 与 `en` 都为空时移除该条。
- 验证：
  - `npm run lint`
  - `npm run build`

### [MODIFY] 模块 4 — Step 5：实现实习经历表单

**原步骤**（参考 `docs/plan.md` 模块 4 Step 5）：
> 在 `src/components/editor/ExperienceForm.tsx` 中实现公司、角色、时间、描述、亮点字段。

**修改后**：
- 操作：修改 `src/components/editor/ExperienceForm.tsx`
  1. 引入 `BilingualListInput`。
  2. 用 `BilingualListInput` 管理 `exp.highlights`：
     - `label="工作亮点"`
     - `value={exp.highlights}`
     - `onChange={(highlights) => updateExperience(exp.id, { highlights })}`
     - `zhPlaceholder="例如：负责核心页面开发，提升转化率 15%"`
     - `enPlaceholder="e.g. Built core pages and improved conversion by 15%"`
  3. 保留 `description` 字段。
- 验证：
  - `npm run lint`
  - `npm run build`
  - `npx playwright test tests/visual.spec.ts --update-snapshots`

### [MODIFY] 模块 4 — Step 7：实现校园经历表单

**原步骤**（参考 `docs/plan.md` 模块 4 Step 7）：
> 在 `src/components/editor/CampusActivityForm.tsx` 中实现组织、角色、时间、描述、亮点字段。

**修改后**：
- 操作：修改 `src/components/editor/CampusActivityForm.tsx`
  1. 引入 `BilingualListInput`。
  2. 用 `BilingualListInput` 管理 `act.highlights`：
     - `label="经历亮点"`
     - `value={act.highlights}`
     - `onChange={(highlights) => updateCampusActivity(act.id, { highlights })}`
  3. 保留 `description` 字段。
- 验证：
  - `npm run lint`
  - `npm run build`
  - `npx playwright test tests/visual.spec.ts --update-snapshots`

### [ADD] 模块 4 — Step 11：新增模块展示控制组件 `LayoutControls`

#### 概述
- 职责：让用户选择哪些简历模块展示在最终简历中。
- 前置依赖：模块 3 Step 4、模块 4 Step 1、模块 5
- 预计步骤数：1

#### Step 11：实现 `LayoutControls`
- 操作：创建文件 `src/components/editor/LayoutControls.tsx`
- 导出：
  - `function LayoutControls()`
- 组件行为：
  1. 读取 store：
     - `sectionOrder`
     - `emphasis`
     - `setEmphasis`
     - `activeLanguage`
  2. 展示所有可控制模块：
     - `education`
     - `honors`
     - `experience`
     - `projects`
     - `campusActivities`
     - `skills`
  3. 不提供隐藏 `personalInfo` 的开关。
  4. 每个模块渲染为一行：
     - 模块名
     - 开关按钮：`显示 / 隐藏`
  5. 切换逻辑：
     ```ts
     const hidden = emphasis[key] === "hidden";
     setEmphasis({ [key]: hidden ? "normal" : "hidden" });
     ```
  6. UI 放在左侧编辑器顶部，作为独立卡片，标题为：
     - 中文：`展示设置`
     - 英文：`Display`
  7. 卡片底部提供说明文案：
     - 中文：`隐藏模块不会删除已填写内容，只影响简历展示和导出。`
     - 英文：`Hidden sections keep their data and only affect preview/export.`
- 验证：
  - `npm run lint`
  - `npm run build`
  - 手动隐藏 `campusActivities`，预览区不再显示“校园经历”
  - `npx playwright test tests/visual.spec.ts --update-snapshots`

### [MODIFY] 模块 4 — Step 1：实现编辑器分区入口

**原步骤**（参考 `docs/plan.md` 模块 4 Step 1）：
> `SidebarEditor.tsx` 实现 tab 切换和表单渲染。

**修改后**：
- 操作：修改 `src/components/editor/SidebarEditor.tsx`
  1. 引入：
     ```ts
     import { LayoutControls } from "./LayoutControls";
     ```
  2. 在 tab 区域下方、当前 section 表单上方渲染：
     ```tsx
     <LayoutControls />
     ```
  3. `LayoutControls` 必须始终可见，不随 tab 切换消失。
  4. 不改变 `SECTIONS` 顺序。
- 验证：
  - `npm run lint`
  - `npm run build`
  - 页面左侧能看到展示设置卡片
  - 隐藏模块后刷新页面，隐藏状态仍通过 Zustand persist 保持

### [ADD] 模块 5 — Step 6：新增模板设计 token

#### 概述
- 职责：统一 Web 模板与 PDF 模板的横线颜色、粗细、间距、字号、模块间距。
- 前置依赖：模块 5 Step 2-5、模块 6 Step 4
- 预计步骤数：1

#### Step 6：创建 `designTokens.ts`
- 操作：创建文件 `src/lib/templates/designTokens.ts`
- 导出：
  ```ts
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
  } as const;
  ```
- 约束：
  - 不在 token 中加入 Tailwind class。
  - Token 数字单位默认 px，Web 模板拼接 `px`，PDF 模板按 React PDF 数值/字符串使用。
- 验证：
  - `npm run lint`
  - `npm run build`

### [MODIFY] 模块 5 — Step 2：实现 Classic 模板

**原步骤**（参考 `docs/plan.md` 模块 5 Step 2）：
> `ClassicTemplate.tsx` 实现传统单栏模板，当前横线颜色、粗细、间距硬编码。

**修改后**：
- 操作：修改 `src/components/templates/ClassicTemplate.tsx`
  1. 引入：
     ```ts
     import { RESUME_TOKENS } from "@/lib/templates/designTokens";
     ```
  2. 删除本文件局部 `C` 常量中的重复颜色定义，改为基于 token 的 `const C = RESUME_TOKENS.colors`。
  3. `SectionHead` 样式统一为：
     - `borderBottom: 1.25px solid C.lineStrong`
     - `paddingBottom: 3px`
     - `marginBottom: 6px`
     - `marginTop: 12px`
     - 字号 `13px`
  4. 个人信息底部分割线统一为：
     - `borderBottom: 1px solid C.line`
     - `paddingBottom: 8px`
     - `marginBottom: 6px`
  5. 项目模块中展示 `proj.link`：
     - 如果 `proj.link` 非空，在项目标题/时间下一行显示。
     - 样式：`fontSize: 10px; color: C.textMuted; marginTop: 1px;`
  6. 教育模块展示 `edu.description`：
     - 如果存在当前语言描述，在 GPA/课程下方显示。
     - 样式与 body 一致。
  7. 荣誉模块展示 `h.description`：
     - 如果存在当前语言描述，在标题下方显示。
  8. 不改变布局为单栏。
- 验证：
  - `npm run lint`
  - `npm run build`
  - `npx playwright test tests/visual.spec.ts --update-snapshots`

### [MODIFY] 模块 5 — Step 3：实现 Modern 模板

**原步骤**（参考 `docs/plan.md` 模块 5 Step 3）：
> `ModernTemplate.tsx` 实现 30/70 双栏结构，部分 spacing 与模块隐藏逻辑不统一。

**修改后**：
- 操作：修改 `src/components/templates/ModernTemplate.tsx`
  1. 引入 `RESUME_TOKENS`。
  2. 用 token 替换：
     - `SIDEBAR_BG`
     - `SIDEBAR_TEXT`
     - `SIDEBAR_TEXT_LIGHT`
     - `MAIN_TEXT`
     - `MAIN_TEXT_SECONDARY`
     - `MAIN_TEXT_MUTED`
     - `MAIN_BORDER`
     - `SECTION_LINE`
  3. `renderSidebarSkills` 必须尊重 `emphasis.skills === "hidden"`，隐藏时不渲染技能。
  4. `visibleSidebarSections` 必须强制包含 `personalInfo`，不允许用户隐藏个人信息：
     ```ts
     const visibleSidebarSections: SectionKey[] = ["personalInfo", ...(emphasis.skills === "hidden" ? [] : ["skills"])];
     ```
  5. `visibleMainSections` 不再特殊强制 `education` 总是显示，所有非 personalInfo 模块统一遵循 `emphasis[key] !== "hidden"`。
  6. 项目模块展示 `proj.link`。
  7. 教育、荣誉、项目、校园经历在有 description 时显示 description。
  8. section 标题线统一为：
     - `borderBottom: 1.25px solid token accent`
     - `paddingBottom: 3px`
     - `marginBottom: 6px`
- 验证：
  - `npm run lint`
  - `npm run build`
  - 手动隐藏 `skills` 后 Modern 左侧不显示技能
  - 手动隐藏 `education` 后 Modern 右侧不显示教育背景
  - `npx playwright test tests/visual.spec.ts --update-snapshots`

### [MODIFY] 模块 5 — Step 4：实现 Minimal 模板

**原步骤**（参考 `docs/plan.md` 模块 5 Step 4）：
> `MinimalTemplate.tsx` 实现简约单栏结构。

**修改后**：
- 操作：修改 `src/components/templates/MinimalTemplate.tsx`
  1. 引入 `RESUME_TOKENS`。
  2. 将横线颜色统一为 `RESUME_TOKENS.colors.line`。
  3. 将模块标题字号统一为 `RESUME_TOKENS.fontSize.sectionTitle`。
  4. 将模块顶部间距统一为 `RESUME_TOKENS.spacing.sectionTop`。
  5. 展示 `Project.link`。
  6. 保证所有非 personalInfo 模块都遵循 `emphasis[key] !== "hidden"`。
- 验证：
  - `npm run lint`
  - `npm run build`
  - `npx playwright test tests/visual.spec.ts --update-snapshots`

### [MODIFY] 模块 5 — Step 5：实现 Compact 模板

**原步骤**（参考 `docs/plan.md` 模块 5 Step 5）：
> `CompactTemplate.tsx` 实现紧凑单栏结构。

**修改后**：
- 操作：修改 `src/components/templates/CompactTemplate.tsx`
  1. 引入 `RESUME_TOKENS`。
  2. 保持紧凑模板内容密度，但统一以下 token：
     - line color
     - line width
     - section title font size
     - item divider color
  3. 展示 `Project.link`，但样式必须保持紧凑：
     - `fontSize: 9px`
     - `color: RESUME_TOKENS.colors.textMuted`
     - `marginTop: 1px`
  4. 保证所有非 personalInfo 模块都遵循 `emphasis[key] !== "hidden"`。
- 验证：
  - `npm run lint`
  - `npm run build`
  - `npx playwright test tests/visual.spec.ts --update-snapshots`

### [MODIFY] 模块 6 — Step 4：实现 React PDF 导出

**原步骤**（参考 `docs/plan.md` 模块 6 Step 4）：
> `src/lib/export/pdf.tsx` 中实现 4 套 PDF 模板，当前 Web/PDF 样式不同源。

**修改后**：
- 操作：修改 `src/lib/export/pdf.tsx`
  1. 引入：
     ```ts
     import { RESUME_TOKENS } from "@/lib/templates/designTokens";
     ```
  2. 所有 PDF 模板使用与 Web 模板同名 token：
     - 颜色：`RESUME_TOKENS.colors.*`
     - 横线：`RESUME_TOKENS.line.*`
     - 间距：`RESUME_TOKENS.spacing.*`
     - 字号：`RESUME_TOKENS.fontSize.*`
  3. `createResumePDF` 中 `visibleSections` 逻辑统一：
     - `personalInfo` 永远显示
     - 其他模块满足 `emphasis[key] !== "hidden"` 才显示
  4. 4 个 PDF 模板都必须展示 `Project.link`。
  5. 4 个 PDF 模板中 education/honors/projects/campusActivities 的 description 展示策略必须与对应 Web 模板一致。
  6. Modern PDF 中 `skills` 必须遵循 `emphasis.skills !== "hidden"`。
  7. 不新增后端 PDF 服务。
- 验证：
  - `npm run lint`
  - `npm run build`
  - 手动点击 PDF 下载，确认文件能打开
  - `npx playwright test tests/visual.spec.ts --update-snapshots`

### [MODIFY] 模块 6 — Step 1：实现导出栏

**原步骤**（参考 `docs/plan.md` 模块 6 Step 1）：
> `ExportBar.tsx` 包含 PDF、打印 PDF、SVG、JSON、导入、示例、重置按钮。

**修改后**：
- 操作：修改 `src/components/export/ExportBar.tsx`
  1. 将当前 PDF 按钮文案改为：
     - 默认：`一键导出 PDF`
     - loading：`正在生成 PDF...`
  2. 该按钮继续使用 `@react-pdf/renderer` 的 `pdf(doc).toBlob()` 链路。
  3. 下载文件名改为：
     ```ts
     const safeName = store.data.personalInfo.name.zh || store.data.personalInfo.name.en || "resume";
     a.download = `${safeName}-resume.pdf`;
     ```
  4. 浏览器打印按钮保留，但降级为 secondary fallback：
     - 文案：`打印方式导出`
     - title：`如果一键导出效果异常，可使用浏览器打印作为备用方案`
  5. PDF 导出成功后显示反馈：
     - `PDF 已导出`
  6. PDF 导出失败时显示：
     - `一键 PDF 导出失败，请尝试打印方式导出`
  7. 保留 JSON/SVG/导入/示例/重置功能。
- 验证：
  - `npm run lint`
  - `npm run build`
  - 手动点击“一键导出 PDF”，浏览器触发文件下载
  - `npx playwright test tests/visual.spec.ts`

### [MODIFY] 模块 6 — Step 5：实现浏览器打印导出页

**原步骤**（参考 `docs/plan.md` 模块 6 Step 5）：
> `/export` 页面从 query string 读取数据并渲染 `PreviewPanel`。

**修改后**：
- 操作：修改 `src/app/export/page.tsx`
  1. 保留现有 query string 恢复逻辑。
  2. 增加页面标题：
     ```ts
     document.title = "Resume Print Export";
     ```
  3. 当 data 解析失败时在页面显示明确错误信息：
     - 中文：`无法解析简历数据，请返回主页面重新导出。`
  4. 保持 `resume-export-ready` 事件。
  5. 不把打印页作为主导出路径，只作为 fallback。
- 验证：
  - `npm run lint`
  - `npm run build`
  - 手动点击“打印方式导出”，新窗口正常显示
  - `npx playwright test tests/visual.spec.ts`

### [MODIFY] 模块 7 — Step 1：实现词典文件

**原步骤**（参考 `docs/plan.md` 模块 7 Step 1）：
> 维护 `src/lib/i18n/zh.ts` 和 `src/lib/i18n/en.ts`。

**修改后**：
- 操作：
  1. 修改 `src/lib/i18n/zh.ts`，新增 key：
     - `layout.title`: `展示设置`
     - `layout.description`: `隐藏模块不会删除已填写内容，只影响简历展示和导出。`
     - `layout.show`: `显示`
     - `layout.hide`: `隐藏`
     - `layout.visible`: `已显示`
     - `layout.hidden`: `已隐藏`
     - `common.addItem`: `添加一项`
     - `common.delete`: `删除`
     - `common.empty`: `暂无条目`
     - `export.oneClickPdf`: `一键导出 PDF`
     - `export.pdfGenerating`: `正在生成 PDF...`
     - `export.pdfSuccess`: `PDF 已导出`
     - `export.pdfFallback`: `打印方式导出`
     - `export.pdfFailedUsePrint`: `一键 PDF 导出失败，请尝试打印方式导出`
  2. 修改 `src/lib/i18n/en.ts`，新增对应英文 key：
     - `Display`
     - `Hidden sections keep their data and only affect preview/export.`
     - `Show`
     - `Hide`
     - `Visible`
     - `Hidden`
     - `Add item`
     - `Delete`
     - `No items yet`
     - `Export PDF`
     - `Generating PDF...`
     - `PDF exported`
     - `Print fallback`
     - `PDF export failed. Try print fallback.`
- 验证：
  - `npm run lint`
  - `npm run build`

### [MODIFY] 模块 7 — Step 2：实现翻译函数

**原步骤**（参考 `docs/plan.md` 模块 7 Step 2）：
> `t()` 当前基于模块级 `currentLocale`，页面语言切换没有调用 `setLocale()`。

**修改后**：
- 操作：修改 `src/app/page.tsx`
  1. 引入：
     ```ts
     import { setLocale } from "@/lib/i18n";
     ```
  2. 修改语言切换按钮逻辑：
     ```tsx
     onClick={() => {
       const next = activeLanguage === "zh" ? "en" : "zh";
       setActiveLanguage(next);
       setLocale(next);
     }}
     ```
  3. 为避免初始持久化语言与 i18n 不一致，在组件内增加：
     ```tsx
     useEffect(() => {
       setLocale(activeLanguage);
     }, [activeLanguage]);
     ```
  4. 同步修改 import：
     ```ts
     import { useEffect } from "react";
     ```
- 验证：
  - `npm run lint`
  - `npm run build`
  - 切换 EN 后编辑器新增文案显示英文

### [ADD] 模块 5 — Step 7：建立字段展示矩阵并落地到模板

#### 概述
- 职责：确保“填了但没显示”的问题有明确默认策略。
- 前置依赖：模块 5 Step 2-5、模块 6 Step 4
- 预计步骤数：1

#### Step 7：实现字段展示矩阵
- 操作：创建文件 `src/lib/templates/fieldVisibility.ts`
- 导出：
  ```ts
  import type { SectionKey, TemplateName } from "@/types";

  export const REQUIRED_VISIBLE_FIELDS = {
    personalInfo: ["name", "title", "gender", "birthDate", "politicalStatus", "phone", "email", "location", "website", "summary"],
    education: ["school", "degree", "major", "period", "gpa", "courses", "description"],
    honors: ["title", "level", "period", "description"],
    experience: ["company", "role", "period", "description", "highlights"],
    projects: ["name", "role", "period", "tech", "description", "link"],
    campusActivities: ["organization", "role", "period", "description", "highlights"],
    skills: ["category", "items"],
  } as const;
  ```
- 落地要求：
  1. 4 个 Web 模板都必须遵守该矩阵。
  2. 4 个 PDF 模板都必须遵守该矩阵。
  3. 如果某字段为空，不显示占位符。
  4. 如果字段非空，必须在对应模块中可见。
  5. Compact 模板可以用更小字号显示，但不能直接丢弃非空字段。
- 验证：
  - `npm run lint`
  - `npm run build`
  - 在 demo data 中填入 `Project.link` 后，4 个模板和 PDF 都可见
  - `npx playwright test tests/visual.spec.ts --update-snapshots`

### [ADD] 模块 8 — Step 3：新增 PDF 下载验收测试

#### 概述
- 职责：验证“一键导出 PDF”不是空按钮，且能触发浏览器下载。
- 前置依赖：模块 6 Step 1
- 预计步骤数：1

#### Step 3：实现 PDF 下载测试
- 操作：在 `tests/visual.spec.ts` 中追加测试：
  ```ts
  test("one click PDF export triggers download", async ({ page }) => {
    await page.goto("/");
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: /一键导出 PDF|Export PDF/i }).click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/resume\.pdf$/);
  });
  ```
- 约束：
  - 测试只验证 download 事件和文件名。
  - 不解析 PDF 内容。
  - 不调用外部服务。
- 验证：
  - `npx playwright test tests/visual.spec.ts -g "one click PDF export triggers download"`

### [ADD] 模块 8 — Step 4：新增模块隐藏验收测试

#### 概述
- 职责：验证展示设置能真正影响预览与导出。
- 前置依赖：模块 4 Step 11、模块 5 Step 2-5
- 预计步骤数：1

#### Step 4：实现模块隐藏测试
- 操作：在 `tests/visual.spec.ts` 中追加测试：
  1. 打开首页。
  2. 点击 `campusActivities` 对应隐藏按钮。
  3. 定位 `#resume-preview`。
  4. 断言预览区域不包含：
     - 中文：`校园经历`
     - 英文：`Campus Activities`
  5. 对 `#resume-preview` 进行截图快照：
     - `layout-hidden-campus.png`
- 验证：
  - `npx playwright test tests/visual.spec.ts -g "hide campus activities"`

### [MODIFY] 模块 3 — Step 4：实现布局/语言/模板 action

**原步骤**（参考 `docs/plan.md` 模块 3 Step 4）：
> 实现 `setTemplate/setSectionOrder/setEmphasis/setActiveLanguage/setActiveSection`。

**修改后**：
- 操作：修改 `src/store/useResumeStore.ts`
  1. 在 `ResumeState` 中新增：
     ```ts
     toggleSectionVisibility: (section: SectionKey) => void;
     ```
  2. 实现：
     ```ts
     toggleSectionVisibility: (section) =>
       set((state) => {
         if (section === "personalInfo") return {};
         const current = state.emphasis[section];
         return {
           emphasis: {
             ...state.emphasis,
             [section]: current === "hidden" ? "normal" : "hidden",
           },
         };
       }),
     ```
  3. `LayoutControls` 优先调用 `toggleSectionVisibility(section)`，不直接重复判断逻辑。
  4. 不改变已有 `setEmphasis` 行为。
- 验证：
  - `npm run lint`
  - `npm run build`
  - 刷新页面后隐藏状态保持

## 受影响但无需修改的模块

- 模块 2：核心数据模型
  - 不修改 `ResumeData` 结构。
  - `TagInput` 和 `BilingualListInput` 均复用现有 `string[]` 与 `BilingualText[]`。
- 模块 6 Step 2：JSON 导入导出
  - 不修改数据格式。
  - 现有 `mergeWithDefaults` 继续有效。
- 模块 6 Step 3：SVG 导出
  - 本轮不强制同步 SVG 视觉细节。
  - SVG 导出保持可用即可。
- 微信小程序迁移计划
  - 本轮不实现小程序。
  - `@react-pdf/renderer` 一键导出只作为当前 Web 版能力。

## patch 自检

1. 每条 [MODIFY] 已标明原 Step 编号和原描述。
2. 每条 [ADD] 已具体到文件名、组件名、函数名、props、验证命令。
3. [DELETE] 已说明删除旧视觉测试文件的原因和 progress.md 处理方式。
4. 不破坏当前 `ResumeData` 数据结构。
5. 不要求 Codex 做技术选型。
6. 每个 Step 都有可执行验证命令。
7. Web 模板与 PDF 模板通过 `RESUME_TOKENS` 降低视觉漂移。
8. 视觉验收默认使用 Playwright screenshot snapshot，不依赖外部 API key。

## 验收标准

- [ ] `npm run lint` 通过
- [ ] `npm run build` 通过
- [ ] `npx playwright test --list` 能列出 `tests/visual.spec.ts`
- [ ] `npm run test:visual:update` 能生成/更新快照
- [ ] `npm run test:visual` 通过
- [ ] 教育课程、项目技术栈、技能项均为逐项输入，不再依赖用户手写逗号分割
- [ ] 实习亮点、校园经历亮点支持逐条中英文输入
- [ ] 左侧编辑器出现“展示设置 / Display”卡片
- [ ] 用户能隐藏 `education/honors/experience/projects/campusActivities/skills`
- [ ] `personalInfo` 不可隐藏
- [ ] 4 个 Web 模板均遵守模块隐藏状态
- [ ] 4 个 PDF 模板均遵守模块隐藏状态
- [ ] 4 个 Web 模板均展示非空 `Project.link`
- [ ] 4 个 PDF 模板均展示非空 `Project.link`
- [ ] 模板横线颜色、粗细、间距统一由 `src/lib/templates/designTokens.ts` 控制
- [ ] 导出栏主按钮为“一键导出 PDF / Export PDF”
- [ ] 一键 PDF 能触发文件下载
- [ ] 打印导出作为 fallback 保留
- [ ] `docs/progress.md` 中本 patch 涉及的原步骤被标记为 `[MODIFIED]`，新增步骤被标记为 `[ADDED]`
