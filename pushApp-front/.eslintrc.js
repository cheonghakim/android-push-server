module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@nuxtjs/eslint-config-typescript',
    'plugin:nuxt/recommended',
    'prettier',
  ],
  plugins: [],
  // add your custom rules here
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': 0,
    'nuxt/require-v-for-key': 0,
    'nuxt/no-side-effects-in-computed-properties': 0,
    'nuxt/no-use-v-if-with-v-for': 0,
    'nuxt/no-unused-components': 0,
  },
}
