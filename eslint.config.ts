// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'

export default [
  // 1. 忽略文件（建议放最前）
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '*.config.js',
      'package.json',
      'public/**',
      'types/*.d.ts', // 可选：忽略全局声明文件
    ],
  },

  // 2. 基础 JavaScript + 浏览器环境
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,vue}'],
    ...js.configs.recommended,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        // 如果用到 console 等，可保留；否则可设为 false
      },
    },
    rules: {
      'no-console': 'warn',
      'no-debugger': 'error',
      eqeqeq: ['error', 'always'], // 强制使用 ===
    },
  },

  // 3. TypeScript 规则
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,mts,cts,vue}'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'off', // Vue 中常用 !，可关闭
      '@typescript-eslint/consistent-type-imports': 'warn', // 推荐 type import
      '@typescript-eslint/no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true, // 允许 a && b() 这类短路表达式
          allowTernary: true, // 允许 a ? b : c 三元表达式
        },
      ],
      '@typescript-eslint/ban-ts-comment': 'off',
    },
  },

  // 4. Vue 3 规则
  ...pluginVue.configs['flat/essential'],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser, // 确保 <script setup lang="ts"> 被正确解析
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off', // 允许 App.vue
      'vue/attribute-hyphenation': 'warn',
      'vue/v-on-event-hyphenation': 'warn',
      'vue/no-setup-props-destructure': 'off', // Vue 3.5+ 允许解构 props
      'vue/html-self-closing': 'off', // 更宽松的自闭合标签
    },
  },

  // 5. Prettier 兼容（需已安装 eslint-config-prettier）
  {
    plugins: {
      // 如果你启用了 eslint-plugin-prettier，才需要这里配置
      // 否则只需确保它在 extends 最后（但 Flat Config 不支持 extends）
      // 所以更推荐：仅用 eslint-config-prettier 关闭冲突规则
    },
    rules: {
      // eslint-config-prettier 会自动覆盖冲突规则，无需手动写
      // 如果你没装它，请运行: pnpm add -D eslint-config-prettier
    },
  },
]
