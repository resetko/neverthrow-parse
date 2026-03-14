import { describe, it, expect } from 'vitest'
import { arrayOf } from './arrayOf'
import { number } from './number'

describe('arrayOf', () => {
  it('parses a valid array', () => {
    const result = arrayOf([1, 2, 3], number)
    expect(result.isOk()).toBe(true)
    expect(result._unsafeUnwrap()).toEqual([1, 2, 3])
  })

  it('parses an empty array', () => {
    const result = arrayOf([], number)
    expect(result.isOk()).toBe(true)
    expect(result._unsafeUnwrap()).toEqual([])
  })

  it('rejects non-array input', () => {
    const result = arrayOf(42, number)
    expect(result.isErr()).toBe(true)
    expect(result._unsafeUnwrapErr()).toEqual({
      type: 'input_is_not_an_array',
      input: 42,
    })
  })

  it('rejects when an item fails to parse', () => {
    const result = arrayOf([1, 'bad', 3], number)
    expect(result.isErr()).toBe(true)
    expect(result._unsafeUnwrapErr()).toEqual({
      type: 'item_parse_error',
      index: 1,
      error: { type: 'input_is_not_a_number', input: 'bad' },
    })
  })
})
