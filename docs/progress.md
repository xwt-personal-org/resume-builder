# 开发进度（当前 Web 版基线）

## 当前状态
- 当前阶段：v6 patch - 模块 12：本地证件照上传、模块拖拽排序与科研经历显示修复
- 最后更新：2026-05-06
- 状态：模块 12 已完成，手动 QA 通过
- 说明：v6 在 v5 基线之上完成本地证件照上传/裁剪、展示设置拖拽排序、旧 sectionOrder 缺科研经历的归一化修复。

## 模块进度

### 模块 1：项目基础与运行配置
- [x] Step 1：配置项目脚本与依赖
- [x] Step 2：配置 Next.js App Router
- [x] Step 3：配置 Playwright
- [x] Step 4：修复 Playwright 自动启动 dev server [ADDED v3] [DONE]

### 模块 2：核心数据模型
- [x] Step 1：定义双语字段模型
- [x] Step 2：定义个人信息模型
- [x] Step 3：定义简历模块模型
- [x] Step 4：定义布局与模板枚举

### 模块 3：状态管理
- [x] Step 1：创建 Zustand store
- [x] Step 2：实现个人信息与通用字段更新
- [x] Step 3：实现数组模块 CRUD action
- [x] Step 4：实现布局/语言/模板 action
- [x] Step 5：实现数据加载与持久化兼容

### 模块 4：编辑器 UI
- [x] Step 1：实现编辑器分区入口
- [x] Step 2：实现个人信息表单
- [x] Step 3：实现教育经历表单
- [x] Step 4：实现荣誉奖项表单
- [x] Step 5：实现实习经历表单
- [x] Step 6：实现项目经历表单
- [x] Step 7：实现校园经历表单
- [x] Step 8：实现技能表单
- [x] Step 9：新增通用逐项输入组件 TagInput
- [x] Step 10：新增双语亮点逐项输入组件 BilingualListInput
- [x] Step 11：新增模块展示控制组件 LayoutControls

### 模块 5：简历预览与模板系统
- [x] Step 1：实现预览容器
- [x] Step 2：实现 Classic 模板
- [x] Step 3：实现 Modern 模板
- [x] Step 4：实现 Minimal 模板
- [x] Step 5：实现 Compact 模板
- [x] Step 6：新增模板设计 token
- [x] Step 7：建立字段展示矩阵并落地到模板

### 模块 6：导入导出
- [x] Step 1：实现导出栏
- [x] Step 2：实现 JSON 导入导出
- [x] Step 3：实现 SVG 导出
- [x] Step 4：实现 React PDF 导出
- [x] Step 5：实现浏览器打印导出页
- [x] Step 6：切换导出栏主链路为浏览器打印
- [x] Step 7：改造 `/export` 为 sessionStorage 打印页
- [x] Step 8：修正打印 CSS 使打印页与 Web 预览一致
- [x] Step 9：降级 React PDF 入口与文案
- [x] Step 10：记录已修复问题
- [x] Step 11：为 `/export` sessionStorage payload 增加 shape guard [ADDED v3] [DONE]

### 模块 7：国际化
- [x] Step 1：实现词典文件
- [x] Step 2：实现翻译函数
- [x] Step 3：补齐导出反馈与运行控制 i18n key [ADDED v3] [DONE]

### 模块 8：视觉测试
- [x] Step 1：配置 Playwright 基础环境
- [x] Step 2：重建视觉测试文件
- [x] Step 3：新增 PDF 下载验收测试
- [x] Step 4：新增模块隐藏验收测试
- [x] Step 5：改造导出验收测试为浏览器打印主链路
- [ ] Step 6：稳定 popup print mock 并补充本轮测试 [ADDED v3，v5 保留]

### 模块 9：本地后台进程控制
- [x] Step 1：确认关闭网页不会同步关闭后台进程 [DONE]
- [x] Step 2：新增 dev-only shutdown API route [DONE]
- [x] Step 3：新增网页端关闭后台按钮 [DONE]
- [x] Step 4：补齐关闭后台文案与手动 QA [DONE]
- [ ] Step 5：修复 ShutdownButton Hooks 条件调用 lint [v5 保留]

### 模块 10：项目经历分条亮点改造 [v4 已完成]
- [x] Step 1：扩展 Project 模型与 demo data [DONE]
- [x] Step 2：补 Store 与 JSON 兼容 [DONE]
- [x] Step 3：修改 ProjectForm 分条输入 [DONE]
- [x] Step 4：四套模板渲染项目亮点 [DONE]
- [x] Step 5：记录问题修复与手动验收 [DONE]

### 模块 11：证件照模板位与科研经历模块 [v5 新增]
- [x] Step 1：扩展核心类型与默认模块顺序 [DONE]
- [x] Step 2：补个人信息表单的证件照 URL 输入 [DONE]
- [x] Step 3：新增科研经历 Store CRUD 与兼容归一化 [DONE]
- [x] Step 4：新增科研经历编辑器入口与表单 [DONE]
- [x] Step 5：统一四套模板证件照占位 [DONE]
- [x] Step 6：四套模板新增科研经历渲染 [DONE]
- [x] Step 7：补 JSON 导入导出与 demo data [DONE]
- [x] Step 8：补 i18n 文案 [DONE]
- [x] Step 9：验收、记录与报告更新 [DONE]

### 模块 12：本地证件照上传、模块拖拽排序与科研经历显示修复 [v6 新增]
- [x] Step 1：新增 sectionOrder 归一化工具 [DONE]
- [x] Step 2：在 Store 与持久化入口接入 sectionOrder 归一化 [DONE]
- [x] Step 3：修复科研经历模板不显示 bug [DONE]
- [x] Step 4：展示设置支持拖动排序 [DONE]
- [x] Step 5：四套模板统一按 sectionOrder 渲染可控模块 [DONE]
- [x] Step 6：新增图片文件读取与校验工具 [DONE]
- [x] Step 7：实现本地图片裁剪组件 [DONE]
- [x] Step 8：接入 PersonalInfoForm 本地上传、裁剪与删除 [DONE]
- [x] Step 9：小幅放大四套模板证件照尺寸 [DONE]
- [x] Step 10：验收、记录与报告更新 [DONE]

## 已知问题摘要
- `npm run test:visual` 仍有模板截图 baseline diff（v3 遗留）。
- `print export opens clean export page` 仍 timeout，需要修复 popup 测试稳定性（v3 遗留）。
- `npm run lint` 仍有 `ShutdownButton.tsx` 条件 Hook 调用与 `src/lib/export/json.ts` 旧 `any` 问题（非本轮 scope）。
- 部分用户填写的信息在简历模板中未完整展示，例如项目链接。
- 关闭浏览器标签页不会自动停止 `npm run dev` 后台进程；已通过关闭后台按钮解决。
