import { describe, it, expect } from 'vitest'
import { match } from './match'

describe('match', () => {
  it('matches a literal string', () => {
    const result = match('admin')('admin')
    expect(result.isOk()).toBe(true)
    expect(result._unsafeUnwrap()).toBe('admin')
  })

  it('matches a literal number', () => {
    const result = match(42)(42)
    expect(result.isOk()).toBe(true)
    expect(result._unsafeUnwrap()).toBe(42)
  })

  it('rejects a non-matching value', () => {
    const result = match('admin')('user')
    expect(result.isErr()).toBe(true)
    expect(result._unsafeUnwrapErr()).toEqual({
      type: 'input_does_not_match',
      input: 'user',
      expected: 'admin',
    })
  })
})
