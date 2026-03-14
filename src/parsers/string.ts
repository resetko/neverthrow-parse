import { ok, err, type Result } from 'neverthrow'

export type StringParseError = {
  readonly type: 'input_is_not_a_string'
  readonly input: unknown
}

export const string = (input: unknown): Result<string, StringParseError> =>
  typeof input === 'string'
    ? ok(input)
    : err({ type: 'input_is_not_a_string', input })
