"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  meta: {
    docs: {
      description: 'enforce sorted members of named imports',
      category: 'ECMAScript 6',
      recommended: true
    },
    schema: [{
      type: 'object',
      properties: {
        ignoreCase: {
          type: 'boolean',
          default: true
        }
      },
      additionalProperties: false
    }],
    fixable: 'code'
  },

  create(context) {
    const sourceCode = context.getSourceCode();
    const config = context.options[0] || {};
    const ignoreCase = config.ignoreCase || true;
    return {
      ImportDeclaration(node) {
        const importSpecifiers = node.specifiers.filter(specifier => specifier.type === 'ImportSpecifier');
        const getSortableName = ignoreCase ? specifier => specifier.local.name.toLowerCase() : specifier => specifier.local.name;
        const firstUnsortedIndex = importSpecifiers.map(getSortableName).findIndex((name, index, array) => array[index - 1] > name);
        if (firstUnsortedIndex !== -1) context.report({
          node: importSpecifiers[firstUnsortedIndex],
          message: `Member '{{member}}' of the import declaration should be sorted alphabetically`,
          data: {
            member: importSpecifiers[firstUnsortedIndex].local.name
          },

          fix(fixer) {
            // Skip rearranging specifiers if there are comments
            if (importSpecifiers.some(specifier => sourceCode.getCommentsBefore(specifier).length || sourceCode.getCommentsAfter(specifier).length)) return null;
            return fixer.replaceTextRange([importSpecifiers[0].range[0], importSpecifiers[importSpecifiers.length - 1].range[1]], importSpecifiers.slice().sort((first, second) => getSortableName(first) > getSortableName(second) ? 1 : -1).reduce((sourceText, specifier, index) => {
              const textAfterSpecifier = index === importSpecifiers.length - 1 ? '' : sourceCode.getText().slice(importSpecifiers[index].range[1], importSpecifiers[index + 1].range[0]);
              return sourceText + sourceCode.getText(specifier) + textAfterSpecifier;
            }, ''));
          }

        });
      }

    };
  }

};
exports.default = _default;