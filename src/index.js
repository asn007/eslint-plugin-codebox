import sortImports from './rules/sort-imports'
import sortNamedImports from './rules/sort-named-imports'

export const rules = {
  'sort-imports': require('./rules/sort-imports'),
  'sort-named-imports': require('./rules/sort-imports'),
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
