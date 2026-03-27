import { ok, type Result } from 'neverthrow'

export const nullableOf = <T, E>(
  input: unknown,
  parser: (input: unknown) => Result<T, E>,
): Result<T | null, E> =>
  input === null || input === undefined ? ok(null) : parser(input)
