## 类型：patch

# Codex 任务派发

进入增量合并模式（patch）。本次任务只执行 `docs/plan-patch.md` 中列出的 UX、模板排版、一键 PDF 和视觉验收迭代；不要全量重做项目。

## 启动

1. 确认当前仓库根目录存在 `AGENTS.md`，并按其中项目规范执行。
2. 读取 `docs/plan.md`，作为当前 Web 版 MVP 基线。
3. 读取 `docs/progress.md`，确认哪些原步骤已经完成。
4. 读取 `docs/issues.md`，了解当前已知问题：
   - 视觉测试链路损坏
   - 分隔字段输入体验差
   - 模块展示控制缺 UI
   - Web/PDF 模板样式漂移
   - 部分字段填了但未展示
5. 读取 `docs/plan-patch.md`，本次只按该文件的“操作清单”执行。
6. 不读取或执行任何未在 `docs/plan-patch.md` 中点名的需求。

## 本次 patch 目标

完成以下 6 类变更：

1. 修复并重建视觉验收链路：
   - 删除损坏的 `tests/visual.test.js`
   - 新建 `tests/visual.spec.ts`
   - 默认使用 Playwright screenshot snapshot
   - 不再默认依赖 Applitools 或外部 API key

2. 改善表单易用性：
   - 新增 `src/components/ui/TagInput.tsx`
   - 新增 `src/components/ui/BilingualListInput.tsx`
   - 改造课程、技术栈、技能项、实习亮点、校园经历亮点输入

3. 增加模块展示控制：
   - 新增 `src/components/editor/LayoutControls.tsx`
   - 修改 `src/components/editor/SidebarEditor.tsx`
   - 修改 `src/store/useResumeStore.ts`，新增 `toggleSectionVisibility(section)`
   - 用户可隐藏/显示 `education/honors/experience/projects/campusActivities/skills`
   - `personalInfo` 不允许隐藏

4. 优化简历排版细节：
   - 新增 `src/lib/templates/designTokens.ts`
   - 新增 `src/lib/templates/fieldVisibility.ts`
   - 修改 4 个 Web 模板：
     - `src/components/templates/ClassicTemplate.tsx`
     - `src/components/templates/ModernTemplate.tsx`
     - `src/components/templates/MinimalTemplate.tsx`
     - `src/components/templates/CompactTemplate.tsx`
   - 统一横线颜色、粗细、间距、字号、模块 spacing
   - 确保非空字段都能展示，尤其是 `Project.link`

5. 同步 PDF 导出展示：
   - 修改 `src/lib/export/pdf.tsx`
   - PDF 模板使用同一套 `RESUME_TOKENS`
   - PDF 与 Web 模板遵守同一字段展示矩阵
   - PDF 尊重模块隐藏状态

6. 重构导出体验：
   - 修改 `src/components/export/ExportBar.tsx`
   - 主按钮改为“一键导出 PDF / Export PDF”
   - 继续使用 `@react-pdf/renderer` 生成并下载 PDF
   - 浏览器打印导出保留为 fallback
   - 修改 `src/app/export/page.tsx`，增强打印 fallback 的错误提示

## 执行规则

按 `docs/plan-patch.md` 中“操作清单”的顺序执行。

### [MODIFY] 标签

对每个 `[MODIFY]` 项：

1. 定位到 `docs/plan.md` 中对应原模块和 Step。
2. 检查 `docs/progress.md` 中该 Step 是否已完成。
3. 如果已完成：
   - 按 patch 的“修改后”内容修改对应代码。
   - 修改完成后运行该项列出的验证命令。
   - 验证通过后，在 `docs/progress.md` 对应 Step 行末追加：
     - `[MODIFIED] 2026-05-01`
4. 如果未完成：
   - 按 patch 的“修改后”版本作为新的实施依据。
   - 完成后在 `docs/progress.md` 标记为完成，并追加 `[MODIFIED] 2026-05-01`。
5. 不要修改未被 patch 点名的同模块其他功能。

### [ADD] 标签

对每个 `[ADD]` 项：

1. 按 patch 中指定文件名创建文件或新增测试。
2. 必须使用 patch 指定的组件名、函数名、props 名和导出方式。
3. 完成后运行该项列出的验证命令。
4. 验证通过后，在 `docs/progress.md` 对应模块下追加新 Step：
   - `[x] Step N：标题 [ADDED] 2026-05-01`
5. 如果新增 Step 属于新文件，确保 import 路径使用项目 alias `@/`。

### [DELETE] 标签

对每个 `[DELETE]` 项：

1. 按 patch 删除指定文件或旧逻辑。
2. 本次必须删除：
   - `tests/visual.test.js`
3. 删除后确认 Playwright 不再收集旧损坏测试。
4. `docs/progress.md` 中不要把视觉测试能力标为 removed，因为它被 `tests/visual.spec.ts` 替代。
5. 对原视觉测试 Step 标记：
   - `[MODIFIED] 2026-05-01`

### 通用规则

- 每完成一个 `[MODIFY] / [ADD] / [DELETE]` 项，立即运行该项验证命令。
- 验证通过后再进入下一项。
- 验证失败时自行诊断并修复，最多重试 2 次。
- 2 次后仍失败：停止执行，把失败原因记录到 `docs/issues.md`，并报告阻塞。
- 每处理完一个操作项，立即更新 `docs/progress.md`。
- 不重跑 `docs/plan.md` 中未被 patch 涉及的步骤。
- 不引入后端服务。
- 不实现微信小程序迁移。
- 不修改 `ResumeData` 的现有数据结构。
- 不把 Applitools 重新作为必需依赖。
- 不删除浏览器打印导出，只把它降级为 fallback。
- 不让 `personalInfo` 被隐藏。

## 推荐执行顺序

严格按以下顺序处理，避免视觉快照建立在不稳定代码上：

1. `[MODIFY] 模块 8 — Step 2：维护视觉测试文件`
2. `[DELETE] 模块 8 — Step 2：移除旧 Applitools 强依赖测试`
3. `[MODIFY] 模块 1 — Step 1：配置项目脚本与依赖`
4. `[ADD] 模块 4 — Step 9：新增通用逐项输入组件 TagInput`
5. `[MODIFY] 模块 4 — Step 3：实现教育经历表单`
6. `[MODIFY] 模块 4 — Step 6：实现项目经历表单`
7. `[MODIFY] 模块 4 — Step 8：实现技能表单`
8. `[ADD] 模块 4 — Step 10：新增双语亮点逐项输入组件 BilingualListInput`
9. `[MODIFY] 模块 4 — Step 5：实现实习经历表单`
10. `[MODIFY] 模块 4 — Step 7：实现校园经历表单`
11. `[MODIFY] 模块 3 — Step 4：实现布局/语言/模板 action`
12. `[ADD] 模块 4 — Step 11：新增模块展示控制组件 LayoutControls`
13. `[MODIFY] 模块 4 — Step 1：实现编辑器分区入口`
14. `[ADD] 模块 5 — Step 6：新增模板设计 token`
15. `[ADD] 模块 5 — Step 7：建立字段展示矩阵并落地到模板`
16. `[MODIFY] 模块 5 — Step 2：实现 Classic 模板`
17. `[MODIFY] 模块 5 — Step 3：实现 Modern 模板`
18. `[MODIFY] 模块 5 — Step 4：实现 Minimal 模板`
19. `[MODIFY] 模块 5 — Step 5：实现 Compact 模板`
20. `[MODIFY] 模块 6 — Step 4：实现 React PDF 导出`
21. `[MODIFY] 模块 7 — Step 1：实现词典文件`
22. `[MODIFY] 模块 7 — Step 2：实现翻译函数`
23. `[MODIFY] 模块 6 — Step 1：实现导出栏`
24. `[MODIFY] 模块 6 — Step 5：实现浏览器打印导出页`
25. `[ADD] 模块 8 — Step 3：新增 PDF 下载验收测试`
26. `[ADD] 模块 8 — Step 4：新增模块隐藏验收测试`

## 验证命令

每个小项按 patch 内命令执行。全部完成后必须执行以下总验证：

```bash
npm run lint
npm run build
npx playwright test --list
npm run test:visual:update
npm run test:visual
```

如果 `npm run test:visual:update` 生成快照文件，必须把快照文件加入提交。

## 视觉验收要求

完成后必须确认：

1. `tests/visual.spec.ts` 能稳定运行。
2. 4 个模板都有中文与英文截图。
3. `#resume-preview` 有独立截图。
4. 隐藏 `campusActivities` 后预览中不显示：
   - `校园经历`
   - `Campus Activities`
5. 一键 PDF 导出按钮能触发 download 事件。
6. 快照更新后再次运行 `npm run test:visual` 通过。

## 功能验收要求

完成后必须确认：

1. 教育课程是逐项输入，不再要求用户手写逗号。
2. 项目技术栈是逐项输入，不再要求用户手写逗号。
3. 技能项是逐项输入，不再要求用户手写逗号。
4. 实习亮点支持逐条中英文输入。
5. 校园经历亮点支持逐条中英文输入。
6. 左侧编辑器固定显示“展示设置 / Display”卡片。
7. 用户可隐藏以下模块：
   - education
   - honors
   - experience
   - projects
   - campusActivities
   - skills
8. `personalInfo` 不可隐藏。
9. 4 个 Web 模板都遵守模块隐藏状态。
10. 4 个 PDF 模板都遵守模块隐藏状态。
11. 4 个 Web 模板都展示非空 `Project.link`。
12. 4 个 PDF 模板都展示非空 `Project.link`。
13. Web/PDF 模板主要视觉参数来自 `src/lib/templates/designTokens.ts`。
14. 导出栏主按钮是“一键导出 PDF / Export PDF”。
15. 打印导出作为 fallback 保留。

## 仅以下情况停下

- 验证失败重试 2 次仍无法解决。
- patch 中指定文件不存在，且无法从当前仓库结构推断替代位置。
- 修改某个模板时发现需要改变 `ResumeData` 数据结构。
- 一键 PDF 导出因浏览器或 `@react-pdf/renderer` 限制无法触发 download。
- Playwright 快照在同一环境中连续两次运行不稳定。
- 需要新增后端服务、云服务、外部 API key 或微信小程序能力。
- 删除操作可能影响 patch 未覆盖的已部署功能。

## 禁止行为

- 不要全量重跑 `docs/plan.md` 中已完成的步骤。
- 不要在 patch 范围外顺手重构。
- 不要新增 AI 简历生成。
- 不要新增后端。
- 不要实现微信小程序。
- 不要改变 `ResumeData` 结构。
- 不要把 Applitools 作为默认必需依赖。
- 不要删除 `@react-pdf/renderer` PDF 导出。
- 不要删除浏览器打印 fallback。
- 不要让 Codex 自行选择其他视觉测试方案。
- 不要在没有验证命令通过的情况下更新 progress 为完成。

## 完成后输出

完成后输出报告，必须包含：

1. 处理过的 `[MODIFY] / [ADD] / [DELETE]` 列表。
2. 每项验证命令与结果。
3. `docs/progress.md` 更新摘要。
4. `docs/issues.md` 是否新增阻塞。
5. 新增/修改/删除文件列表。
6. 视觉快照文件列表。
7. 是否存在回归风险。
8. 一键 PDF 导出是否通过 download 测试。
9. 模块隐藏是否通过预览测试。

现在开始执行。
