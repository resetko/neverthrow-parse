import { describe, it, expect } from 'vitest'
import { number } from './number'

describe('number', () => {
  it('parses a number', () => {
    const result = number(42)
    expect(result.isOk()).toBe(true)
    expect(result._unsafeUnwrap()).toBe(42)
  })

  it('rejects NaN', () => {
    const result = number(NaN)
    expect(result.isErr()).toBe(true)
    expect(result._unsafeUnwrapErr()).toEqual({
      type: 'input_is_nan',
      input: NaN,
    })
  })

  it('rejects a non-number', () => {
    const result = number('hello')
    expect(result.isErr()).toBe(true)
    expect(result._unsafeUnwrapErr()).toEqual({
      type: 'input_is_not_a_number',
      input: 'hello',
    })
  })
})
