// .eslintrc.cjs
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-essential', // 或 vue3-recommended / vue3-strongly-recommended
    'prettier', // 必须放在最后，以禁用与 Prettier 冲突的规则
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'vue'],
  rules: {
    // 可选：自定义规则
    // 例如：强制组件名使用 PascalCase
    'vue/multi-word-component-names': 'off', // 如果允许单个单词组件名（如 App.vue）
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-explicit-any': 'warn',
    'vue/attribute-hyphenation': 'warn',
    'vue/v-on-event-hyphenation': 'warn',
  },
  globals: {
    // 如果使用了全局变量（如 defineProps、defineEmits），可在此声明
    // 但通常 Vue 3 宏已在 vue-eslint-parser 中自动处理
  },
}
