eslint-plugin-codebox
===

This is a plugin we use at CodeBox for some analysis rules and fixers that are missing in other plugins, namely

__codebox/sort-imports__ (fixable) - allows to sort imports in a variety of ways:

  1. Group imports by them being:
      * Node.js stdlib imports
      * External imports (imports from node_modules)
      * Imports from parent directory (i.e. ../../)
      * Sibling imports (./)
      * Imports of index file (./index', ./index.js)
      * Absolute imports (/root/whatever/somefile)
      * Undetected type imports (happens pretty rarely, but still)
  2. Group imports inside first group by them being:
      * Named imports (e.g. `import { foo } from 'bar'`)
      * Default imports (e.g. `import React from 'react'`)
      * Imports of the whole namespace (e.g. `imports * as foo from 'bar'`)
      * Imports, where none of the elements is added to namespace (e.g. `import './foo'`)
  3. And finally, sort the imports alphabetically

Moreover, this rule is fixable, which means, that ESLint will reorder your imports when you run `eslint --fix` automagically. Use this rule with caution, as it may break your code if it depends on the order of imports (tip: it should not)

__codebox/sort-named-imports__ (fixable) - allows to sort components inside named imports alphabetically, i.e.

Incorrect code for this rule:
```js
import { b, a } from 'foo'
```

Correct code:
```js
import { a, b } from 'foo'
```

WARNING:
===
This plugin is still in a very early stage of development. More features will be added in the upcoming time, if you still wish to use it:

```
npm install --saveDev eslint-plugin-codebox
```

Add to plugins sections of your .eslintrc:

```json
"plugins": [
  "codebox"
]
```

Configure the rules you want:
```js
module.exports = {
  "rules": {
    "codebox/sort-imports": ["error", {
      "groups": [
        "builtin",  // builtin dependencies go first
        "external", // then external dependencies
        "parent",   // then parent
        "sibling",  // ...ok, you got it
        "index",
        ["unknown", "absolute"] // An array inside array of groups means that these two groups share same priority for sorting
      ],
      "importTypes": [
        "default", // Default imports are at top of each group
        "named",   // After that - named imports
        "all",     // Imports of the whole namespace
        "none"     // Plain import
      ],
      "ignoreCase": true // Indicates whether we want to ignore case during alphabetical sorting
    }],
    "codebox/sort-named-imports": ["error", {
      "ignoreCase": true // Indicates whether we want to ignore case during alphabetical sorting
    }] 
  }
}
```
