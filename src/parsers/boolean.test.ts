import { describe, it, expect } from 'vitest'
import { boolean } from './boolean'

describe('boolean', () => {
  it('parses true', () => {
    const result = boolean(true)
    expect(result.isOk()).toBe(true)
    expect(result._unsafeUnwrap()).toBe(true)
  })

  it('parses false', () => {
    const result = boolean(false)
    expect(result.isOk()).toBe(true)
    expect(result._unsafeUnwrap()).toBe(false)
  })

  it('rejects a non-boolean', () => {
    const result = boolean('true')
    expect(result.isErr()).toBe(true)
    expect(result._unsafeUnwrapErr()).toEqual({
      type: 'input_is_not_a_boolean',
      input: 'true',
    })
  })
})
