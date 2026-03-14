import { ok, type Result } from 'neverthrow'
import { object, type ObjectParseError } from './object'

export type RecordOfParseError<KE, VE> =
  | ObjectParseError
  | {
      readonly type: 'key_parse_error'
      readonly key: PropertyKey
      readonly error: KE
    }
  | {
      readonly type: 'value_parse_error'
      readonly key: PropertyKey
      readonly error: VE
    }

export const recordOf = <K extends PropertyKey, KE, V, VE>(
  input: unknown,
  schema: {
    readonly key: (input: unknown) => Result<K, KE>
    readonly value: (input: unknown) => Result<V, VE>
  },
): Result<Record<K, V>, RecordOfParseError<KE, VE>> =>
  object(input).andThen((obj) =>
    Reflect.ownKeys(obj).reduce<
      Result<Record<K, V>, RecordOfParseError<KE, VE>>
    >(
      (acc, rawKey) =>
        acc.andThen((record) =>
          schema
            .key(rawKey)
            .mapErr(
              (error): RecordOfParseError<KE, VE> => ({
                type: 'key_parse_error',
                key: rawKey,
                error,
              }),
            )
            .andThen((k) =>
              schema
                .value(obj[rawKey])
                .mapErr(
                  (error): RecordOfParseError<KE, VE> => ({
                    type: 'value_parse_error',
                    key: rawKey,
                    error,
                  }),
                )
                .map((v) => {
                  record[k] = v
                  return record
                }),
            ),
        ),
      ok({} as Record<K, V>),
    ),
  )
