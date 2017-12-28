import ESLint from 'eslint'

const sortImportsRule = require('../../src/rules/sort-imports')

const ruleTester = new ESLint.RuleTester({
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
  },
})

ruleTester.run('codebox/sort-imports', sortImportsRule, {
  valid: [
    {
      code: `
        import fs from 'fs'
        import os from 'os'
        import redux from 'redux'
        a = 'c'
      `,
      options: [
        {
          importTypes: ['default', 'named', 'all', 'none'],
          groups: ['builtin', 'external', 'parent', 'sibling', ['index', 'unknown', 'absolute']],
          ignoreCase: true,
        },
      ],
    },
    {
      code: `
        import fs from 'fs'
        import os from 'os'
        import redux from 'redux'
        import zxc from 'zxc'
      `,
      options: [
        {
          importTypes: ['default', 'named', 'all', 'none'],
          groups: ['builtin', 'external', 'parent', 'sibling', ['index', 'unknown', 'absolute']],
          ignoreCase: true,
        },
      ],
    },
  ],
  invalid: [
    {
      code: `
        import DevTools from './modules/common/components/DevTools'
        import MainPage from './modules/main/MainPage'
        import React from 'react'
        import { BrowserRouter, Route } from 'react-router-dom'
        import { Provider } from 'react-redux'
      `,
      errors: [
        {
          message: `Imports './modules/common/components/DevTools' and 'react' should be swapped`,
        },
        { message: `Imports './modules/main/MainPage' and 'react-router-dom' should be swapped` },
        { message: `Imports 'react' and 'react-redux' should be swapped` },
      ],
      output: `
        import React from 'react'
        import { BrowserRouter, Route } from 'react-router-dom'
        import { Provider } from 'react-redux'
        import DevTools from './modules/common/components/DevTools'
        import MainPage from './modules/main/MainPage'
      `,
      options: [
        {
          importTypes: ['default', 'named', 'all', 'none'],
          groups: ['builtin', 'external', 'parent', 'sibling', ['index', 'unknown', 'absolute']],
          ignoreCase: true,
        },
      ],
    },
    {
      code: `
        import redux from 'redux'
        const a = 'b'
        fs.readFileSync('etcetera')
        import os from 'os'
        a()
        import fs from 'fs'
        b = 'c'
      `,
      errors: [{ message: `Imports 'redux' and 'fs' should be swapped` }],
      options: [
        {
          importTypes: ['default', 'named', 'all', 'none'],
          groups: ['builtin', 'external', 'parent', 'sibling', ['index', 'unknown', 'absolute']],
          ignoreCase: true,
        },
      ],
      output: `
        import fs from 'fs'
        const a = 'b'
        fs.readFileSync('etcetera')
        import os from 'os'
        a()
        import redux from 'redux'
        b = 'c'
      `,
    },
    {
      code: `
        import os from 'os'
        import redux from 'redux'
        import fs from 'fs'
      `,
      errors: [
        { message: `Imports 'os' and 'fs' should be swapped` },
        { message: `Imports 'fs' and 'redux' should be swapped` },
      ],
      options: [
        {
          importTypes: ['default', 'named', 'all', 'none'],
          groups: ['builtin', 'external', 'parent', 'sibling', ['index', 'unknown', 'absolute']],
          ignoreCase: true,
        },
      ],
      output: `
        import fs from 'fs'
        import os from 'os'
        import redux from 'redux'
      `,
    },
    {
      code: `
        import os from 'os'
        import zxc from 'zxc'
        import redux from 'redux'
        import fs from 'fs'
      `,
      errors: [
        { message: `Imports 'os' and 'fs' should be swapped` },
        { message: `Imports 'fs' and 'zxc' should be swapped` },
      ],
      options: [
        {
          importTypes: ['default', 'named', 'all', 'none'],
          groups: ['builtin', 'external', 'parent', 'sibling', ['index', 'unknown', 'absolute']],
          ignoreCase: true,
        },
      ],
    },
  ],
})
