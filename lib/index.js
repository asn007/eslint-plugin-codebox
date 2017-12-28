"use strict";

var _sortImports = _interopRequireDefault(require("./rules/sort-imports"));

var _sortNamedImports = _interopRequireDefault(require("./rules/sort-named-imports"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  rules: {
    'sort-imports': _sortImports.default,
    'sort-named-imports': _sortNamedImports.default
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