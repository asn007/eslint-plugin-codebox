import ESLint from 'eslint'
import sortNamedImportsRule from '../../src/rules/sort-named-imports'

const ruleTester = new ESLint.RuleTester({
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
  },
})

ruleTester.run('codebox/sort-named-imports', sortNamedImportsRule, {
  valid: [
    {
      code: `
        import { a, b, c } from 'fs'
      `,
      options: [{ ignoreCase: true }],
    },
  ],
  invalid: [
    {
      code: `
        import { b, a, c } from 'fs'
      `,
      errors: [{ message: `Member 'a' of the import declaration should be sorted alphabetically` }],
      options: [{ ignoreCase: true }],
      output: `
        import { a, b, c } from 'fs'
      `,
    },
  ],
})
