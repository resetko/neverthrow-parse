import { ok, err, type Result } from 'neverthrow'

type Parsers = readonly [
  (input: unknown) => Result<unknown, unknown>,
  ...((input: unknown) => Result<unknown, unknown>)[],
]

type InferOk<T extends Parsers> = {
  [K in keyof T]: T[K] extends (input: unknown) => Result<infer U, unknown>
    ? U
    : never
}[number]

type InferErr<T extends Parsers> = {
  [K in keyof T]: T[K] extends (input: unknown) => Result<unknown, infer E>
    ? E
    : never
}[number]

export type OneOfParseError<E> = {
  readonly type: 'no_parser_succeeded'
  readonly errors: readonly { readonly index: number; readonly error: E }[]
}

export const oneOf =
  <const T extends Parsers>(parsers: T) =>
  (input: unknown): Result<InferOk<T>, OneOfParseError<InferErr<T>>> => {
    const errors: { readonly index: number; readonly error: InferErr<T> }[] = []
    for (let i = 0; i < parsers.length; i++) {
      const result = parsers[i](input)
      if (result.isOk()) return ok(result.value as InferOk<T>)
      errors.push({ index: i, error: result.error as InferErr<T> })
    }
    return err({ type: 'no_parser_succeeded', errors })
  }
