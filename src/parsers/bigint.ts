import { ok, err, type Result } from 'neverthrow'

export type BigintParseError = {
  readonly type: 'input_is_not_a_bigint'
  readonly input: unknown
}

export const bigint = (input: unknown): Result<bigint, BigintParseError> =>
  typeof input === 'bigint'
    ? ok(input)
    : err({ type: 'input_is_not_a_bigint', input })
