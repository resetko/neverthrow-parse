import { ok, err, type Result } from 'neverthrow'
import { object, type ObjectParseError } from './object'

type Schema = Record<string, (input: unknown) => Result<unknown, unknown>>

type InferShape<S extends Schema> = {
  [K in keyof S]: S[K] extends (input: unknown) => Result<infer T, unknown>
    ? T
    : never
}

type InferErrors<S extends Schema> = {
  [K in keyof S]: S[K] extends (input: unknown) => Result<unknown, infer E>
    ? E
    : never
}[keyof S]

export type ShapeParseError<E> =
  | ObjectParseError
  | {
      readonly type: 'missing_key'
      readonly key: string
      readonly input: Record<string, unknown>
    }
  | {
      readonly type: 'value_parse_error'
      readonly key: string
      readonly input: Record<string, unknown>
      readonly error: E
    }

export const shape = <S extends Schema>(
  input: unknown,
  schema: S,
): Result<InferShape<S>, ShapeParseError<InferErrors<S>>> =>
  object(input).andThen((obj) => {
    const result: Record<string, unknown> = {}
    for (const key of Object.keys(schema)) {
      if (!(key in obj))
        return err({ type: 'missing_key' as const, key, input: obj })

      const parsed = schema[key](obj[key])

      if (parsed.isErr())
        return err({
          type: 'value_parse_error' as const,
          key,
          input: obj,
          error: parsed.error as InferErrors<S>,
        })
      result[key] = parsed.value
    }
    return ok(result as InferShape<S>)
  })
