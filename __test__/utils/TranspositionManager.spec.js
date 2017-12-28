import TranspositionManager from '../../src/utils/TranspositionManager'

describe('TranspositionManager', () => {
  const transpositionTest = [
    { shouldBe: 4, currentIdx: 0 },
    { shouldBe: 0, currentIdx: 1 },
    { shouldBe: 2, currentIdx: 2 },
    { shouldBe: 1, currentIdx: 3 },
    { shouldBe: 3, currentIdx: 4 },
  ]
  describe('constructor', () => {
    it('creates TranspositionManager instance', () => {
      expect(new TranspositionManager(transpositionTest).constructor.name).toBe(
        'TranspositionManager'
      )
    })
  })

  describe('canTranspose()', () => {
    it('returns whether the next transposition is possible', () => {
      const tr = new TranspositionManager(transpositionTest)
      for (let i = 0; i < 4; i += 1) {
        expect(tr.canTranspose()).toBe(true)
        tr.transpose()
      }
      expect(tr.canTranspose()).toBe(false)
    })
  })

  describe('transpose()', () => {
    it('returns next transposition in the chain of transposition leading to correct result', () => {
      const tr = new TranspositionManager(transpositionTest)
      expect(tr.transpose()).toEqual([
        { currentIdx: 4, shouldBe: 3 },
        { currentIdx: 3, shouldBe: 1 },
      ])
      expect(tr.transpose()).toEqual([
        { currentIdx: 3, shouldBe: 1 },
        { currentIdx: 1, shouldBe: 0 },
      ])
      expect(tr.transpose()).toEqual([
        { currentIdx: 1, shouldBe: 0 },
        { currentIdx: 0, shouldBe: 4 },
      ])
      expect(tr.transpose()).toEqual([
        { currentIdx: 1, shouldBe: 0 },
        { currentIdx: 1, shouldBe: 0 },
      ])
    })
  })
})
