module.exports = {
  rules: {
    // TODO: Add transpilation when need for it arises
    'sort-imports': require('./src/rules/sort-imports'), // eslint-disable-line
  },
  configs: {
    recommended: {
      rules: {
        'codebox/sort-imports': 'error',
      },
    },
  },
}
