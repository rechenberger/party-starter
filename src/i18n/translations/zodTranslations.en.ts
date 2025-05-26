// copied and slightly modified from here: https://github.com/aiji42/zod-i18n/blob/main/packages/core/locales/en/zod.json

export const zodErrorTranslationsEn = {
  errors: {
    invalid_type: (expected: string, received: string) =>
      `Expected ${expected}, received ${received}`,
    invalid_type_received_undefined: 'Required',
    invalid_type_received_null: 'Required',
    invalid_literal: (expected: string) =>
      `Invalid value, expected ${expected}`,
    unrecognized_keys: (keys: string) =>
      `Unrecognized key(s) in object: ${keys}`,
    invalid_union: 'Invalid input',
    invalid_union_discriminator: (options: string) =>
      `Invalid discriminator value. Expected ${options}`,
    invalid_enum_value: (options: string, received: string) =>
      `Invalid enum value. Expected ${options}, received '${received}'`,
    invalid_arguments: 'Invalid function arguments',
    invalid_return_type: 'Invalid function return type',
    invalid_date: 'Invalid date',
    custom: 'Invalid input',
    invalid_intersection_types: 'Intersection results could not be merged',
    not_multiple_of: (multipleOf: string) =>
      `Number must be a multiple of ${multipleOf}`,
    not_finite: 'Number must be finite',
    invalid_string: {
      email: (validation: string) => `Invalid ${validation}`,
      url: (validation: string) => `Invalid ${validation}`,
      uuid: (validation: string) => `Invalid ${validation}`,
      cuid: (validation: string) => `Invalid ${validation}`,
      regex: (_: string) => 'Invalid',
      datetime: (validation: string) => `Invalid ${validation}`,
      emoji: (validation: string) => `Invalid ${validation}`,
      cuid2: (validation: string) => `Invalid ${validation}`,
      ulid: (validation: string) => `Invalid ${validation}`,
      ip: (validation: string) => `Invalid ${validation}`,
      startsWith: (startsWith: string) =>
        `Invalid input: must start with "${startsWith}"`,
      endsWith: (endsWith: string) =>
        `Invalid input: must end with "${endsWith}"`,
    },
    too_small: {
      array: {
        exact: (minimum: string) =>
          `Must contain exactly ${minimum} element(s)`,
        inclusive: (minimum: string) =>
          `Must contain at least ${minimum} element(s)`,
        not_inclusive: (minimum: string) =>
          `Must contain more than ${minimum} element(s)`,
      },
      string: {
        exact: (minimum: string) =>
          `Must contain exactly ${minimum} character(s)`,
        inclusive: (minimum: string) => {
          if (minimum === '1') {
            return 'Cannot be empty.'
          }
          return `Must contain at least ${minimum} character(s)`
        },
        not_inclusive: (minimum: string) =>
          `Must contain over ${minimum} character(s)`,
      },
      number: {
        exact: (minimum: string) => `Number must be exactly ${minimum}`,
        inclusive: (minimum: string) =>
          `Number must be greater than or equal to ${minimum}`,
        not_inclusive: (minimum: string) =>
          `Number must be greater than ${minimum}`,
      },
      set: {
        exact: 'Invalid input',
        inclusive: 'Invalid input',
        not_inclusive: 'Invalid input',
      },
      date: {
        exact: (minimum: string) => `Date must be exactly ${minimum}`,
        inclusive: (minimum: string) =>
          `Date must be greater than or equal to ${minimum}`,
        not_inclusive: (minimum: string) =>
          `Date must be greater than ${minimum}`,
      },
    },
    too_big: {
      array: {
        exact: (maximum: string) =>
          `Must contain exactly ${maximum} element(s)`,
        inclusive: (maximum: string) =>
          `Must contain at most ${maximum} element(s)`,
        not_inclusive: (maximum: string) =>
          `Must contain less than ${maximum} element(s)`,
      },
      string: {
        exact: (maximum: string) =>
          `Must contain exactly ${maximum} character(s)`,
        inclusive: (maximum: string) =>
          `Must contain at most ${maximum} character(s)`,
        not_inclusive: (maximum: string) =>
          `Must contain under ${maximum} character(s)`,
      },
      number: {
        exact: (maximum: string) => `Must be exactly ${maximum}`,
        inclusive: (maximum: string) =>
          `Must be less than or equal to ${maximum}`,
        not_inclusive: (maximum: string) => `Must be less than ${maximum}`,
      },
      set: {
        exact: 'Invalid input',
        inclusive: 'Invalid input',
        not_inclusive: 'Invalid input',
      },
      date: {
        exact: (maximum: string) => `Date must be exactly ${maximum}`,
        inclusive: (maximum: string) =>
          `Date must be smaller than or equal to ${maximum}`,
        not_inclusive: (maximum: string) =>
          `Date must be smaller than ${maximum}`,
      },
    },
  },
  validations: {
    email: 'email',
    url: 'url',
    uuid: 'uuid',
    cuid: 'cuid',
    regex: 'regex',
    datetime: 'datetime',
    emoji: 'emoji',
    cuid2: 'cuid2',
    ulid: 'ulid',
    ip: 'ip',
  },
  types: {
    function: 'function',
    number: 'number',
    string: 'string',
    nan: 'nan',
    integer: 'integer',
    float: 'float',
    boolean: 'boolean',
    date: 'date',
    bigint: 'bigint',
    undefined: 'undefined',
    symbol: 'symbol',
    null: 'null',
    array: 'array',
    object: 'object',
    unknown: 'unknown',
    promise: 'promise',
    void: 'void',
    never: 'never',
    map: 'map',
    set: 'set',
  },
  custom: {
    auth: {
      confirmPasswordMismatch: `Passwords do not match`,
      acceptTerms: `You must accept the terms and conditions`,
    },
  },
}

export type ZodErrorTranslations = typeof zodErrorTranslationsEn
