# AGENTS.md

本文件用于约束后续 AI 在当前仓库中的工作方式，目标是减少无效扫描、避免放错位置，并保证修改风格一致。

## 1. 项目定位

- 项目名称：`vue-admin`
- 项目类型：后台管理前端
- 技术栈：`Vue 3 + TypeScript + Vite + Vue Router + Pinia + Tailwind CSS 4`
- 包管理器：`pnpm`
- 开发端口：`5000`

## 2. 开始工作前必须先了解的内容

AI 接到需求后，默认按以下顺序建立上下文：

1. 查看 `package.json`，确认脚本与依赖
2. 查看 `src/main.ts`，确认应用启动流程
3. 查看 `src/App.vue`，确认根组件承载方式
4. 查看 `vite.config.ts`，确认别名、端口、`base` 配置
5. 若需求涉及页面或路由，优先查看 `src/router/`、`src/layouts/`、`src/views/`
6. 若需求涉及登录态、用户信息、权限，优先查看 `src/store/modules/user.ts`
7. 若需求涉及环境变量，查看 `.env*` 与 `types/global.d.ts`

不要在没有必要的情况下全文扫描整个仓库。

## 3. 当前项目结构约定

```text
src/
  api/           接口请求层
  assets/        静态资源
  components/    通用组件
  directives/    自定义指令
  enums/         枚举常量
  hooks/         组合式 hooks
  layouts/       布局组件
  router/        路由定义
  store/         Pinia 状态管理
  styles/        全局样式
  utils/         工具函数
  views/         页面视图
types/
  *.d.ts         全局类型声明
public/
  公共静态资源
```

AI 必须遵循以下放置规则：

- 新增页面放到 `src/views/业务模块/`
- 新增路由模块放到 `src/router/routes/modules/`
- 新增 store 放到 `src/store/modules/`
- 新增 hooks 放到 `src/hooks/`
- 新增工具函数放到 `src/utils/`
- 新增接口封装放到 `src/api/`
- 新增全局类型或环境变量类型扩展放到 `types/`

不要把业务代码随意堆到根目录或与现有结构不一致的位置。

## 4. 入口与关键机制

### 应用入口

- `src/main.ts`
  - 创建应用
  - 注册全局样式
  - 注册 Pinia
  - 注册 Router
  - 挂载应用

### 根组件

- `src/App.vue`
  - 当前只承载 `<router-view />`
  - 布局切换主要由路由与布局组件控制

### 路由

- `src/router/index.ts`
  - 当前通过 `basicRoutes` 初始化路由
  - 提供 `resetRouter()`

- `src/router/routes/basic.ts`
  - 定义登录页、404 等基础路由
  - 使用 `import.meta.glob('./modules/**/*.ts', { eager: true })` 自动收集模块路由

### 状态管理

- `src/store/index.ts`
  - 统一注册 Pinia
  - 已启用 `pinia-plugin-persistedstate`

- `src/store/modules/user.ts`
  - 当前包含 `token`、`userInfo`
  - `$reset()` 仍未实现完整逻辑

## 5. 路由相关执行规范

涉及新增页面或菜单时，AI 默认按以下规则处理：

1. 优先在 `src/views/` 下新增页面组件
2. 再在 `src/router/routes/modules/` 下新增或修改模块路由
3. 如为后台页面，优先挂载到默认布局 `src/layouts/default/index.vue`
4. 如涉及未登录页或特殊页，再考虑放到基础路由体系

注意：

- 当前 `basicRoutes` 中主要是登录相关与 404
- `asyncRoutes` 已被收集，但具体是否动态注入，需要结合现有业务逻辑判断
- `RootRoute` 定义了 `/dashboard` 重定向，但当前未直接加入基础路由；如果需求涉及首页跳转，必须先确认现有实现

## 6. 状态管理执行规范

涉及用户态、登录态、权限时，优先从 `src/store/modules/user.ts` 扩展，不要重复创建含义重叠的 store。

执行时遵循：

- 能复用现有 `user` store 就不要新建同类状态
- 需要持久化时，补充 Pinia 持久化配置
- 需要重置登录态时，优先完善 `$reset()`
- 修改登录相关逻辑时，同时检查路由跳转和页面状态是否一致

## 7. 样式执行规范

- 全局样式入口为 `src/styles/main.css`
- 优先使用 Tailwind 工具类完成页面样式
- 公共样式、变量或全局覆盖放到 `src/styles/`
- 不要在多个页面复制同一类布局样式
- 不要随意引入新的 UI 框架，除非用户明确要求

## 8. 环境变量与类型规范

当前环境变量文件：

- `.env`
- `.env.development`
- `.env.production`
- `.env.test`

当前已声明环境变量类型位于 `types/global.d.ts`，包括：

- `VITE_APP_NAME`
- `VITE_BASE_URL`
- `VITE_API_BASE_URL`

执行规则：

- 新增环境变量时，必须同步更新对应 `.env.*`
- 新增环境变量时，必须同步更新 `types/global.d.ts`
- 不要在代码中硬编码本应来自环境变量的地址或开关

## 9. 修改代码时的默认原则

- 优先小步修改，尽量贴合现有结构
- 优先复用已有模块，不重复造轮子
- 尽量保持命名风格与现有代码一致
- 没有明确要求时，不做大规模重构
- 没有明确要求时，不随意调整无关文件
- 涉及多个模块时，先找现有入口再扩展，不要平铺新增一套并行体系

## 10. 接到需求后的推荐执行流程

### 页面需求

1. 确认页面应该归属哪个业务模块
2. 在 `src/views/业务模块/` 下新增或修改页面
3. 在 `src/router/routes/modules/` 中补路由
4. 如页面属于后台内容，确认其是否挂到默认布局
5. 检查页面样式是否优先使用 Tailwind

### 登录、权限、用户需求

1. 查看 `src/store/modules/user.ts`
2. 查看相关登录页面 `src/views/auth/`
3. 查看路由守卫或路由注册逻辑
4. 实现 token、用户信息、重置逻辑或跳转逻辑

### 接口需求

1. 优先查看 `src/api/` 是否已有相关模块
2. 没有则按业务模块补充接口封装
3. 补充类型，不要直接返回裸 `any`

## 11. 提交前检查

完成修改后，至少做一项有效校验，优先级如下：

1. `pnpm lint`
2. `pnpm build`
3. 如只是很小的静态调整，至少确认改动文件之间引用关系正确

如果没有运行校验，必须明确说明未验证。

## 12. 当前项目已知情况

- 项目基础框架已搭好
- 登录页与异常页已存在
- `router / layouts / store / views` 已完成基础拆分
- `src/api/` 目录已预留，但业务接口体系仍需逐步补充
- 用户状态管理已有雏形，但持久化与重置逻辑还不完整

因此后续需求大概率会集中在：

- 业务页面补充
- 模块路由补充
- 登录与权限流程完善
- 接口接入
- 后台框架能力补齐

## 13. 本文件维护规则

以下情况发生后，应同步更新本文件：

- 目录结构调整
- 路由组织方式调整
- 状态管理方案调整
- 环境变量约定调整
- 新增统一开发规范

如果后续还有更细的团队规范，可以继续拆分补充：

- `docs/project-structure.md`
- `docs/development-guide.md`
- `docs/api-conventions.md`
