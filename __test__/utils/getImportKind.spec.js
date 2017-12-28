import getImportKind from '../../src/utils/getImportKind'

describe('getImportKind()', () => {
  it(`returns 'none' for empty imports`, () => {
    expect(getImportKind({ specifiers: [] })).toBe('none')
  })

  it(`returns 'default' for default imports`, () => {
    expect(
      getImportKind({
        specifiers: [{ type: 'ImportDefaultSpecifier' }],
      })
    ).toBe('default')
  })

  it(`returns 'all' for import * as namespace syntax`, () => {
    expect(
      getImportKind({
        specifiers: [{ type: 'ImportNamespaceSpecifier' }],
      })
    ).toBe('all')
  })

  it(`returns 'named' for namespace imports`, () => {
    expect(
      getImportKind({
        specifiers: [{ type: 'Whatever' }],
      })
    ).toBe('named')
  })
})
