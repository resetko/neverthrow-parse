import { describe, it, expect } from 'vitest'
import { string } from './string'

describe('string', () => {
  it('parses a string', () => {
    const result = string('hello')
    expect(result.isOk()).toBe(true)
    expect(result._unsafeUnwrap()).toBe('hello')
  })

  it('rejects a non-string', () => {
    const result = string(42)
    expect(result.isErr()).toBe(true)
    expect(result._unsafeUnwrapErr()).toEqual({
      type: 'input_is_not_a_string',
      input: 42,
    })
  })
})
