import { ok, err, type Result } from 'neverthrow'

export type MatchParseError = {
  readonly type: 'input_does_not_match'
  readonly input: unknown
  readonly expected: unknown
}

export const match =
  <const T>(expected: T) =>
  (input: unknown): Result<T, MatchParseError> =>
    input === expected
      ? ok(input as T)
      : err({ type: 'input_does_not_match', input, expected })
