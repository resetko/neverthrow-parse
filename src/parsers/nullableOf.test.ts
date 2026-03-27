import { describe, it, expect } from 'vitest'
import { nullableOf } from './nullableOf'
import { string } from './string'
import { number } from './number'
import { arrayOf } from './arrayOf'

describe('nullableOf', () => {
  it('returns ok(null) for null input', () => {
    const result = nullableOf(null, string)
    expect(result.isOk()).toBe(true)
    expect(result._unsafeUnwrap()).toBeNull()
  })

  it('returns ok(null) for undefined input', () => {
    const result = nullableOf(undefined, string)
    expect(result.isOk()).toBe(true)
    expect(result._unsafeUnwrap()).toBeNull()
  })

  it('delegates to inner parser for non-null valid input', () => {
    const result = nullableOf('hello', string)
    expect(result.isOk()).toBe(true)
    expect(result._unsafeUnwrap()).toBe('hello')
  })

  it('returns inner parser error for non-null invalid input', () => {
    const result = nullableOf(42, string)
    expect(result.isErr()).toBe(true)
    expect(result._unsafeUnwrapErr()).toEqual({
      type: 'input_is_not_a_string',
      input: 42,
    })
  })

  it('works with complex inner parsers', () => {
    const result = nullableOf([1, 2, 3], (input) => arrayOf(input, number))
    expect(result.isOk()).toBe(true)
    expect(result._unsafeUnwrap()).toEqual([1, 2, 3])
  })
})
