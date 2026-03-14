import { describe, it, expect } from 'vitest'
import { object } from './object'

describe('object', () => {
  it('parses a plain object', () => {
    const result = object({})
    expect(result.isOk()).toBe(true)
    expect(result._unsafeUnwrap()).toEqual({})
  })

  it('parses an object with properties', () => {
    const result = object({ a: 1 })
    expect(result.isOk()).toBe(true)
    expect(result._unsafeUnwrap()).toEqual({ a: 1 })
  })

  it('rejects null', () => {
    const result = object(null)
    expect(result.isErr()).toBe(true)
    expect(result._unsafeUnwrapErr()).toEqual({
      type: 'input_is_not_an_object',
      input: null,
    })
  })

  it('rejects an array', () => {
    const result = object([1, 2])
    expect(result.isErr()).toBe(true)
    expect(result._unsafeUnwrapErr()).toEqual({
      type: 'input_is_not_an_object',
      input: [1, 2],
    })
  })

  it('rejects a non-object', () => {
    const result = object('hello')
    expect(result.isErr()).toBe(true)
    expect(result._unsafeUnwrapErr()).toEqual({
      type: 'input_is_not_an_object',
      input: 'hello',
    })
  })
})
