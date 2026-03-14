import { describe, it, expect } from 'vitest'
import { recordOf } from './recordOf'
import { string } from './string'
import { number } from './number'

describe('recordOf', () => {
  it('parses a valid record', () => {
    const result = recordOf({ a: 1 }, { key: string, value: number })
    expect(result.isOk()).toBe(true)
    expect(result._unsafeUnwrap()).toEqual({ a: 1 })
  })

  it('rejects non-object input', () => {
    const result = recordOf(42, { key: string, value: number })
    expect(result.isErr()).toBe(true)
    expect(result._unsafeUnwrapErr()).toEqual({
      type: 'input_is_not_an_object',
      input: 42,
    })
  })

  it('rejects when a key fails to parse', () => {
    const result = recordOf({ a: 1 }, { key: number, value: number })
    expect(result.isErr()).toBe(true)
    expect(result._unsafeUnwrapErr()).toEqual({
      type: 'key_parse_error',
      key: 'a',
      error: { type: 'input_is_not_a_number', input: 'a' },
    })
  })

  it('rejects when a value fails to parse', () => {
    const result = recordOf(
      { a: 'not a number' },
      { key: string, value: number },
    )
    expect(result.isErr()).toBe(true)
    expect(result._unsafeUnwrapErr()).toEqual({
      type: 'value_parse_error',
      key: 'a',
      error: { type: 'input_is_not_a_number', input: 'not a number' },
    })
  })
})
