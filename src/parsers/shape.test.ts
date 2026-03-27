import { describe, it, expect } from 'vitest'
import { shape } from './shape'
import { string } from './string'
import { number } from './number'

describe('shape', () => {
  const parseUser = shape({ name: string, age: number })

  it('parses a valid shape', () => {
    const result = parseUser({ name: 'alice', age: 30 })
    expect(result.isOk()).toBe(true)
    expect(result._unsafeUnwrap()).toEqual({ name: 'alice', age: 30 })
  })

  it('ignores extra keys', () => {
    const result = parseUser({ name: 'alice', age: 30, extra: true })
    expect(result.isOk()).toBe(true)
    expect(result._unsafeUnwrap()).toEqual({ name: 'alice', age: 30 })
  })

  it('rejects non-object input', () => {
    const result = parseUser(42)
    expect(result.isErr()).toBe(true)
    expect(result._unsafeUnwrapErr()).toEqual({
      type: 'input_is_not_an_object',
      input: 42,
    })
  })

  it('rejects when a value fails to parse', () => {
    const result = parseUser({ name: 'alice', age: 'old' })
    expect(result.isErr()).toBe(true)
    expect(result._unsafeUnwrapErr()).toEqual({
      type: 'value_parse_error',
      key: 'age',
      input: { name: 'alice', age: 'old' },
      error: { type: 'input_is_not_a_number', input: 'old' },
    })
  })
})
