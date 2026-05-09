# vue-admin — 项目开发指南

## 项目定位

后台管理前端项目，基于 Vue 3 + TypeScript + Vite 构建。

## 技术栈

| 类别 | 选型 |
|------|------|
| 框架 | Vue 3 (`<script setup>` + Composition API) |
| 构建 | Vite (rolldown-vite) |
| 语言 | TypeScript (strict) |
| 路由 | Vue Router 4 (HTML5 history) |
| 状态管理 | Pinia (with persistedstate) |
| UI 框架 | Element Plus |
| 图标 | Element Plus Icons（通过 CommonIcon 组件封装） |
| HTTP | Axios（自定义 HttpRequest 封装） |
| 样式 | Tailwind CSS 4 |
| 包管理 | pnpm |
| 代码检查 | ESLint (flat config) + Prettier |
| 开发端口 | 5000 |

## 目录结构

```
src/
  api/          接口请求层
  assets/       静态资源
  components/   通用组件
  directives/   自定义指令
  enums/        枚举常量
  hooks/        组合式 hooks
  layouts/      布局组件
  plugins/      Vue 插件
  router/       路由定义
  store/        Pinia 状态管理
  styles/       全局样式
  utils/        工具函数
  views/        页面视图
types/
  *.d.ts        全局类型声明
```

## 项目启动流程

1. 入口 `src/main.ts` → 创建 App → 注册全局 CommonIcon → setupStore → setupRouter → setupFeedback → mount
2. 根组件 `src/App.vue` 仅承载 `<router-view />`
3. 路由守卫自动判断登录态：未登录 → 登录页，已登录 → 动态加载菜单路由

## 关键模块说明

### 路由

- `src/router/routes/basic.ts` — 基础路由：登录页（`/auth`、`/auth/login`、`/auth/qrcode-login`）、404 兜底路由
- `src/router/routes/modules/` — 业务模块路由（通过 `import.meta.glob('./modules/**/*.ts', { eager: true })` 自动收集）
- 动态路由由用户菜单权限驱动，登录后根据 `menuTree` 过滤并注入
- 路由守卫（`src/router/index.ts`）核心流程：
  - **已登录 + 访问登录页** → 重定向至首页
  - **已登录 + token 存在但 menuTree 为空**（如刷新页面） → 重新获取菜单并添加路由
  - **已登录 + 路由未添加** → 添加动态路由，强制跳转至 `getRedirectPath()`
  - **未登录 + 白名单路由** → 放行
  - **未登录 + 其他页面** → 跳转至 `/auth/login?redirect=xxx`
- 白名单：`Auth`、`AuthLogin`、`AuthQrcodeLogin`、`EXCEPTION`、`Page_Not_Found`、`Root`
- 新增页面 → 先在 `src/views/` 下创建页面组件 → 再在 `src/router/routes/modules/` 下补充路由定义
- 路由元信息字段见**路由元信息**章节

### 状态管理

- `src/store/modules/user.ts` — 用户信息、token、权限、菜单树
- `src/store/modules/app.ts` — 布局状态（侧边栏显隐、图标模式）
- 持久化使用 `pinia-plugin-persistedstate`
- 涉及用户态、登录态、权限时，优先从 `user` store 扩展

### HTTP 请求

- 使用 `src/utils/http/` 中的 `HttpRequest` 类
- 自动注入 Bearer token
- 支持请求去重、自动重试、Loading 管理
- 401 自动跳转登录页
- 业务模块的 API 放在 `src/api/` 下，例如 `src/api/user.ts`

### 图标系统

- **优先使用 CommonIcon 组件**展示图标
- `CommonIcon` 是全局注册组件，无需额外导入
- 图标名称统一使用 `el-` 前缀：`el-User`、`el-Setting`、`el-Menu` 等
- 图标名称类型定义在 `src/components/CommonIcon/types.ts`
- 使用方式：`<CommonIcon icon="el-User" :size="16" />`
- 仅在 CommonIcon 无法满足需求时，才直接使用 Element Plus 的原生图标组件

### 反馈系统

- 通过 `src/plugins/feedback.ts` 注册全局反馈服务
- 使用 `useFeedback()` 或 `$feedback` 访问
- 提供 message、notification、confirm、alert、prompt、loading 等能力

### 样式规范

- 全局样式入口 `src/styles/main.css`
- 优先使用 Tailwind 工具类
- 公共样式变量放在 `src/styles/` 下
- 使用 Prettier 格式化，配置见 `prettier.config.js`（无分号、单引号、尾逗号 es5）

## 开发规范

### 新增页面

1. 在 `src/views/业务模块/` 下创建页面组件
2. 在 `src/router/routes/modules/` 下新增路由模块
3. 后台页面挂载到默认布局 `src/layouts/default/index.vue`

### 新增 API

1. 在 `src/api/` 下按业务模块新建文件
2. 补充请求和响应类型，不要返回裸 `any`
3. 示例见 `src/api/user.ts`

### 代码修改原则

- 优先复用已有模块，贴合现有结构
- 保持命名风格与现有代码一致
- 没有明确要求时不做大规模重构
- 涉及多个模块时，先找现有入口再扩展

## 可用脚本

```bash
pnpm dev            # 启动开发服务器（端口 5000）
pnpm build          # 类型检查 + 生产构建
pnpm build:test     # 测试环境构建
pnpm preview        # 预览生产构建
pnpm typecheck      # TypeScript 类型检查
pnpm lint           # ESLint 检查
pnpm lint:fix       # ESLint 自动修复
pnpm format         # Prettier 格式化
```

## 环境变量

| 变量 | 说明 |
|------|------|
| `VITE_APP_NAME` | 应用名称 |
| `VITE_BASE_URL` | 路由 base URL（如 `/pc/`） |
| `VITE_API_BASE_URL` | API 基础地址 |

新增环境变量时，需同步更新 `.env.*` 和 `types/global.d.ts`。

## 路由元信息（RouteMeta）

```typescript
interface RouteMeta {
  title: string       // 页面标题（必填）
  icon?: string       // 菜单图标
  hideBreadcrumb?: boolean  // 隐藏面包屑
  hideMenu?: boolean  // 隐藏菜单
}
```

## 已知项目状态

- 基础框架已搭好，登录页与异常页已存在
- 路由、布局、状态管理已完成基础拆分
- 用户状态管理已有雏形，持久化与重置逻辑待完善
- 业务页面和接口体系需逐步补充
