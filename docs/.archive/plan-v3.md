# 开发计划（当前 Web 版基线）

## 元信息
- 项目：resume-builder
- 版本：v4
- 技术栈：Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + Zustand 5
- 当前目标：在 v3 浏览器打印导出与本地后台关闭能力基线之上，将“项目经历”的描述能力改造成与“实习经历 / 校园经历”一致的双语分条亮点输入与渲染。
- 本轮策略：
  - 不破坏现有 `description` 字段；继续作为项目概述/背景描述。
  - 新增 `Project.highlights: BilingualText[]`，作为项目经历分条亮点。
  - 所有旧 JSON / localStorage 数据缺失 `highlights` 时自动补 `[]`。
  - 项目表单复用现有 `BilingualListInput`，不再新增重复组件。
  - 四套模板统一渲染项目亮点 `<ul><li>`，样式跟实习经历/校园经历保持一致。
  - 本轮不做“自动把历史 description 文本拆成 bullets”的 NLP/启发式迁移，避免误切分用户内容。
- 总模块数：10
- 预计步骤总数：61
- 建议开发顺序：模块 8 Step 6 → 模块 10 Step 1 → 模块 10 Step 2 → 模块 10 Step 3 → 模块 10 Step 4 → 模块 10 Step 5
- 创建日期：2026-05-01
- 最后更新：2026-05-05

### 变更记录
| 版本 | 日期 | 变更摘要 |
|------|------|---------|
| v1 | 2026-05-01 | 补建当前 Web 版 MVP 基线 |
| v2 | 2026-05-02 | PDF 主链路改为浏览器打印；URL query payload 改为 sessionStorage；`@react-pdf` 降级；补打印导出测试 |
| v3 | 2026-05-02 | 修复 Playwright webServer / popup print mock / print payload guard；新增开发环境关闭后台进程按钮 |
| v4 | 2026-05-05 | 新增项目经历双语分条亮点字段、编辑表单、模板渲染、JSON 兼容与视觉验收 |

## Status
> 任何 agent 读到此区块即可恢复完整上下文。

- 当前阶段：模块 8：视觉测试 Step 6 + 模块 10：项目经历分条亮点改造 Step 1
- 整体进度：54 / 61 步骤完成
- 状态：变更后待执行
- 阻塞项：无
- 当前决策：
  - `@react-pdf/renderer` 仍不作为主 PDF 导出链路。
  - Playwright 视觉测试必须可自启动 dev server，`npm run test:visual` 必须成为可复现验收命令。
  - 关闭网页标签页不等价于关闭后台进程；只保留显式“关闭后台”按钮。
  - 关闭后台能力仅限本地开发环境，不能在生产环境暴露可远程杀进程的接口。
  - 项目经历新增 `highlights` 字段，不删除、不复用 `description` 承载多条 bullet。
  - 旧项目数据无 `highlights` 时统一归一化为 `[]`。

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
- v4 新需求：
  - 实习经历的工作亮点已经分条填写。
  - 项目经历的描述仍是一大段，需要调整为类似分条输入和分条渲染。

### Pending Decisions
- 是否在后续版本彻底删除 `src/lib/export/pdf.tsx` 与 `@react-pdf/renderer` 依赖：本轮不决定。
- 是否将 SVG 导出也改为浏览器/DOM 捕获路线：本轮不决定。
- 是否增加“关闭标签页时自动尝试关闭后台”的实验功能：本轮不做。
- 是否对历史 `projects[].description` 自动拆分为 `projects[].highlights`：本轮不做；由用户手动迁移内容，避免误拆。

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
- 当前状态：已实现；v4 将扩展 `Project` 字段。

### Step 1：[DONE] 定义双语字段模型
- **scope: auto**
- 操作：在 `src/types/resume.ts` 中定义 `interface BilingualText { zh: string; en: string }`。
- 验证：`npm run build`

### Step 2：[DONE] 定义个人信息模型
- **scope: auto**
- 操作：在 `src/types/resume.ts` 中定义 `interface PersonalInfo`。
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
- 当前状态：已实现；v4 将补项目亮点默认值与兼容迁移。

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
- 当前状态：已实现；v4 将修改项目经历表单。

### Step 1：[DONE] 实现编辑器分区入口
- **scope: auto**
- 操作：在 `src/components/editor/SidebarEditor.tsx` 中实现 tab 切换与 section 渲染。
- 验证：点击 7 个 tab 均显示对应表单。

### Step 2：[DONE] 实现个人信息表单
- **scope: auto**
- 操作：在 `src/components/editor/PersonalInfoForm.tsx` 中实现个人信息输入。
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
- 变更说明：v4 将通过模块 10 Step 3 增加项目亮点分条输入。
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
- 验证：实习/校园经历亮点可逐条新增/删除。

### Step 11：[DONE] 新增模块展示控制组件 LayoutControls
- **scope: auto**
- 操作：维护 `src/components/editor/LayoutControls.tsx`，控制 section 显示/隐藏。
- 验证：隐藏某模块后预览不显示该模块。

---

## 模块 5：简历预览与模板系统

### 概述
- 职责：渲染 A4 比例简历预览，支持 4 套模板、双语、模块顺序、模块隐藏。
- 前置依赖：模块 2、模块 3
- 当前状态：已实现；v4 将修改项目经历渲染。

### Step 1：[DONE] 实现预览容器
- **scope: auto**
- 操作：在 `src/components/preview/PreviewPanel.tsx` 中实现 dynamic import、`id="resume-preview"`、`resume-print-area`、A4 预览尺寸。
- 验证：`npm run build`

### Step 2：[DONE] 实现 Classic 模板
- **scope: auto**
- 操作：维护 `src/components/templates/ClassicTemplate.tsx`。
- 变更说明：v4 将通过模块 10 Step 4 增加项目亮点 `<ul>` 渲染。
- 验证：选择 Classic 模板，所有非空模块显示。

### Step 3：[DONE] 实现 Modern 模板
- **scope: auto**
- 操作：维护 `src/components/templates/ModernTemplate.tsx`。
- 变更说明：v4 将通过模块 10 Step 4 增加项目亮点 `<ul>` 渲染。
- 验证：选择 Modern 模板，左侧/右侧布局正常。

### Step 4：[DONE] 实现 Minimal 模板
- **scope: auto**
- 操作：维护 `src/components/templates/MinimalTemplate.tsx`。
- 变更说明：v4 将通过模块 10 Step 4 增加项目亮点 `<ul>` 渲染。
- 验证：`npm run build`

### Step 5：[DONE] 实现 Compact 模板
- **scope: auto**
- 操作：维护 `src/components/templates/CompactTemplate.tsx`。
- 变更说明：v4 将通过模块 10 Step 4 增加项目亮点 `<ul>` 渲染。
- 验证：`npm run build`

### Step 6：[DONE] 新增模板设计 token
- **scope: review**
- 操作：维护 `src/lib/templates/designTokens.ts`。
- 验证：四套 Web 模板视觉无明显回退。

### Step 7：[DONE] 建立字段展示矩阵并落地到模板
- **scope: review**
- 操作：维护模板字段展示策略，确保已采集字段在模板中有明确展示/隐藏决策。
- 变更说明：v4 后字段矩阵应明确：`Project.description` 为项目概述；`Project.highlights` 为项目分条成果。
- 验证：项目链接、描述、亮点等字段行为符合展示策略。

---

## 模块 6：导入导出

### 概述
- 职责：支持 JSON 导入导出、SVG 导出、浏览器打印 PDF 导出、实验性 React PDF 导出。
- 前置依赖：模块 2、模块 3、模块 5
- 当前状态：浏览器打印主链路已完成；v4 将补 JSON 项目亮点兼容。

### Step 1：[DONE] 实现导出栏
- **scope: auto**
- 操作：在 `src/components/export/ExportBar.tsx` 中实现 PDF、打印、SVG、JSON、导入、示例、重置按钮。
- 验证：页面顶部导出栏按钮可见。

### Step 2：[DONE] 实现 JSON 导入导出
- **scope: auto**
- 操作：在 `src/lib/export/json.ts` 中实现 `exportToJSON()`、`importFromJSON()`、`downloadJSON()`、`mergeWithDefaults()`。
- 变更说明：v4 将通过模块 10 Step 2 为 `projects[].highlights` 增加默认兼容。
- 验证：导出 JSON 后重新导入，页面数据恢复且不崩溃。

### Step 3：[DONE] 实现 SVG 导出
- **scope: review**
- 操作：在 `src/lib/export/svg.ts` 中实现 SVG 字符串生成与下载。
- 验证：点击 SVG 后下载文件，SVG 文件可在浏览器打开。

### Step 4：[DONE] 实现 React PDF 导出
- **scope: review**
- 操作：在 `src/lib/export/pdf.tsx` 中实现 `createResumePDF()` 与四套 PDF 模板。
- 变更说明：v2 中此功能降级为实验能力，不再作为主导出链路；v4 不处理 React PDF 项目亮点渲染，除非执行端发现当前 UI 仍暴露该入口。
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
- 当前状态：基础已实现；v4 将新增项目亮点文案。

### Step 1：[DONE] 实现词典文件
- **scope: auto**
- 操作：维护 `src/lib/i18n/zh.ts` 与 `src/lib/i18n/en.ts`。
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
- 前置依赖：模块 1、模块 5、模块 6、模块 9、模块 10
- 当前状态：视觉 snapshot 已重建；v3 遗留 popup timeout 与 baseline diff；v4 需要补项目亮点验收。

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
- 验证：隐藏校园经历后预览不包含对应文本。

### Step 5：[DONE] 改造导出验收测试为浏览器打印主链路
- **scope: review**
- 操作：修改 `tests/visual.spec.ts`，新增 `/export` clean URL、`#resume-preview` 可见、无 payload 错误态测试。
- 验证：以 Step 6 修复后的 `npm run test:visual` 为准。

### Step 6：稳定 popup print mock 并补充本轮测试
- **scope: review**
- 变更说明：v3 新增；对应审计 M-1，并覆盖模块 9 的 UI 行为；v4 继续保留为待执行，因为 report 显示 popup timeout。
- 操作：
  - 修改 `tests/visual.spec.ts`。
  - 将 popup 创建前的 print mock 放到 `page.context().addInitScript()`。
  - `print export opens clean export page` 不要依赖容易丢失的自定义事件时序；必须断言 `#resume-preview` 可见。
  - 保留 `export page with invalid payload shows error`。
  - 保留 `shutdown button calls local shutdown endpoint`，通过 `page.route("**/api/runtime/shutdown", ...)` mock，不允许真的杀 Playwright webServer。
- 验证：
  - 不手动启动 dev server，直接运行 `npm run test:visual`。
  - `npm run build`。

---

## 模块 9：本地后台进程控制

### 概述
- 职责：确认并显式控制本地开发后台进程关闭行为。提供网页端按钮，请求本地 Next.js API route 在响应后退出 Node 进程。
- 前置依赖：模块 1、模块 7
- 当前状态：v3 已主要实现；manual QA 通过。
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
  - 按钮只在开发环境显示或生产环境显示不可用态。
  - 点击前必须 `window.confirm(t("runtime.shutdownConfirm"))`。
  - 请求 `/api/runtime/shutdown` 使用 `POST` 与内部 header。
- 验证：点击按钮后出现确认弹窗；确认后请求本地 API。

### Step 4：[DONE] 手动 QA 并关闭 I-5 issue
- **scope: auto**
- 操作：修改 `docs/issues.md`，将 `I-5-local-dev-process-not-closed-by-browser` 标记为 `[Fixed]`，记录手动 QA 结果。
- 验证：`docs/issues.md` 包含 fixed 记录。

### Step 5：补齐运行控制视觉/集成验收
- **scope: review**
- 操作：在 `tests/visual.spec.ts` 中保留并修复 `shutdown button calls local shutdown endpoint`。
- 关键约束：测试必须 mock `/api/runtime/shutdown`，不能真的关闭 Playwright webServer。
- 验证：`npm run test:visual` 通过。

---

## 模块 10：项目经历分条亮点改造

### 概述
- 职责：让“项目经历”像“实习经历/校园经历”一样支持双语分条亮点输入、持久化、导入导出、预览和打印 PDF 渲染。
- 前置依赖：模块 2、模块 3、模块 4、模块 5、模块 6、模块 7、模块 8
- 当前状态：v4 新增
- 非目标：
  - 不删除 `Project.description`。
  - 不自动拆分历史 `description`。
  - 不改变技术栈 `tech: string[]` 的编辑方式。

### Step 1：扩展 Project 数据模型与示例数据
- **scope: auto**
- 变更说明：v4 新增。
- 操作：
  - 修改 `src/types/resume.ts`。
  - 在 `interface Project` 中新增字段：
    ```ts
    highlights: BilingualText[];
    ```
    推荐放在 `description` 后、`link` 前。
  - 修改 `src/lib/demoData.ts`。
  - 为每个 demo project 增加 `highlights` 数组，至少 2 条中英文示例：
    ```ts
    highlights: [
      { zh: "实现商品发布、搜索、即时聊天与交易管理核心流程", en: "Implemented core flows for item posting, search, real-time chat, and transaction management" },
      { zh: "优化校招简历场景下的多模板预览与导出体验", en: "Optimized multi-template preview and export experience for campus recruiting resumes" },
    ]
    ```
  - 保留原 `description`，只把它作为项目概述，不迁移、不清空。
- 验证：
  - `npm run build`
  - TypeScript 不再提示 `Project` 缺少 `highlights`。

### Step 2：补齐 store、JSON 导入导出与持久化兼容
- **scope: auto**
- 变更说明：v4 新增。
- 操作：
  - 修改 `src/store/useResumeStore.ts`。
  - 在 `addProject()` 默认对象中新增：
    ```ts
    highlights: proj?.highlights ?? []
    ```
  - 在 `loadResumeData()` 的 `projects` map 中新增：
    ```ts
    highlights: p.highlights || []
    ```
  - 在 Zustand `persist.merge` 的 `projects` map 中新增：
    ```ts
    highlights: p.highlights || []
    ```
  - 修改 `src/lib/export/json.ts`。
  - 在 `mergeWithDefaults()` 的 `projects` map 中新增：
    ```ts
    highlights: proj.highlights || []
    ```
  - 不改变 `exportToJSON()`；新增字段会自然被序列化。
- 验证：
  - `npm run build`
  - 导入不含 `projects[].highlights` 的旧 JSON，页面不崩溃，项目亮点为空数组。
  - 新增项目后导出 JSON，输出包含 `highlights` 字段。

### Step 3：改造 ProjectForm 为双语分条亮点输入
- **scope: auto**
- 变更说明：v4 新增。
- 操作：
  - 修改 `src/components/editor/ProjectForm.tsx`。
  - 新增 import：
    ```ts
    import { BilingualListInput } from "@/components/ui/BilingualListInput";
    ```
  - 在项目描述中文/英文 textarea 与链接输入之间插入：
    ```tsx
    <BilingualListInput
      label={t("projects.highlights")}
      value={proj.highlights}
      onChange={(highlights) => updateProject(proj.id, { highlights })}
      zhPlaceholder="例如：实现核心交易链路，支持 2000+ 注册用户"
      enPlaceholder="e.g. Implemented the core transaction flow for 2,000+ registered users"
      addButtonLabel={`+ ${t("projects.addHighlight")}`}
      emptyText="暂无项目亮点，点击添加一项"
    />
    ```
  - 修改 `src/lib/i18n/zh.ts`，在 `projects` 下新增：
    ```ts
    highlights: "项目亮点",
    addHighlight: "添加亮点",
    ```
  - 修改 `src/lib/i18n/en.ts`，在 `projects` 下新增：
    ```ts
    highlights: "Project Highlights",
    addHighlight: "Add highlight",
    ```
  - 保留 `descriptionZh` / `descriptionEn` 字段；不要改成数组字段。
- 验证：
  - `npm run lint`
  - `npm run build`
  - 打开“项目经历”，可以逐条新增/删除中文与英文亮点。
  - 切换语言后表单 label 使用对应语言。

### Step 4：四套模板渲染项目亮点 bullet list
- **scope: review**
- 变更说明：v4 新增。
- 操作：
  - 修改 `src/components/templates/ClassicTemplate.tsx`。
  - 修改 `src/components/templates/ModernTemplate.tsx`。
  - 修改 `src/components/templates/MinimalTemplate.tsx`。
  - 修改 `src/components/templates/CompactTemplate.tsx`。
  - 在每个模板的 `renderProjects()` 中，保留现有顺序：标题/角色/时间 → 链接 → 技术栈 → 描述。
  - 在项目描述后新增项目亮点列表：
    ```tsx
    {proj.highlights && proj.highlights.length > 0 && (
      <ul style={{ margin: "2px 0 0 0", paddingLeft: "14px", fontSize: "10.5px", color: C.textSecondary }}>
        {proj.highlights
          .map((h, i) => ({ text: getText(h), i }))
          .filter(({ text }) => text.trim())
          .map(({ text, i }) => <li key={i} style={{ lineHeight: 1.5 }}>{text}</li>)}
      </ul>
    )}
    ```
  - 具体字号、颜色、lineHeight 按各模板现有 `experience.highlights` 或 `campusActivities.highlights` 的样式复制，不新增全局 CSS。
  - 空数组、空字符串亮点不渲染 `<ul>` 或空 `<li>`。
- 验证：
  - `npm run build`
  - 四套模板下，项目经历亮点显示为 bullet list。
  - 点击“一键导出 PDF”打开 `/export` 后，打印页中项目亮点仍是 bullet list。

### Step 5：补充测试、快照与文档记录
- **scope: review**
- 变更说明：v4 新增。
- 操作：
  - 修改 `tests/visual.spec.ts`。
  - 增加或更新一条项目亮点验收：
    - 加载 demo data。
    - 切到“项目经历”。
    - 添加一条中文/英文项目亮点。
    - 断言右侧预览出现该亮点，并且属于项目经历区块。
  - 不要求测试 DOM tagName 必须是 `li`，但至少断言文本显示在预览和 `/export` 打印页中。
  - 若模板快照因项目亮点新增发生预期变化，执行：
    ```bash
    npm run test:visual:update
    ```
    并确认 diff 仅来自项目经历新增 bullet list，不包含无关布局漂移。
  - 修改 `docs/issues.md`，追加：
    ```md
    [Fixed] I-6-project-description-bullets — 2026-05-05
    项目经历已新增 `highlights: BilingualText[]`，支持像实习经历一样分条填写和导出渲染。
    ```
  - 修改 `docs/report.md`，在本轮完成后记录 v4 执行结果、测试命令与剩余问题。
- 验证：
  - `npm run lint`
  - `npm run build`
  - `npm run test:visual`
  - 手动 QA：项目经历新增 2 条中文/英文亮点后，Web 预览与 `/export` 打印页均分条显示；旧 JSON 导入不崩溃。
