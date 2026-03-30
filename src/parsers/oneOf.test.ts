import { describe, it, expect } from 'vitest'
import { oneOf } from './oneOf'
import { string } from './string'
import { number } from './number'

describe('oneOf', () => {
  const parseStringOrNumber = oneOf([string, number])

  it('returns ok when first parser succeeds', () => {
    const result = parseStringOrNumber('hello')
    expect(result.isOk()).toBe(true)
    expect(result._unsafeUnwrap()).toBe('hello')
  })

  it('returns ok when later parser succeeds', () => {
    const result = parseStringOrNumber(42)
    expect(result.isOk()).toBe(true)
    expect(result._unsafeUnwrap()).toBe(42)
  })

  it('returns indexed errors when all parsers fail', () => {
    const result = parseStringOrNumber(true)
    expect(result.isErr()).toBe(true)
    expect(result._unsafeUnwrapErr()).toEqual({
      type: 'no_parser_succeeded',
      errors: [
        { index: 0, error: { type: 'input_is_not_a_string', input: true } },
        { index: 1, error: { type: 'input_is_not_a_number', input: true } },
      ],
    })
  })
})
