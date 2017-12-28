import { NodeClassifier, compareNodes } from '../utils/nodes'
import isStaticRequire from '../utils/isStaticRequire'
import TranspositionManager from '../utils/TranspositionManager'

function rankImports(imports, ignoreCase) {
  return imports
    .map((imp, idx) => ({ ...imp, currentIdx: idx }))
    .sort((a, b) => compareNodes(a, b, ignoreCase))
    .map((imp, idx) => ({ ...imp, shouldBe: idx }))
    .sort((a, b) => a.currentIdx - b.currentIdx)
}

function createImportFix(context, imported) {
  return fixer => {
    const transpositionManager = new TranspositionManager(imported)
    const transpositions = []
    while (transpositionManager.canTranspose())
      transpositions.push(transpositionManager.transpose())
    const importRange = [imported[0].node.range[0], imported[imported.length - 1].node.range[1]]
    const sourceCode = context.getSourceCode()
    const importsIncludedSourceCut = sourceCode.text.slice(importRange[0], importRange[1])
    return fixer.replaceTextRange(
      importRange,
      transpositions.reduce(
        (previous, [{ node: firstNode }, { node: secondNode }]) =>
          previous
            .replace(sourceCode.getText(firstNode), sourceCode.getText(secondNode))
            .replace(sourceCode.getText(secondNode), sourceCode.getText(firstNode)),
        importsIncludedSourceCut
      )
    )
  }
}

function reportOutOfOrder(context, imported, outOfOrder, ignoreCase) {
  const detectedOutOfOrderImports = outOfOrder.slice()
  const reports = []
  const fix = createImportFix(context, rankImports(imported, ignoreCase))
  outOfOrder.forEach(imp => {
    const found = detectedOutOfOrderImports.find(item => item.shouldBe === imp.currentIdx)
    if (!found) return
    detectedOutOfOrderImports.splice(detectedOutOfOrderImports.indexOf(found), 1)
    detectedOutOfOrderImports.splice(detectedOutOfOrderImports.indexOf(imp), 1)
    reports.push({
      node: imp.node,
      message: `Imports '{{firstImport}}' and '{{secondImport}}' should be swapped`,
      data: {
        firstImport: imp.name,
        secondImport: found.name,
      },
    })
  })
  return reports.forEach(report => context.report({ ...report, fix }))
}

function findAllOutOfOrder(imported, ignoreCase) {
  return rankImports(imported, ignoreCase).filter((item, idx) => item.shouldBe !== idx)
}

function reportIfNeeded(context, imported, ignoreCase) {
  const outOfOrder = findAllOutOfOrder(imported, ignoreCase)
  if (outOfOrder.length === 0) return
  reportOutOfOrder(context, imported, outOfOrder, ignoreCase)
}

module.exports = {
  meta: {
    docs: {
      description: 'Group imports and sort them alphabetically inside groups',
      category: 'ECMAScript 6',
      recommended: true,
    },

    schema: [
      {
        type: 'object',
        properties: {
          importTypes: {
            type: 'array',
          },
          groups: {
            type: 'array',
          },
          ignoreCase: {
            type: 'boolean',
            default: true,
          },
        },
        additionalProperties: false,
      },
    ],

    fixable: 'code',
  },

  create(context) {
    const options = context.options[0] || {}
    let classifier
    try {
      classifier = new NodeClassifier(context, options.groups, options.importTypes)
    } catch (error) {
      return {
        Program: node => context.report(node, error.message),
      }
    }

    let imported = []
    let level = 0

    function incrementLevel() {
      level += 1
    }

    function decrementLevel() {
      level -= 1
    }

    function noop() {}

    return {
      ImportDeclaration(node) {
        imported.push(classifier.rankNode(node, node.source.value, 'import'))
      },
      CallExpression(node) {
        if (level !== 0 || !isStaticRequire(node)) return
        noop()
        // TODO: handle require calls
      },
      'Program:exit': () => {
        reportIfNeeded(context, imported, options.ignoreCase || true)

        imported = []
      },
      FunctionDeclaration: incrementLevel,
      FunctionExpression: incrementLevel,
      ArrowFunctionExpression: incrementLevel,
      BlockStatement: incrementLevel,
      ObjectExpression: incrementLevel,
      'FunctionDeclaration:exit': decrementLevel,
      'FunctionExpression:exit': decrementLevel,
      'ArrowFunctionExpression:exit': decrementLevel,
      'BlockStatement:exit': decrementLevel,
      'ObjectExpression:exit': decrementLevel,
    }
  },
}
