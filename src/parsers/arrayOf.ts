import { ok, err, type Result } from 'neverthrow'

export type ArrayOfParseError<E> =
  | { readonly type: 'input_is_not_an_array'; readonly input: unknown }
  | {
      readonly type: 'item_parse_error'
      readonly index: number
      readonly error: E
    }

export const arrayOf = <T, E>(
  input: unknown,
  item: (input: unknown) => Result<T, E>,
): Result<T[], ArrayOfParseError<E>> => {
  if (!Array.isArray(input))
    return err({ type: 'input_is_not_an_array', input })

  const items: T[] = []
  for (let i = 0; i < input.length; i++) {
    const result = item(input[i])
    if (result.isErr())
      return err({ type: 'item_parse_error', index: i, error: result.error })

    items.push(result.value)
  }
  return ok(items)
}
