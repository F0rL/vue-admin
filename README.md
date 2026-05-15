# vue-admin

基于 Vue 3 + TypeScript + Vite 的后台管理前端项目。

## 技术栈

| 类别 | 选型 |
| ---- | ---- |
| 框架 | Vue 3（`<script setup>` + Composition API） |
| 构建 | Vite（rolldown-vite） |
| 语言 | TypeScript（strict） |
| 路由 | Vue Router 4（HTML5 History 模式） |
| 状态管理 | Pinia（持久化：pinia-plugin-persistedstate） |
| UI 框架 | Element Plus |
| 图标 | Element Plus Icons（通过 CommonIcon 组件封装） |
| HTTP | Axios（自定义 HttpRequest 封装，支持请求去重、自动重试、Loading 管理） |
| 样式 | Tailwind CSS 4 |
| 图表 | ECharts 6 |
| 包管理 | pnpm |
| 代码检查 | ESLint（flat config）+ Prettier |

## 功能模块

- **仪表盘** — 统计概览页
- **系统管理** — 菜单管理、角色管理
- **用户认证** — 登录页、路由守卫自动拦截未登录请求
- **动态路由** — 根据用户菜单权限动态加载路由
- **反馈系统** — 全局消息提示、通知、确认对话框、Loading 等

## 快速开始

```bash
# 安装依赖
pnpm install

# 启动开发服务器（端口 5000）
pnpm dev

# 生产构建
pnpm build

# 预览生产构建
pnpm preview
```

| 命令 | 说明 |
| ---- | ---- |
| `pnpm dev` | 启动开发服务器（端口 5000） |
| `pnpm build` | 类型检查 + 生产构建 |
| `pnpm build:test` | 测试环境构建 |
| `pnpm preview` | 预览生产构建 |
| `pnpm typecheck` | TypeScript 类型检查 |
| `pnpm lint` | ESLint 检查 |
| `pnpm lint:fix` | ESLint 自动修复 |
| `pnpm format` | Prettier 格式化 |

## 项目结构

```text
src/
├── api/             接口请求层
├── assets/          静态资源
├── components/      通用组件
├── directives/      自定义指令
├── enums/           枚举常量
├── hooks/           组合式 hooks
├── layouts/         布局组件
├── plugins/         Vue 插件
├── router/          路由定义
│   └── routes/
│       ├── basic.ts         基础路由（登录页、404）
│       └── modules/         业务模块路由
├── store/           Pinia 状态管理
│   └── modules/
│       ├── user.ts          用户信息、token、权限、菜单树
│       └── app.ts           布局状态（侧边栏、图标模式）
├── styles/          全局样式
├── utils/           工具函数
└── views/           页面视图
    ├── auth/         登录页
    ├── dashboard/    仪表盘
    └── sys/          系统管理（菜单、角色）

types/                全局类型声明
```

## 环境变量

| 变量 | 说明 |
| ---- | ---- |
| `VITE_APP_NAME` | 应用名称 |
| `VITE_BASE_URL` | 路由 base URL（如 `/pc/`） |
| `VITE_API_BASE_URL` | API 基础地址 |

## 开发指南

- **新增页面**：在 `src/views/` 下创建页面组件 → 在 `src/router/routes/modules/` 下新增路由定义
- **新增 API**：在 `src/api/` 下按业务模块新建文件，补充请求和响应类型
- **图标使用**：优先使用 `<CommonIcon icon="el-xxx" />` 组件，图标名称统一使用 `el-` 前缀
- **样式**：优先使用 Tailwind 工具类
- 详情见 [CLAUDE.md](CLAUDE.md)
