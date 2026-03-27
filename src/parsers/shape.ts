import { ok, type Result } from 'neverthrow'
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
      readonly type: 'value_parse_error'
      readonly key: string
      readonly input: Record<string, unknown>
      readonly error: E
    }

export const shape =
  <S extends Schema>(schema: S) =>
  (input: unknown): Result<InferShape<S>, ShapeParseError<InferErrors<S>>> =>
    object(input).andThen((obj) =>
      Object.keys(schema).reduce<
        Result<Record<string, unknown>, ShapeParseError<InferErrors<S>>>
      >(
        (acc, key) =>
          acc.andThen((result) =>
            schema[key](obj[key])
              .map((value) => ({ ...result, [key]: value }))
              .mapErr(
                (error): ShapeParseError<InferErrors<S>> => ({
                  type: 'value_parse_error',
                  key,
                  input: obj,
                  error: error as InferErrors<S>,
                }),
              ),
          ),
        ok({}),
      ),
    ) as Result<InferShape<S>, ShapeParseError<InferErrors<S>>>
