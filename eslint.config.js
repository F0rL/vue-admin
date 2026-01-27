// eslint.config.js
// 使用 ESLint 扁平配置（Flat Config）—— 适用于 ESLint v8.23+
import pluginVue from 'eslint-plugin-vue'
import eslintPluginPrettier from 'eslint-plugin-prettier'
import globals from 'globals'

export default [
  // 1. 全局忽略规则
  {
    ignores: [
      'dist/', // 构建输出目录
      'node_modules/', // 依赖包
      'coverage/', // 测试覆盖率报告
      '*.config.*', // 配置文件自身（避免循环 lint）
      'pnpm-lock.yaml',
      'package-lock.json',
      'yarn.lock',
    ],
  },

  // 2. 基础共享配置：语法 + Prettier 集成
  // 应用于所有 JS/TS/Vue 文件
  {
    files: ['**/*.{js,ts,vue}'],
    languageOptions: {
      ecmaVersion: 2022, // 支持 ES2022 语法（如顶层 await）
      sourceType: 'module', // 强制使用 ES 模块（import/export）
    },
    plugins: {
      prettier: eslintPluginPrettier,
    },
    rules: {
      // 将 Prettier 的格式问题作为 ESLint 错误
      'prettier/prettier': 'error',
    },
  },

  // 3. Node.js 环境专用（构建脚本、配置文件）
  {
    files: ['*.config.{js,ts}', 'vite.config.{js,ts}', 'scripts/**/*.{js,ts}'],
    languageOptions: {
      // Node.js 环境可用的全局变量（process, __dirname, require...）
      globals: {
        ...globals.node,
        ...globals.es2021, // 包含 Promise, Map, Set 等
      },
    },
  },

  // 4. 浏览器环境专用（前端源码）
  {
    files: ['src/**/*.{js,ts,vue}'],
    languageOptions: {
      // 浏览器全局变量（window, document, localStorage...）
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
  },

  // 5. TypeScript 专用规则
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: import('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: true, // 自动查找 tsconfig.json（更健壮）
      },
    },
    plugins: {
      '@typescript-eslint': import('@typescript-eslint/eslint-plugin'),
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off', // 可根据团队要求设为 'warn' 或 'error'
      '@typescript-eslint/no-unused-expressions': 'error',
    },
  },

  // 6. Vue 单文件组件（SFC）规则
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: import('vue-eslint-parser'),
      parserOptions: {
        // 脚本部分使用 TypeScript 解析器
        parser: '@typescript-eslint/parser',
        ecmaVersion: 2022,
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      vue: pluginVue,
    },
    processor: pluginVue.processors['.vue'], // 必须：处理 .vue 文件结构
    rules: {
      // 合并 Vue 3 必要规则集
      ...pluginVue.configs['vue3-essential'].rules,
      // 允许单单词组件名（如 Home.vue），适合小型项目
      'vue/multi-word-component-names': 'off',
      // 可选：强制自闭合标签
      // 'vue/html-self-closing': ['error', { html: { void: 'always', normal: 'never', component: 'always' } }],
    },
  },
]
