import {
  NodeClassifier,
  getFirstMemberName,
  alphabeticCompareNodes,
  compareNodes,
} from '../../src/utils/nodes'

describe('nodes', () => {
  describe('getFirstMemberName()', () => {
    it('returns null if structure given is not a correct import node', () => {
      expect(getFirstMemberName({ node: null })).toBe(null)
      expect(getFirstMemberName({ node: { specifiers: [] } })).toBe(null)
    })

    it('returns name of first member of import', () => {
      expect(getFirstMemberName({ node: { specifiers: [{ local: { name: 'redux' } }] } })).toBe(
        'redux'
      )
    })

    it('lowercases returned name if forceLowercase is true', () => {
      expect(
        getFirstMemberName({ node: { specifiers: [{ local: { name: 'Redux' } }] } }, true)
      ).toBe('redux')
    })
  })

  describe('alphabeticCompareNodes(node1, node2, ignoreCase)', () => {
    const fsNode = {
      node: {
        specifiers: [{ local: { name: 'fs' } }],
      },
    }
    const osNode = {
      node: {
        specifiers: [{ local: { name: 'os' } }],
      },
    }

    expect(alphabeticCompareNodes(fsNode, osNode, true)).toBe(-1)
    expect(alphabeticCompareNodes(fsNode, fsNode, true)).toBe(0)
    expect(alphabeticCompareNodes(osNode, osNode, true)).toBe(0)
    expect(alphabeticCompareNodes(osNode, fsNode, true)).toBe(1)
  })

  describe('compareNodes()', () => {})
})
