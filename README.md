# neverthrow-parse

[![CI](https://github.com/resetko/neverthrow-parse/actions/workflows/ci.yml/badge.svg)](https://github.com/resetko/neverthrow-parse/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/neverthrow-parse)](https://www.npmjs.com/package/neverthrow-parse)

Type-safe parsers for unknown data using [neverthrow](https://github.com/supermacro/neverthrow) Result types.

Every parser takes an `unknown` input and returns a `Result<T, ParseError>` — no exceptions, just values.

## Install

```sh
npm install neverthrow-parse neverthrow
```

## Usage

```ts
import { string, number, shape, arrayOf } from 'neverthrow-parse'

// Primitive parsing
const name = string('hello') // Ok<string>
const age = number('oops') // Err<{ type: 'input_is_not_a_number', input: 'oops' }>

// Object shapes
const user = shape(json, {
  name: string,
  age: number,
})
// Ok<{ name: string, age: number }> or Err with structured error

// Arrays
const ids = arrayOf(json, number)
// Ok<number[]> or Err with index of failing item
```

## Parsers

### `string(input)`

Returns `Ok<string>` or `Err<StringParseError>`.

### `number(input)`

Returns `Ok<number>` or `Err<NumberParseError>`. Rejects `NaN`.

### `bigint(input)`

Returns `Ok<bigint>` or `Err<BigintParseError>`.

### `object(input)`

Validates that input is a non-null, non-array object. Returns `Ok<Record<PropertyKey, unknown>>` or `Err<ObjectParseError>`.

### `arrayOf(input, itemParser)`

Parses an array where every item is validated by `itemParser`. On failure, the error includes the index of the first failing item.

```ts
arrayOf([1, 2, 'x'], number)
// Err<{ type: 'item_parse_error', index: 2, error: { type: 'input_is_not_a_number', ... } }>
```

### `recordOf(input, { key, value })`

Parses an object as a typed record, validating both keys and values.

```ts
recordOf(json, { key: string, value: number })
// Ok<Record<string, number>>
```

### `shape(input, schema)`

Parses an object against a schema of named parsers. Infers the output type from the schema.

```ts
const result = shape(json, {
  host: string,
  port: number,
})
// Result<{ host: string, port: number }, ShapeParseError<...>>
```

Errors include context: `missing_key` (with key name) or `value_parse_error` (with key name and nested error).

## Error types

Every parser exports its error type (e.g. `StringParseError`, `ShapeParseError<E>`). All errors are discriminated unions with a `type` field, making them easy to match:

```ts
const result = number(input)
if (result.isErr()) {
  switch (result.error.type) {
    case 'input_is_not_a_number':
      // result.error.input is the original value
      break
    case 'input_is_nan':
      break
  }
}
```

## License

[MIT](LICENSE)
