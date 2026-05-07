# 问题记录

> Codex 在执行中遇到 plan.md 未覆盖的情况时记录于此。本文件当前先记录补建基线时发现的已知问题。

## 已知问题

### I-1：视觉测试文件不可作为当前验收依据
- **位置**：`tests/visual.test.js`
- **类型**：测试链路 / 视觉验收
- **现象**：
  - 导入包名存在明显拼写错误。
  - Applitools 包名存在明显拼写错误。
  - 文件中存在语法错误。
  - 部分等待状态字符串拼写错误。
  - 测试路由假设与当前 App Router 页面结构不一致。
- **影响**：
  - `npm run test:visual` 大概率无法稳定执行。
  - 后续 UI/模板优化缺少可靠视觉回归基线。
- **建议处理**：
  - 在下一轮 `plan-patch.md` 中先重建 Playwright 截图测试。
  - 不依赖 Applitools 作为必需项，优先使用本地 screenshot snapshot 作为默认验收。
  - 覆盖 4 个模板 × 中英文 × 核心编辑器交互。

### I-2：分隔字段输入体验不佳
- **位置**：
  - `src/components/editor/EducationForm.tsx`
  - `src/components/editor/ProjectForm.tsx`
  - `src/components/editor/SkillForm.tsx`
  - 可能还包括经历/校园经历的 highlights 字段
- **类型**：UX / 数据输入
- **现象**：
  - 用户需要在单个 input 中用逗号分割多个字段。
  - 输入、删除、重排单项不直观。
- **影响**：
  - 用户容易输入错误分隔符。
  - Web 表单与简历中"竖线/点号/分隔符展示"的关系不直观。
- **建议处理**：
  - 新增通用 `TagInput` / `ListInput` 组件。
  - 每个条目作为独立 chip 或独立 input 行展示。
  - 内部仍保存为 `string[]`，保持数据模型兼容。

### I-3：模块展示控制缺少 UI
- **位置**：
  - `src/store/useResumeStore.ts`
  - `src/components/editor/SidebarEditor.tsx`
  - `src/components/templates/*Template.tsx`
- **类型**：UX / 布局控制
- **现象**：
  - store 已有 `setEmphasis` 和 `SectionEmphasis.hidden`。
  - 模板已部分读取 `emphasis.hidden`。
  - 用户没有可操作 UI 控制模块显示/隐藏。
- **影响**：
  - 用户填写了信息后，不能自行决定模块是否展示。
  - 部分"填了但不想显示"的情况无解。
- **建议处理**：
  - 新增 `LayoutControls` 组件。
  - 提供每个模块的显示/隐藏开关。
  - 不允许隐藏 `personalInfo`，除非产品明确允许。

### I-4：Web 模板与 PDF 模板样式双实现导致视觉漂移
- **位置**：`src/components/templates/*Template.tsx`、`src/lib/export/pdf.tsx`
- **类型**：视觉一致性 / 维护成本
- **现象**：Web 与 PDF 各自维护样式 token。
- **建议处理**：抽取共享设计 token。

### H-1：Playwright webServer [Fixed]
- **日期**：2026-05-03
- **类型**：测试基础设施
- **现象**：`npm run test:visual` 不自动启动 dev server。
- **修复**：在 `playwright.config.ts` 添加 `webServer`。
- **验证**：`npm run lint`、`npm run build` 通过。

### M-1：popup print mock [Fixed]
- **日期**：2026-05-03
- **类型**：测试稳定性
- **现象**：`window.print()` mock 作用域不可靠。
- **修复**：改为 `page.context().addInitScript()`。
- **验证**：测试结构已更新。

### M-2：print payload guard [Fixed]
- **日期**：2026-05-03
- **类型**：运行时健壮性
- **现象**：损坏 payload 会导致 export 页面异常。
- **修复**：在 `src/app/export/page.tsx` 增加 `isPrintPayload()` guard。
- **验证**：`npm run build` 通过。

### I-5：本地 dev shutdown button [Fixed]
- **日期**：2026-05-03
- **类型**：开发体验 / 运维控制
- **现象**：需要显式关闭本地后台进程的能力。
- **修复**：新增 `/api/runtime/shutdown` + `ShutdownButton`，仅开发环境可用。
- **验证**：`npm run build` 通过；手动验证"关闭后台"按钮能真正关闭 dev server（前端无连接确认）；关闭浏览器标签页不会自动杀后台。

### I-6-project-description-bullets：项目经历分条亮点改造 [Fixed]
- **日期**：2026-05-05
- **类型**：功能增强 / 数据模型
- **现象**：项目经历描述只有一段文本，不像实习/校园经历支持分条亮点。
- **修复**：新增 `Project.highlights: BilingualText[]` 字段；Store 全链路兼容（addProject/loadResumeData/persist.merge）；JSON 导入导出兼容（mergeWithDefaults）；ProjectForm 复用 BilingualListInput 组件；四套模板统一渲染项目亮点 `<ul>` bullet list。
- **验证**：`npm run lint`（仅 ShutdownButton 预存问题）、`npm run build` 通过。

### I-4-browser-print-mainline：PDF 主链路切换为浏览器打印 [Fixed]
- **日期**：2026-05-02
- **类型**：导出链路 / 架构决策
- **现象**：
  - 原 `@react-pdf/renderer` 导出与 Web 预览排版差异巨大。
  - 浏览器打印功能通过 URL query string 传递数据，URL 过长且不稳定。
  - `/export` 页未自动触发 `window.print()`。
- **修复**：
  - PDF 主按钮改为浏览器打印，通过 `sessionStorage` 传递 payload。
  - `/export` 页从 `sessionStorage` 读取数据，渲染后自动调用 `window.print()`。
  - React PDF 入口降级为实验功能或隐藏。
  - 打印 CSS 修正为 A4 尺寸 `210mm × 297mm`。
- **验证**：
  - 主按钮打开 `/export` 时 URL 不包含 `data=`。
  - `/export` 无 payload 时显示错误提示。
  - 打印预览与 Web 预览基本一致。

### I-5：部分已采集字段未在模板中完整展示
- **位置**：
  - `src/components/templates/*Template.tsx`
  - `src/lib/export/pdf.tsx`
- **类型**：功能完整性 / 用户预期
- **现象**：
  - 例如项目链接 `Project.link` 已在表单中采集，但部分模板未展示。
  - 教育/荣誉/项目/经历的 description/highlights 在不同模板中的展示策略不完全一致。
- **影响**：
  - 用户认为字段"填了没用"。
- **建议处理**：
  - 建立字段展示矩阵。
   - 每个模板明确展示哪些字段。
   - 提供模块/字段级显示控制或统一默认展示策略。

### I-7-photo-slot-all-templates：四套模板证件照占位 [Fixed]
- **日期**：2026-05-06
- **类型**：视觉 / 布局
- **现象**：四套模板缺少固定的个人证件照空间；Modern 模板使用圆形头像不符合证件照矩形规范。
- **修复**：
  - 在 `designTokens.ts` 新增 `photo` token（classic 76×100, modern 72×96, minimal 72×96, compact 60×80）。
  - 四套模板新增 `PhotoSlot` 组件：有图渲染 `<img>`（`objectFit: cover`），无图显示虚线边框占位。
  - Classic: 个人信息从 `textAlign:center` 改为 `display:flex` 左右布局。
  - Modern: 圆形头像替换为矩形证件照位。
  - Minimal/Compact: 个人信息头部右侧新增证件照 slot。
- **验证**：`npm run build` 通过。

### I-8-research-experience-section：新增科研经历可选模块 [Fixed]
- **日期**：2026-05-06
- **类型**：功能增强 / 数据模型
- **现象**：缺乏"科研经历"简历模块，无法展示学术研究成果。
- **修复**：
  - 新增 `ResearchExperience` 接口（institution/project/role/period/description/highlights）。
  - 扩展 `SectionKey`、`ResumeData`、`DEFAULT_RESUME_DATA`、`DEFAULT_SECTION_ORDER`、`SECTION_LABELS`。
  - Store 新增 CRUD + `loadResumeData`/`persist.merge` 归一化（缺失字段补 `[]`）。
  - JSON `mergeWithDefaults` 兼容旧数据导入。
  - 新建 `ResearchExperienceForm.tsx` 编辑器表单。
  - `SidebarEditor.tsx` 新增 `researchExperience` tab。
  - `LayoutControls.tsx` 新增可控制显示/隐藏。
  - 四套模板新增 `renderResearchExperience()`。
  - i18n 补齐 `research.*` key（中英文）。
  - demo 数据新增一条 PKU 计算机视觉实验室研究经历。
- **验证**：`npm run build` 通过。

### I-9-avatar-local-upload-crop：本地证件照上传与裁剪 [Fixed]
- **日期**：2026-05-06
- **类型**：功能增强 / 本地图片处理
- **现象**：证件照只能粘贴 URL，无法选择本地文件并输出固定比例证件照。
- **修复**：新增 `src/lib/image/avatarImage.ts`，使用 FileReader 读取 JPG/PNG/WebP，限制 5MB；新增 `ImageCropper`，支持 3:4 预览框、拖动平移、缩放和 canvas 输出 360x480 JPEG data URL；`PersonalInfoForm` 接入本地选择、裁剪确认、删除与预览，继续写入 `PersonalInfo.avatarUrl`。
- **验证**：`npm run build` 通过；Playwright 手动 QA 选择本地 PNG、拖动/缩放后确认，localStorage 中 `avatarUrl` 为 `data:image/jpeg;base64,...`，图片 natural size 为 360x480。

### I-10-layout-controls-drag-sort：展示设置拖拽排序 [Fixed]
- **日期**：2026-05-06
- **类型**：交互 / 布局控制
- **现象**：展示设置只能隐藏/显示模块，无法调整模块顺序。
- **修复**：`LayoutControls` 使用 `getControllableSectionOrder()` 渲染除 `personalInfo` 外的模块；每个模块卡片支持 HTML5 Drag and Drop，并保留上移/下移按钮；提交排序时调用 `setSectionOrder(["personalInfo", ...next])`。
- **验证**：`npm run build` 通过；Playwright 手动 QA 将“项目经历”拖到“教育背景”上方，预览中项目经历位于教育背景前，刷新后顺序保持。

### I-11-research-section-order-visibility：旧 sectionOrder 缺科研经历导致不渲染 [Fixed]
- **日期**：2026-05-06
- **类型**：兼容性 / 模板渲染
- **现象**：旧 localStorage / 旧导出 payload 的 `sectionOrder` 不含 `researchExperience` 时，展示设置中可看到科研经历，但模板不渲染。
- **修复**：新增统一 `normalizeSectionOrder()`；store 初始状态、`setSectionOrder()`、`persist.merge`、`PreviewPanel`、`/export` payload 读取与四套模板入口均接入归一化。旧默认顺序缺失 `researchExperience` 时按 `DEFAULT_SECTION_ORDER` 补回教育背景之后。
- **验证**：`npm run build` 通过；Playwright 手动 QA 构造旧 `sectionOrder`，刷新后 UI 顺序为教育背景、科研经历、荣誉奖项，科研经历在预览与 `/export` 中均渲染；隐藏/显示切换生效。
