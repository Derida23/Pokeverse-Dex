module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'initialize',
        'feat',
        'fix',
        'hotfix',
        'docs',
        'chore',
        'style',
        'refactor',
        'ci',
        'test',
        'revert',
        'perf',
        'build',
      ],
    ],
  },
}
