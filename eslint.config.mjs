import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    rules: {
      'max-len': [
        'error',
        { code: 100, tabWidth: 2, comments: 100 },
      ],
      'vue/multi-word-component-names': 'off',
    },
    ignores: [
      '*.md',
      '.yarn/**/*',
      '.devcontainer/*.json',
      '.vscode/*.json',
      'commitlint.config.js',
    ],
  },
  {
    files: ['.yarn/**/*'],
    rules: {
      'eslint-comments/no-unlimited-disable': 'off',
    },
  },
)
