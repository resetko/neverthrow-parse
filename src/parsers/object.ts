import { ok, err, type Result } from 'neverthrow'

export type ObjectParseError = {
  readonly type: 'input_is_not_an_object'
  readonly input: unknown
}

export const object = (
  input: unknown,
): Result<Record<PropertyKey, unknown>, ObjectParseError> => {
  if (typeof input !== 'object' || input === null || Array.isArray(input))
    return err({ type: 'input_is_not_an_object', input })

  return ok(input as Record<PropertyKey, unknown>)
}
