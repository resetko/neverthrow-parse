import { ok, err, type Result } from 'neverthrow'

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue }

export type JsonParseError = {
  readonly type: 'input_is_not_valid_json'
  readonly input: string
  readonly error: unknown
}

export const json = (
  input: string,
  reviver?: (key: string, value: unknown) => unknown,
): Result<JsonValue, JsonParseError> => {
  try {
    return ok(JSON.parse(input, reviver) as JsonValue)
  } catch (e) {
    return err({
      type: 'input_is_not_valid_json',
      input,
      error: e,
    })
  }
}
