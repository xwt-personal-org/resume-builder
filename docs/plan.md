# 开发计划（当前 Web 版基线）

## 元信息
- 项目：resume-builder
- 版本：v5
- 技术栈：Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + Zustand 5
- 当前目标：在 v4 项目经历分条亮点基线之上，完成两项结构性变更：
  1. 四套模板都为个人证件照预留稳定空间，并使用现有 `PersonalInfo.avatarUrl` 渲染照片。
  2. 新增可选模块「科研经历」，作为与教育背景、实习经历、项目经历、校园经历同级的简历 section，完整接入数据模型、编辑器、布局控制、模板渲染、JSON 兼容和验收。
- 本轮策略：
  - 不新增图片上传链路；先复用 `PersonalInfo.avatarUrl`，在 `PersonalInfoForm` 补 URL 输入。
  - 证件照位必须在有图和无图时都占据固定空间，避免简历版式跳动。
  - 证件照统一采用证件照矩形比例，不再沿用 Modern 当前圆形头像样式。
  - 「科研经历」是顶层可选 section，不挂在教育背景内部，不复用 `Education` 字段名。
  - 「科研经历」字段采用当前已有模块模式：双语主字段 + period + description + highlights，保证中英文简历一致。
  - 旧 JSON / localStorage 数据缺失 `researchExperience` 时统一归一化为 `[]`。
  - 视觉测试遗留问题不阻断本轮功能，但新增变更必须至少通过 `npm run build` 与手动 QA。
- 总模块数：11
- 预计步骤总数：70
- 建议开发顺序：模块 11 Step 1 → Step 2 → Step 3 → Step 4 → Step 5 → Step 6 → Step 7 → Step 8 → Step 9；模块 8 Step 6 与模块 9 Step 5 仍保留为后续独立修复
- 创建日期：2026-05-01
- 最后更新：2026-05-06

### 变更记录
| 版本 | 日期 | 变更摘要 |
|------|------|---------|
| v1 | 2026-05-01 | 补建当前 Web 版 MVP 基线 |
| v2 | 2026-05-02 | PDF 主链路改为浏览器打印；URL query payload 改为 sessionStorage；`@react-pdf` 降级；补打印导出测试 |
| v3 | 2026-05-02 | 修复 Playwright webServer / popup print mock / print payload guard；新增开发环境关闭后台进程按钮 |
| v4 | 2026-05-05 | 新增项目经历双语分条亮点字段、编辑表单、模板渲染、JSON 兼容与视觉验收 |
| v5 | 2026-05-06 | 四套模板预留证件照位；新增同级可选模块「科研经历」并接入全链路 |

## Status
> 任何 agent 读到此区块即可恢复完整上下文。

- 当前阶段：模块 11：证件照模板位与科研经历模块 Step 1
- 整体进度：59 / 70 步骤完成
- 状态：变更后待执行
- 阻塞项：无
- 当前决策：
  - `@react-pdf/renderer` 仍不作为主 PDF 导出链路。
  - Playwright 视觉测试必须可自启动 dev server，`npm run test:visual` 长期目标必须可复现；但 v3 baseline diff / popup timeout 不阻断 v5 功能交付。
  - 关闭后台能力仅限本地开发环境，不能在生产环境暴露可远程杀进程的接口。
  - 项目经历 `description` 与 `highlights` 继续并存，不自动拆分历史文本。
  - 证件照使用 `PersonalInfo.avatarUrl`，本轮只补 URL 输入和模板渲染，不新增本地文件上传。
  - 证件照位固定占位：无照片时显示浅色边框占位；有照片时 `<img>` 使用 `object-fit: cover`。
  - 「科研经历」作为 `SectionKey` 顶层同级模块，默认可显示/隐藏；旧数据缺失时补 `[]`。
  - 「科研经历」字段定义为 `id / institution / project / role / period / description / highlights`，不使用 `Education.school/degree/major` 字段名，避免语义污染。

### Last Iteration Summary
- v2 已完成浏览器打印导出主链路：
  - `ExportBar.tsx` 主按钮写入 `sessionStorage` 并打开 `/export`。
  - `/export/page.tsx` 从 `sessionStorage` 读取 payload 并自动 `window.print()`。
  - `globals.css` 已设置 A4 打印约束。
  - `tests/visual.spec.ts` 已改为打印导出主链路测试。
- v3 已由执行端落地主要 patch：
  - `playwright.config.ts` 已添加 `webServer`。
  - `/export/page.tsx` 已添加 sessionStorage payload shape guard。
  - `zh.ts` / `en.ts` / `ExportBar.tsx` 已补齐 export/runtime i18n。
  - `/api/runtime/shutdown` 与 `ShutdownButton` 已实现，manual QA 通过。
- v3 遗留执行端报告：
  - `npm run test:visual` 仍有模板截图 baseline diff。
  - `print export opens clean export page` 仍 timeout，需要修复 popup 测试稳定性。
  - `ShutdownButton.tsx` 仍有 React Hooks conditional calling lint 问题。
- v4 已完成并经手动 QA：
  - `Project.highlights: BilingualText[]` 已加入模型、store、JSON、表单和四套模板。
  - 项目经历可分条填写双语亮点，预览和打印导出页可分条显示。
- v5 新需求：
  - 每个模板需要合适空间放置个人证件照。
  - 增加可选模块「科研经历」，层级与教育背景等模块相同。

### Pending Decisions
- 是否在后续版本彻底删除 `src/lib/export/pdf.tsx` 与 `@react-pdf/renderer` 依赖：本轮不决定。
- 是否将 SVG 导出也改为浏览器/DOM 捕获路线：本轮不决定。
- 是否增加“关闭标签页时自动尝试关闭后台”的实验功能：本轮不做。
- 是否对历史 `projects[].description` 自动拆分为 `projects[].highlights`：本轮不做。
- 是否为证件照新增本地文件上传 / base64 存储 / 图片裁剪：本轮不做，只使用 `avatarUrl` URL。
- 是否将科研经历拆成「论文成果 / 专利 / 课题」多个子模块：本轮不做，先用通用科研经历条目承载。

---

## 模块 1：项目基础与运行配置

### 概述
- 职责：Next.js 前端骨架、脚本、依赖、基础样式入口、测试运行基础设施。
- 前置依赖：无
- 当前状态：已实现；v3 新增测试 webServer 修复。

### Step 1：[DONE] 配置项目脚本与依赖
- **scope: auto**
- 操作：维护 `package.json` 中的 `dev/build/start/lint/test:visual/test:visual:update`。
- 验证：`npm install && npm run lint && npm run build`

### Step 2：[DONE] 配置 Next.js App Router
- **scope: auto**
- 操作：维护 `src/app/layout.tsx`、`src/app/page.tsx`、`src/app/export/page.tsx`、`src/app/globals.css`。
- 验证：`npm run dev` 后访问 `http://localhost:3001`

### Step 3：[DONE] 配置 Playwright
- **scope: auto**
- 操作：维护 `playwright.config.ts`，确保 `testDir="./tests"`，baseURL 与 dev 端口一致。
- 验证：`npx playwright test --list`

### Step 4：[DONE] 修复 Playwright 自动启动 dev server
- **scope: auto**
- 变更说明：v3 新增；对应审计 H-1。
- 操作：维护 `playwright.config.ts` 顶层 `webServer`：
  ```ts
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3001",
    reuseExistingServer: true,
    timeout: 120_000,
  }
  ```
- 验证：不手动启动 dev server，直接运行 `npm run test:visual`，不再出现 `ERR_CONNECTION_REFUSED`。

---

## 模块 2：核心数据模型

### 概述
- 职责：定义简历数据结构、模板名称、模块顺序、模块展示状态。
- 前置依赖：模块 1
- 当前状态：已实现；v5 将扩展科研经历 section。

### Step 1：[DONE] 定义双语字段模型
- **scope: auto**
- 操作：在 `src/types/resume.ts` 中定义 `interface BilingualText { zh: string; en: string }`。
- 验证：`npm run build`

### Step 2：[DONE] 定义个人信息模型
- **scope: auto**
- 操作：在 `src/types/resume.ts` 中定义 `interface PersonalInfo`，保留 `avatarUrl: string`。
- 验证：`npm run build`

### Step 3：[DONE] 定义简历模块模型
- **scope: auto**
- 操作：在 `src/types/resume.ts` 中定义 `Education/Honor/Experience/Project/CampusActivity/SkillCategory/ResumeData`。
- 验证：`npm run build`

### Step 4：[DONE] 定义布局与模板枚举
- **scope: auto**
- 操作：在 `src/types/resume.ts` 中定义 `TemplateName`、`SectionKey`、`SectionEmphasis`、`DEFAULT_SECTION_ORDER`、`SECTION_LABELS`、`TEMPLATE_NAMES`。
- 验证：`npm run build`

---

## 模块 3：状态管理

### 概述
- 职责：集中管理简历数据、模板、语言、当前编辑区、模块顺序、模块展示状态。
- 前置依赖：模块 2
- 当前状态：已实现；v5 将补科研经历默认值、CRUD 与兼容迁移。

### Step 1：[DONE] 创建 Zustand store
- **scope: auto**
- 操作：在 `src/store/useResumeStore.ts` 中定义 `ResumeState` 与 `useResumeStore`。
- 验证：`npm run build`

### Step 2：[DONE] 实现个人信息与通用字段更新
- **scope: auto**
- 操作：在 `src/store/useResumeStore.ts` 中实现 `setField()` 与 `setPersonalInfo()`。
- 验证：`npm run build`

### Step 3：[DONE] 实现数组模块 CRUD action
- **scope: auto**
- 操作：在 `src/store/useResumeStore.ts` 中实现教育、荣誉、经历、项目、校园经历、技能的 add/update/remove action。
- 验证：`npm run build`

### Step 4：[DONE] 实现布局/语言/模板 action
- **scope: auto**
- 操作：在 `src/store/useResumeStore.ts` 中实现 `setTemplate()`、`setSectionOrder()`、`setEmphasis()`、`toggleSectionVisibility()`、`setActiveLanguage()`、`setActiveSection()`。
- 验证：`npm run build`

### Step 5：[DONE] 实现数据加载与持久化兼容
- **scope: auto**
- 操作：在 `src/store/useResumeStore.ts` 中实现 `loadResumeData()`、`loadDemoData()`、`resetResumeData()`、Zustand `persist.merge`。
- 验证：`npm run build`，浏览器刷新后数据保持。

---

## 模块 4：编辑器 UI

### 概述
- 职责：左侧分区表单，支持编辑简历各模块。
- 前置依赖：模块 2、模块 3
- 当前状态：已实现；v5 将新增科研经历表单入口，并补个人照片 URL 输入。

### Step 1：[DONE] 实现编辑器分区入口
- **scope: auto**
- 操作：在 `src/components/editor/SidebarEditor.tsx` 中实现 tab 切换与 section 渲染。
- 验证：点击所有 tab 均显示对应表单。

### Step 2：[DONE] 实现个人信息表单
- **scope: auto**
- 操作：在 `src/components/editor/PersonalInfoForm.tsx` 中实现个人信息输入。
- 变更说明：v5 将通过模块 11 Step 2 补 `avatarUrl` 输入，不改本步骤历史状态。
- 验证：修改字段后右侧预览实时更新。

### Step 3：[DONE] 实现教育经历表单
- **scope: auto**
- 操作：在 `src/components/editor/EducationForm.tsx` 中实现教育经历 CRUD 与字段输入。
- 验证：新增教育经历并填写课程后预览显示课程。

### Step 4：[DONE] 实现荣誉奖项表单
- **scope: auto**
- 操作：在 `src/components/editor/HonorForm.tsx` 中实现荣誉 CRUD 与字段输入。
- 验证：`npm run build`

### Step 5：[DONE] 实现实习经历表单
- **scope: auto**
- 操作：在 `src/components/editor/ExperienceForm.tsx` 中实现经历 CRUD、职责描述、`BilingualListInput` 工作亮点输入。
- 验证：新增实习经历并逐条填写中文/英文亮点后预览分条显示。

### Step 6：[DONE] 实现项目经历表单
- **scope: auto**
- 操作：在 `src/components/editor/ProjectForm.tsx` 中实现项目 CRUD、技术栈、描述、链接输入。
- 变更说明：v4 已通过模块 10 Step 3 增加项目亮点分条输入。
- 验证：`npm run build`

### Step 7：[DONE] 实现校园经历表单
- **scope: auto**
- 操作：在 `src/components/editor/CampusActivityForm.tsx` 中实现校园经历 CRUD、描述、`BilingualListInput` 亮点输入。
- 验证：新增校园经历并逐条填写中文/英文亮点后预览分条显示。

### Step 8：[DONE] 实现技能表单
- **scope: auto**
- 操作：在 `src/components/editor/SkillForm.tsx` 中实现技能分类与技能项输入。
- 验证：`npm run build`

### Step 9：[DONE] 新增通用逐项输入组件 TagInput
- **scope: auto**
- 操作：维护 `src/components/ui/TagInput.tsx`，用于 `string[]` 逐项编辑。
- 验证：课程、技能、技术栈可逐项新增/删除。

### Step 10：[DONE] 新增双语亮点逐项输入组件 BilingualListInput
- **scope: auto**
- 操作：维护 `src/components/ui/BilingualListInput.tsx`，用于 `BilingualText[]` 逐项编辑。
- 验证：实习/校园经历/项目经历亮点可逐条新增/删除。

### Step 11：[DONE] 新增模块展示控制组件 LayoutControls
- **scope: auto**
- 操作：维护 `src/components/editor/LayoutControls.tsx`，控制 section 显示/隐藏。
- 变更说明：v5 将通过模块 11 Step 4 将 `researchExperience` 加入控制列表。
- 验证：隐藏某模块后预览不显示该模块。

---

## 模块 5：简历预览与模板系统

### 概述
- 职责：渲染 A4 比例简历预览，支持 4 套模板、双语、模块顺序、模块隐藏。
- 前置依赖：模块 2、模块 3
- 当前状态：已实现；v5 将修改个人信息头部证件照位，并新增科研经历渲染。

### Step 1：[DONE] 实现预览容器
- **scope: auto**
- 操作：在 `src/components/preview/PreviewPanel.tsx` 中实现 dynamic import、`id="resume-preview"`、`resume-print-area`、A4 预览尺寸。
- 验证：`npm run build`

### Step 2：[DONE] 实现 Classic 模板
- **scope: auto**
- 操作：维护 `src/components/templates/ClassicTemplate.tsx`。
- 变更说明：v5 将通过模块 11 Step 5 增加矩形证件照位，通过模块 11 Step 6 增加科研经历渲染。
- 验证：选择 Classic 模板，所有非空模块显示。

### Step 3：[DONE] 实现 Modern 模板
- **scope: auto**
- 操作：维护 `src/components/templates/ModernTemplate.tsx`。
- 变更说明：v5 将通过模块 11 Step 5 将当前圆形头像改为矩形证件照位，通过模块 11 Step 6 增加科研经历渲染。
- 验证：选择 Modern 模板，左侧/右侧布局正常。

### Step 4：[DONE] 实现 Minimal 模板
- **scope: auto**
- 操作：维护 `src/components/templates/MinimalTemplate.tsx`。
- 变更说明：v5 将通过模块 11 Step 5 增加矩形证件照位，通过模块 11 Step 6 增加科研经历渲染。
- 验证：`npm run build`

### Step 5：[DONE] 实现 Compact 模板
- **scope: auto**
- 操作：维护 `src/components/templates/CompactTemplate.tsx`。
- 变更说明：v5 将通过模块 11 Step 5 增加矩形证件照位，通过模块 11 Step 6 增加科研经历渲染。
- 验证：`npm run build`

### Step 6：[DONE] 新增模板设计 token
- **scope: review**
- 操作：维护 `src/lib/templates/designTokens.ts`。
- 变更说明：v5 可在此增加 `photo` token，例如 `classic: { width: 76, height: 100 }`、`modern: { width: 72, height: 96 }`、`minimal: { width: 72, height: 96 }`、`compact: { width: 60, height: 80 }`。
- 验证：四套 Web 模板视觉无明显回退。

### Step 7：[DONE] 建立字段展示矩阵并落地到模板
- **scope: review**
- 操作：维护模板字段展示策略，确保已采集字段在模板中有明确展示/隐藏决策。
- 变更说明：v5 后字段矩阵应明确：`PersonalInfo.avatarUrl` 为证件照；`researchExperience` 为可选同级模块。
- 验证：项目链接、描述、亮点、证件照、科研经历等字段行为符合展示策略。

---

## 模块 6：导入导出

### 概述
- 职责：支持 JSON 导入导出、SVG 导出、浏览器打印 PDF 导出、实验性 React PDF 导出。
- 前置依赖：模块 2、模块 3、模块 5
- 当前状态：浏览器打印主链路已完成；v5 将补 JSON 科研经历兼容。

### Step 1：[DONE] 实现导出栏
- **scope: auto**
- 操作：在 `src/components/export/ExportBar.tsx` 中实现 PDF、打印、SVG、JSON、导入、示例、重置按钮。
- 验证：页面顶部导出栏按钮可见。

### Step 2：[DONE] 实现 JSON 导入导出
- **scope: auto**
- 操作：在 `src/lib/export/json.ts` 中实现 `exportToJSON()`、`importFromJSON()`、`downloadJSON()`、`mergeWithDefaults()`。
- 变更说明：v5 将通过模块 11 Step 7 为 `researchExperience[]` 增加默认兼容。
- 验证：导出 JSON 后重新导入，页面数据恢复且不崩溃。

### Step 3：[DONE] 实现 SVG 导出
- **scope: review**
- 操作：在 `src/lib/export/svg.ts` 中实现 SVG 字符串生成与下载。
- 验证：点击 SVG 后下载文件，SVG 文件可在浏览器打开。

### Step 4：[DONE] 实现 React PDF 导出
- **scope: review**
- 操作：在 `src/lib/export/pdf.tsx` 中实现 `createResumePDF()` 与四套 PDF 模板。
- 变更说明：v2 中此功能降级为实验能力，不再作为主导出链路；v5 不处理 React PDF 证件照/科研经历渲染，除非执行端发现当前 UI 仍暴露该入口。
- 验证：本轮不以 React PDF 视觉一致性作为验收目标。

### Step 5：[DONE] 实现浏览器打印导出页
- **scope: review**
- 操作：在 `src/app/export/page.tsx` 中实现打印导出页。
- 验证：以 Step 7 和 Step 11 验证为准。

### Step 6：[DONE] 切换导出栏主链路为浏览器打印
- **scope: review**
- 操作：修改 `src/components/export/ExportBar.tsx`，主按钮写入 `sessionStorage.setItem("resume-export-payload", JSON.stringify(payload))` 并打开 `/export`。
- 验证：点击主按钮后打开 `/export`，URL 不包含 `data=`。

### Step 7：[DONE] 改造 `/export` 为 sessionStorage 打印页
- **scope: review**
- 操作：修改 `src/app/export/page.tsx`，删除 query string 读取，改从 `sessionStorage` 读取 payload，渲染完成后调用 `window.print()`。
- 验证：从主页面点击导出时自动打开打印预览。

### Step 8：[DONE] 修正打印 CSS 使打印页与 Web 预览一致
- **scope: review**
- 操作：修改 `src/app/globals.css`，在 `@media print` 中明确 A4 尺寸、隐藏 `.no-print`、保留 `@page { size: A4; margin: 0; }`。
- 验证：Chrome 打印预览中选择 A4、边距无，简历版心不被裁切。

### Step 9：[DONE] 降级 React PDF 入口与文案
- **scope: auto**
- 操作：修改 `src/components/export/ExportBar.tsx`，隐藏或降级 React PDF 入口，删除未使用 import。
- 验证：`npm run lint && npm run build`

### Step 10：[DONE] 记录已修复问题
- **scope: auto**
- 操作：修改 `docs/issues.md`，追加 `[Fixed] I-4-browser-print-mainline — 2026-05-02`；补建 `docs/report.md`。
- 验证：`docs/issues.md` 包含 fixed 记录，`docs/report.md` 存在并包含 STATUS。

### Step 11：[DONE] 为 `/export` sessionStorage payload 增加 shape guard
- **scope: auto**
- 变更说明：v3 新增；对应审计 M-2。
- 操作：维护 `src/app/export/page.tsx` 中的 `isRecord()`、`isTemplateName()`、`isLanguage()`、`isSectionOrder()`、`isPrintPayload()` 与错误态。
- 验证：
  - `npm run build`
  - 直接访问 `/export` 显示错误态。
  - 手动写入损坏 payload 后访问 `/export`，不崩溃、不进入无限 loading。

---

## 模块 7：国际化

### 概述
- 职责：提供编辑器、导出栏、运行控制文案的中英文词典。
- 前置依赖：模块 1
- 当前状态：基础已实现；v5 将新增个人照片与科研经历文案。

### Step 1：[DONE] 实现词典文件
- **scope: auto**
- 操作：维护 `src/lib/i18n/zh.ts` 与 `src/lib/i18n/en.ts`。
- 变更说明：v5 将通过模块 11 Step 8 补 `sections.researchExperience`、`personalInfo.avatarUrl`、`research.*` 等 key。
- 验证：`npm run build`

### Step 2：[DONE] 实现翻译函数
- **scope: auto**
- 操作：维护 `src/lib/i18n/index.ts`。
- 验证：点击语言按钮后导出栏/编辑器文案与当前语言一致；`npm run build`。

### Step 3：[DONE] 补齐导出反馈与运行控制 i18n key
- **scope: auto**
- 变更说明：v3 新增；对应审计 L-1，并为模块 9 提供按钮文案。
- 操作：维护 `src/lib/i18n/zh.ts`、`src/lib/i18n/en.ts`、`src/components/export/ExportBar.tsx`。
- 验证：切换中英文后触发导出/导入错误反馈，文案语言一致。

---

## 模块 8：视觉测试

### 概述
- 职责：验证模板在不同语言/模板下的视觉一致性，以及导出主链路和本地运行控制入口可用性。
- 前置依赖：模块 1、模块 5、模块 6、模块 9、模块 10、模块 11
- 当前状态：视觉 snapshot 已重建；v3 遗留 popup timeout 与 baseline diff；v5 需要补证件照与科研经历验收。

### Step 1：[DONE] 配置 Playwright 基础环境
- **scope: auto**
- 操作：维护 `playwright.config.ts`。
- 验证：`npx playwright test --list`

### Step 2：[DONE] 重建视觉测试文件
- **scope: review**
- 操作：维护 `tests/visual.spec.ts`，覆盖 4 模板 × 中英文 snapshot。
- 验证：`npm run test:visual`

### Step 3：[DONE] 新增 PDF 下载验收测试
- **scope: review**
- 操作：历史步骤，当前测试验证 `@react-pdf/renderer` 下载。
- 变更说明：v2 中该验收方向废弃，以 Step 5 替代。
- 验证：本轮不再要求以原生 PDF 下载作为主验收。

### Step 4：[DONE] 新增模块隐藏验收测试
- **scope: auto**
- 操作：维护 `tests/visual.spec.ts` 中模块隐藏测试。
- 变更说明：v5 后模块隐藏测试应覆盖 `researchExperience`。
- 验证：隐藏校园经历/科研经历后预览不包含对应文本。

### Step 5：[DONE] 改造导出验收测试为浏览器打印主链路
- **scope: review**
- 操作：修改 `tests/visual.spec.ts`，新增 `/export` clean URL、`#resume-preview` 可见、无 payload 错误态测试。
- 验证：以 Step 6 修复后的 `npm run test:visual` 为准。

### Step 6：稳定 popup print mock 并补充本轮测试
- **scope: review**
- 变更说明：v3 新增；对应审计 M-1，并覆盖模块 9 的 UI 行为；v5 继续保留为待执行，因为 report 显示 popup timeout。
- 操作：
  - 修改 `tests/visual.spec.ts`。
  - 将 popup 创建前的 print mock 放到 `page.context().addInitScript()`。
  - `print export opens clean export page` 不要依赖容易丢失的自定义事件时序；必须断言 `#resume-preview` 可见。
  - 保留 `export page with invalid payload shows error`。
  - 保留 `shutdown button calls local shutdown endpoint`，通过 `page.route("**/api/runtime/shutdown", ...)` mock，不允许真的杀 Playwright webServer。
  - 新增科研经历显示/隐藏断言：创建或加载包含科研经历的 demo，断言预览有 `researchExperience` 文本，隐藏后消失。
  - 新增证件照占位断言：四套模板在 `avatarUrl` 为空时仍存在固定尺寸 photo slot，在有 URL 时 `<img>` 可见。
- 验证：
  - 不手动启动 dev server，直接运行 `npm run test:visual`。
  - `npm run build`。

---

## 模块 9：本地后台进程控制

### 概述
- 职责：确认并显式控制本地开发后台进程关闭行为。提供网页端按钮，请求本地 Next.js API route 在响应后退出 Node 进程。
- 前置依赖：模块 1、模块 7
- 当前状态：v3 已主要实现；manual QA 通过；lint 问题保留为后续独立修复。
- 非目标：
  - 不在生产环境暴露远程关闭服务接口。
  - 不实现关闭标签页自动关闭后台。
  - 不处理除当前 Next.js Node 进程之外的外部进程树。

### Step 1：[DONE] 确认关闭网页不会同步关闭后台进程
- **scope: auto**
- 操作：启动 `npm run dev`，关闭浏览器标签页后用 `curl -I http://localhost:3001` 验证服务仍有响应，并记录 `docs/issues.md`。
- 验证：关闭网页后服务仍响应。

### Step 2：[DONE] 新增本地开发关闭后台 API route
- **scope: review**
- 操作：维护 `src/app/api/runtime/shutdown/route.ts`。
- 关键约束：
  - 仅 `process.env.NODE_ENV === "development"` 可用。
  - 仅接受 `POST`。
  - 必须校验内部 header，例如 `x-resume-runtime-action: shutdown`。
  - 响应返回后再调用 `process.exit(0)`，避免请求被截断。
- 验证：
  - 开发环境 POST 后 dev server 退出。
  - 非开发环境返回不可用，不退出进程。

### Step 3：[DONE] 新增关闭后台按钮并挂载到导出栏
- **scope: auto**
- 操作：维护 `src/components/runtime/ShutdownButton.tsx`、`src/lib/runtime/shutdown.ts`，并在 `src/components/export/ExportBar.tsx` 挂载按钮。
- 关键约束：
  - 按钮只在开发环境显示或生产环境保持 disabled/hidden。
  - 点击前必须有用户确认，避免误关服务。
  - 请求失败时给出可理解错误反馈。
- 验证：本地开发环境点击按钮后服务关闭；生产构建不暴露危险能力。

### Step 4：[DONE] 补齐关闭后台文案与手动 QA
- **scope: auto**
- 操作：维护 `src/lib/i18n/zh.ts`、`src/lib/i18n/en.ts` 中 runtime shutdown 相关 key；更新 `docs/report.md` manual QA 记录。
- 验证：中英文切换时关闭后台按钮文案一致，manual QA 记录存在。

### Step 5：修复 ShutdownButton Hooks 条件调用 lint
- **scope: auto**
- 变更说明：v4 report 遗留；不属于 v5 功能主线，保留为后续独立修复。
- 操作：
  - 修改 `src/components/runtime/ShutdownButton.tsx`。
  - 所有 React Hooks 必须在组件顶层无条件调用。
  - 环境判断只能影响 render return 或按钮 disabled，不允许包裹 Hook 调用。
- 验证：`npm run lint && npm run build`

---

## 模块 10：项目经历分条亮点改造

### 概述
- 职责：将项目经历从单段描述扩展为“项目概述 + 分条亮点”的双语输入与模板渲染。
- 前置依赖：模块 2、模块 3、模块 4、模块 5、模块 6、模块 7、模块 8
- 当前状态：v4 已实现并经手动 QA 通过。

### Step 1：[DONE] 扩展 Project 模型与 demo data
- **scope: auto**
- 操作：
  - 在 `src/types/resume.ts` 的 `Project` 中新增 `highlights: BilingualText[]`。
  - 在 `src/lib/demoData.ts` 的每个 demo project 中补 2 条中英文亮点。
- 验证：`npm run build`

### Step 2：[DONE] 补 Store 与 JSON 兼容
- **scope: auto**
- 操作：
  - 在 `src/store/useResumeStore.ts` 的 `addProject()`、`loadResumeData()`、`persist.merge` 三处补 `highlights: proj?.highlights ?? []` 或 `p.highlights || []`。
  - 在 `src/lib/export/json.ts` 的 `mergeWithDefaults()` 中为 `projects[].highlights` 补默认 `[]`。
- 验证：导入缺失 `projects[].highlights` 的旧 JSON 不崩溃，项目亮点默认空数组。

### Step 3：[DONE] 修改 ProjectForm 分条输入
- **scope: auto**
- 操作：
  - 修改 `src/components/editor/ProjectForm.tsx`，复用 `BilingualListInput` 编辑 `project.highlights`。
  - 保留 `description.zh/en` 文本域作为项目概述。
  - 修改 `src/lib/i18n/zh.ts`、`src/lib/i18n/en.ts`，新增 `projects.highlights` / `projects.addHighlight`。
- 验证：新增项目经历后可逐条添加/删除中英文亮点。

### Step 4：[DONE] 四套模板渲染项目亮点
- **scope: auto**
- 操作：
  - 修改 `src/components/templates/ClassicTemplate.tsx`、`ModernTemplate.tsx`、`MinimalTemplate.tsx`、`CompactTemplate.tsx`。
  - 在 `renderProjects()` 中保留 `description` 段落，并在其后渲染 `proj.highlights` 为 `<ul><li>`。
  - 样式对齐 `renderExperience()` 与 `renderCampusActivities()` 的亮点列表。
- 验证：四套模板在中英文下均显示项目亮点 bullet list。

### Step 5：[DONE] 记录问题修复与手动验收
- **scope: auto**
- 操作：
  - 修改 `docs/issues.md`，追加 `[Fixed] I-6-project-description-bullets — 2026-05-05`。
  - 更新 `docs/report.md`，记录 v4 手动验收结论。
- 验证：`docs/report.md` 为 `STATUS: ACCEPTED_MANUAL_QA`，且记录 build 通过、lint/visual 遗留不阻断。

---

## 模块 11：证件照模板位与科研经历模块

### 概述
- 职责：
  - 为四套模板统一预留个人证件照空间，复用 `PersonalInfo.avatarUrl`。
  - 新增与教育背景等同级的可选 section：科研经历。
  - 完整接入类型、store、JSON、demo、编辑器、布局控制、四套模板、i18n 和验收。
- 前置依赖：模块 2、模块 3、模块 4、模块 5、模块 6、模块 7、模块 8、模块 10
- 当前状态：待执行
- 非目标：
  - 不实现图片上传、裁剪、压缩、本地文件读取。
  - 不处理 React PDF 实验导出模板。
  - 不将科研经历拆为论文 / 专利 / 课题多个子模块。
  - 不修复 v3 遗留 visual baseline diff，除非阻断本轮新增测试。

### Step 1：扩展核心类型与默认模块顺序
- **scope: auto**
- 变更说明：v5 新增；科研经历必须是顶层同级可选模块。
- 操作：
  - 修改 `src/types/resume.ts`。
  - 新增接口：
    ```ts
    export interface ResearchExperience {
      id: string;
      institution: BilingualText;
      project: BilingualText;
      role: BilingualText;
      period: string;
      description: BilingualText;
      highlights: BilingualText[];
    }
    ```
  - 将 `ResearchExperience` 加入 `ResumeData`：
    ```ts
    researchExperience: ResearchExperience[];
    ```
  - 将 `SectionKey` 扩展为包含 `'researchExperience'`。
  - 在 `DEFAULT_RESUME_DATA` 中新增 `researchExperience: []`。
  - 在 `DEFAULT_SECTION_ORDER` 中将 `'researchExperience'` 插入 `'education'` 后、`'honors'` 前：
    `personalInfo → education → researchExperience → honors → experience → projects → campusActivities → skills`。
  - 在 `SECTION_LABELS` 中新增：
    `{ zh: '科研经历', en: 'Research Experience' }`。
- 验证：`npm run build`

### Step 2：补个人信息表单的证件照 URL 输入
- **scope: auto**
- 变更说明：当前 `PersonalInfo` 已有 `avatarUrl`，但 `PersonalInfoForm` 未暴露输入。
- 操作：
  - 修改 `src/components/editor/PersonalInfoForm.tsx`。
  - 在 website 字段后、summary 字段前新增：
    - label：`t("personalInfo.avatarUrl")`
    - input `type="url"`
    - value：`info.avatarUrl`
    - onChange：`setPersonalInfo({ avatarUrl: e.target.value })`
    - placeholder：`https://example.com/photo.jpg`
  - 不新增图片上传控件。
- 验证：
  - 输入照片 URL 后右侧预览实时显示照片。
  - 清空照片 URL 后四套模板仍保留证件照占位。

### Step 3：新增科研经历 Store CRUD 与兼容归一化
- **scope: auto**
- 变更说明：科研经历必须具备与教育背景等数组模块同级的 add/update/remove 能力。
- 操作：
  - 修改 `src/store/useResumeStore.ts`。
  - import type 增加 `ResearchExperience`。
  - 在 `ResumeState` 中新增：
    ```ts
    addResearchExperience: (item?: Partial<ResumeData['researchExperience'][0]>) => void;
    updateResearchExperience: (id: string, updates: Partial<ResumeData['researchExperience'][0]>) => void;
    removeResearchExperience: (id: string) => void;
    ```
  - 在 store 实现中新增 CRUD：
    - `addResearchExperience()` 默认字段全部为空，`highlights: []`。
    - `updateResearchExperience()` 按 id merge。
    - `removeResearchExperience()` 按 id filter。
  - 在 `loadResumeData()` 中新增 `researchExperience` 归一化：
    - `id || uuidv4()`
    - `institution/project/role/description || { zh: '', en: '' }`
    - `period || ''`
    - `highlights || []`
  - 在 `persist.merge` 中同步新增同样归一化逻辑。
- 验证：
  - `npm run build`
  - 浏览器 localStorage 中旧数据不含 `researchExperience` 时页面不崩溃。
  - 新增科研经历后刷新页面数据保留。

### Step 4：新增科研经历编辑器入口与表单
- **scope: auto**
- 变更说明：科研经历表单应复用现有输入组件，不新增重复列表组件。
- 操作：
  - 新建 `src/components/editor/ResearchExperienceForm.tsx`。
  - 表单结构参考 `EducationForm.tsx` 与 `ExperienceForm.tsx`：
    - 顶部标题：`t("sections.researchExperience")`
    - 新增按钮：`addResearchExperience()`
    - 空状态：中文显示“暂无科研经历，点击上方按钮添加”；英文由 i18n key 控制或沿用现有空态风格。
    - 双语字段：
      - `institution.zh/en`：机构 / 实验室 / 学校
      - `project.zh/en`：课题 / 研究项目
      - `role.zh/en`：角色 / 职责
      - `description.zh/en`：研究概述
    - 普通字段：
      - `period`
    - 亮点列表：
      - 复用 `BilingualListInput` 编辑 `highlights`
  - 修改 `src/components/editor/SidebarEditor.tsx`：
    - import `ResearchExperienceForm`
    - `SECTIONS` 插入 `"researchExperience"`
    - `SECTION_ICONS.researchExperience = "🔬"`
    - `renderSection()` 增加 case `"researchExperience"`
  - 修改 `src/components/editor/LayoutControls.tsx`：
    - `CONTROLLABLE_SECTIONS` 插入 `"researchExperience"`，位置在 education 后、honors 前。
- 验证：
  - 点击科研经历 tab 能显示表单。
  - 新增 / 修改 / 删除科研经历后右侧预览实时更新。
  - 布局控制中可隐藏/显示科研经历。

### Step 5：统一四套模板证件照占位
- **scope: review**
- 变更说明：这是本轮视觉核心变更，必须保证四套模板都有稳定照片空间。
- 操作：
  - 优先在 `src/lib/templates/designTokens.ts` 新增证件照尺寸 token：
    ```ts
    photo: {
      classic: { width: 76, height: 100 },
      modern: { width: 72, height: 96 },
      minimal: { width: 72, height: 96 },
      compact: { width: 60, height: 80 },
    }
    ```
    如 token 文件结构不适合嵌套，也可在模板文件内定义局部常量，但四套尺寸必须集中、可读。
  - 修改 `src/components/templates/ClassicTemplate.tsx`：
    - `renderPersonalInfo()` 顶层由 center header 改为 flex header。
    - 左侧信息区保持姓名、title、contact、summary；右侧固定证件照 slot。
    - slot 无图时显示边框和 `language === "zh" ? "证件照" : "Photo"`。
  - 修改 `src/components/templates/ModernTemplate.tsx`：
    - 将当前圆形头像替换为矩形证件照 slot。
    - 保留 sidebar 位置，但不要再用姓名首字母圆形占位。
  - 修改 `src/components/templates/MinimalTemplate.tsx`：
    - 在个人信息头部右侧新增固定证件照 slot。
    - 不破坏 Minimal 的留白和线条风格。
  - 修改 `src/components/templates/CompactTemplate.tsx`：
    - 在紧凑头部右侧新增较小固定证件照 slot。
    - 若内容拥挤，优先压缩 contact 行距，不允许压缩照片到不可识别。
  - 每套模板新增局部 helper：
    ```tsx
    function PhotoSlot({ src, language, width, height }: { src: string; language: "zh" | "en"; width: number; height: number }) { ... }
    ```
    或抽取到 `src/components/templates/PhotoSlot.tsx`；若抽取组件，四套模板统一 import。
  - `<img>` 必须使用 `objectFit: "cover"`，外层必须 `overflow: "hidden"`。
- 验证：
  - `npm run build`
  - `avatarUrl` 为空时四套模板都有固定照片占位。
  - `avatarUrl` 有效时四套模板显示照片。
  - 证件照位不会遮挡姓名、联系方式、summary。

### Step 6：四套模板新增科研经历渲染
- **scope: review**
- 变更说明：科研经历必须遵守 `sectionOrder` 与 `emphasis.hidden`。
- 操作：
  - 修改 `src/components/templates/ClassicTemplate.tsx`、`ModernTemplate.tsx`、`MinimalTemplate.tsx`、`CompactTemplate.tsx`。
  - 每套模板新增 `renderResearchExperience()`。
  - 渲染规则：
    - `data.researchExperience.length === 0` 时返回 null。
    - section 标题：中文“科研经历”，英文“Research Experience”。
    - 每条记录标题行：
      - 主标题：`getText(item.project, language)`；为空时 fallback 到 `getText(item.institution, language)`。
      - 副信息：`getText(item.institution, language)`、`getText(item.role, language)`。
      - 时间：`item.period` 右对齐或模板原有时间位置。
    - `description` 作为段落显示。
    - `highlights` 使用 `<ul><li>` 分条显示，样式对齐当前实习/校园/项目亮点。
  - `sectionRenderers` / `mainRenderers` / `SECTION_LABELS` 等模板内局部映射必须加入 `researchExperience`。
  - `ModernTemplate` 的 `mainSections` 必须加入 `"researchExperience"`；科研经历不进入 sidebar。
- 验证：
  - 四套模板中科研经历出现在教育背景之后、荣誉奖项之前。
  - 拖动/调整 sectionOrder 后科研经历位置按顺序渲染。
  - 在 LayoutControls 隐藏科研经历后四套模板均不渲染该 section。

### Step 7：补 JSON 导入导出与 demo data
- **scope: auto**
- 变更说明：旧数据兼容是必须项，否则新增 section 会破坏导入链路。
- 操作：
  - 修改 `src/lib/export/json.ts`：
    - `mergeWithDefaults()` 返回对象中新增 `researchExperience`。
    - 对每条 item 执行与 store 一致的字段默认值归一化。
  - 修改 `src/lib/demoData.ts`：
    - 在 `DEMO_RESUME_DATA` 中新增 `researchExperience` 示例 1 条。
    - 示例必须含中英文 `institution/project/role/description` 与至少 2 条 `highlights`。
    - 示例内容避免太长，防止 A4 溢出。
- 验证：
  - 导出 JSON 后包含 `researchExperience`。
  - 导入缺失 `researchExperience` 的旧 JSON 不崩溃且默认为 `[]`。
  - 点击示例数据后四套模板能看到科研经历。

### Step 8：补 i18n 文案
- **scope: auto**
- 变更说明：新增表单字段不允许硬编码英文 key。
- 操作：
  - 修改 `src/lib/i18n/zh.ts` 与 `src/lib/i18n/en.ts`。
  - 至少新增：
    - `sections.researchExperience`
    - `personalInfo.avatarUrl`
    - `research.institutionZh`
    - `research.institutionEn`
    - `research.projectZh`
    - `research.projectEn`
    - `research.roleZh`
    - `research.roleEn`
    - `research.period`
    - `research.descriptionZh`
    - `research.descriptionEn`
    - `research.highlights`
    - `research.addHighlight`
    - `research.empty`
  - 若现有 i18n 结构不支持嵌套新增，则按当前文件风格添加等价 key，但表单必须通过 `t()` 读取。
- 验证：
  - `npm run build`
  - 切换中英文后，个人照片 URL、科研经历 tab、字段 label、空状态、亮点输入文案语言一致。

### Step 9：验收、记录与报告更新
- **scope: review**
- 变更说明：本轮至少手动 QA 必须覆盖四套模板照片位与科研经历全链路。
- 操作：
  - 修改 `docs/issues.md`：
    - 追加 `[Fixed] I-7-photo-slot-all-templates — 2026-05-06`
    - 追加 `[Fixed] I-8-research-experience-section — 2026-05-06`
  - 修改 `docs/report.md`：
    - `STATUS` 可根据实际结果设为 `ACCEPTED_MANUAL_QA` 或 `NEEDS_ESCALATION`。
    - `Last Execution` 写明来源 `dispatch:patch (v5)`。
    - `Completed` 列出模块 11 Step 1-9 的完成情况。
    - `Verification Results` 至少记录：
      - `npm run build`
      - 手动 QA：四套模板照片占位 / 照片 URL 渲染 / 科研经历新增修改删除 / 布局隐藏 / JSON 旧数据导入。
    - 旧 lint / visual 遗留若未修，继续列在 `Discovered Issues`，不得写成已修复。
  - 可选：若执行端顺手补充自动化测试，更新 `tests/visual.spec.ts` 并在报告中记录；否则不得声称自动化已覆盖。
- 验证：
  - `npm run build`
  - 手动 QA 完整通过。
  - `docs/report.md` 与实际验证结果一致。

---

## v5 变更对照

| 变更点 | 受影响文件 | 处理方式 | scope |
|---|---|---|---|
| 证件照 URL 输入 | `src/components/editor/PersonalInfoForm.tsx`, `src/lib/i18n/zh.ts`, `src/lib/i18n/en.ts` | 复用 `PersonalInfo.avatarUrl`，补表单输入 | auto |
| 四套模板证件照位 | `ClassicTemplate.tsx`, `ModernTemplate.tsx`, `MinimalTemplate.tsx`, `CompactTemplate.tsx`, 可选 `PhotoSlot.tsx`, `designTokens.ts` | 固定矩形占位，有图渲染，无图保留 slot | review |
| 科研经历数据模型 | `src/types/resume.ts` | 新增 `ResearchExperience`、`ResumeData.researchExperience`、`SectionKey`、默认顺序、标签 | auto |
| 科研经历状态管理 | `src/store/useResumeStore.ts` | 新增 CRUD、load、persist.merge 兼容 | auto |
| 科研经历编辑器 | `ResearchExperienceForm.tsx`, `SidebarEditor.tsx`, `LayoutControls.tsx` | 新增 tab / 表单 / 可隐藏控制 | auto |
| 科研经历模板渲染 | 四套模板 | 新增 `renderResearchExperience()`，遵守 `sectionOrder` 与 `emphasis` | review |
| JSON / demo 兼容 | `src/lib/export/json.ts`, `src/lib/demoData.ts` | 旧数据补 `[]`，demo 增加示例 | auto |
| 验收记录 | `docs/issues.md`, `docs/report.md` | 记录 v5 fixed 与验证结果 | review |
