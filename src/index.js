export const rules = {
  'sort-imports': require('./rules/sort-imports'),             // eslint-disable-line
  'sort-named-imports': require('./rules/sort-named-imports'), // eslint-disable-line
}

export const configs = {
  recommended: {
    rules: {
      'codebox/sort-imports': 'error',
      'codebox/sort-named-imports': [
        'error',
        {
          importTypes: ['default', 'named', 'all', 'none'],
          groups: ['builtin', 'external', 'parent', 'sibling', ['index', 'unknown', 'absolute']],
          ignoreCase: true,
        },
      ],
    },
  },
}
