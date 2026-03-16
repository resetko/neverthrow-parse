import { describe, it, expect } from 'vitest'
import { json } from './json'

describe('json', () => {
  it('parses valid JSON', () => {
    const result = json('{"a":1}')
    expect(result.isOk()).toBe(true)
    expect(result._unsafeUnwrap()).toEqual({ a: 1 })
  })

  it('applies reviver to parsed values', () => {
    const result = json('{"a":"2025-01-01"}', (key, value) =>
      key === 'a' ? new Date(value as string) : value,
    )
    expect(result.isOk()).toBe(true)
    expect(result._unsafeUnwrap()).toEqual({ a: new Date('2025-01-01') })
  })

  it('rejects invalid JSON', () => {
    const result = json('{invalid}')
    expect(result.isErr()).toBe(true)
    const error = result._unsafeUnwrapErr()
    expect(error.type).toBe('input_is_not_valid_json')
    expect(error.input).toBe('{invalid}')
    expect(error.error).toBeInstanceOf(SyntaxError)
  })
})
