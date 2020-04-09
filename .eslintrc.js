module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended',
    "cgps",
  ],
  // add your custom rules here
  rules: {
    "vue/no-use-v-if-with-v-for": 0,
    "import/no-extraneous-dependencies": 0,
  }
}
