import sortImports from './rules/sort-imports'
import sortNamedImports from './rules/sort-named-imports'

module.exports = {
  rules: {
    'sort-imports': sortImports,
    'sort-named-imports': sortNamedImports
  },
  configs: {
    recommended: {
      rules: {
        'codebox/sort-imports': 'error',
        'codebox/sort-named-imports': ['error', {
          importTypes: ['default', 'named', 'all', 'none'],
          groups: ['builtin', 'external', 'parent', 'sibling', ['index', 'unknown', 'absolute']],
          ignoreCase: true
        }]
      }
    }
  }
};
