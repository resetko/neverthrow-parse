import { ok, err, type Result } from 'neverthrow'

export type NumberParseError =
  | {
      readonly type: 'input_is_not_a_number'
      readonly input: unknown
    }
  | {
      readonly type: 'input_is_nan'
      readonly input: unknown
    }

export const number = (input: unknown): Result<number, NumberParseError> => {
  if (typeof input !== 'number')
    return err({ type: 'input_is_not_a_number', input })
  if (Number.isNaN(input)) return err({ type: 'input_is_nan', input })
  return ok(input)
}
