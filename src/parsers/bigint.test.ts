import { describe, it, expect } from 'vitest'
import { bigint } from './bigint'

describe('bigint', () => {
  it('parses a bigint', () => {
    const result = bigint(42n)
    expect(result.isOk()).toBe(true)
    expect(result._unsafeUnwrap()).toBe(42n)
  })

  it('rejects a non-bigint', () => {
    const result = bigint(42)
    expect(result.isErr()).toBe(true)
    expect(result._unsafeUnwrapErr()).toEqual({
      type: 'input_is_not_a_bigint',
      input: 42,
    })
  })
})
