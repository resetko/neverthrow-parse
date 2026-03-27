import { ok, err, type Result } from 'neverthrow'

export type BooleanParseError = {
  readonly type: 'input_is_not_a_boolean'
  readonly input: unknown
}

export const boolean = (input: unknown): Result<boolean, BooleanParseError> =>
  typeof input === 'boolean'
    ? ok(input)
    : err({ type: 'input_is_not_a_boolean', input })
