import { ZodErrorTranslations } from '@/i18n/translations/zodTranslations.en'
import { z } from 'zod'

function joinValues(
  array: Array<string | number | boolean | bigint | symbol | null | undefined>,
  separator = ' | ',
) {
  return array
    .map((val) => (typeof val === 'string' ? `'${val}'` : String(val)))
    .join(separator)
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  if (typeof value !== 'object' || value === null) return false

  for (const key in value) {
    if (!Object.prototype.hasOwnProperty.call(value, key)) return false
  }

  return true
}

const getKeyAndValues = (
  param: unknown,
  defaultKey: string,
): {
  values: Record<string, unknown>
  key: string
} => {
  if (typeof param === 'string') return { key: param, values: {} }

  if (isRecord(param)) {
    const key =
      'key' in param && typeof param.key === 'string' ? param.key : defaultKey
    const values =
      'values' in param && isRecord(param.values) ? param.values : {}
    return { key, values }
  }

  return { key: defaultKey, values: {} }
}

function getNestedValue(obj: unknown, keyString: string) {
  if (!isRecord(obj)) return undefined

  const keys = keyString.split('.')
  return keys.reduce<unknown>((acc, key) => {
    if (!isRecord(acc)) return undefined
    return acc[key]
  }, obj)
}

const getTypeKey = (
  value: unknown,
): keyof ZodErrorTranslations['types'] | 'unknown' => {
  if (value === undefined) return 'undefined'
  if (value === null) return 'null'
  if (typeof value === 'number' && Number.isNaN(value)) return 'nan'
  if (Array.isArray(value)) return 'array'
  if (value instanceof Date) return 'date'
  if (typeof value === 'function') return 'function'
  if (typeof value === 'object') return 'object'

  const primitiveType = typeof value
  if (
    primitiveType in
    {
      string: true,
      number: true,
      boolean: true,
      bigint: true,
      symbol: true,
    }
  ) {
    return primitiveType as keyof ZodErrorTranslations['types']
  }

  return 'unknown'
}

const getRangeType = (
  origin: string,
): keyof ZodErrorTranslations['errors']['too_small'] => {
  if (origin === 'string') return 'string'
  if (origin === 'array') return 'array'
  if (origin === 'set') return 'set'
  if (origin === 'date') return 'date'
  return 'number'
}

const getStringValidation = (format: string) => {
  switch (format) {
    case 'email':
    case 'url':
    case 'uuid':
    case 'cuid':
    case 'regex':
    case 'datetime':
    case 'emoji':
    case 'cuid2':
    case 'ulid':
    case 'ip':
      return format
    default:
      return null
  }
}

export const useZodErrorMapTranslated = (t: ZodErrorTranslations) => {
  const customErrorMap: z.ZodErrorMap = (issue) => {
    switch (issue.code) {
      case 'invalid_type': {
        if (issue.input === undefined)
          return t.errors.invalid_type_received_undefined
        if (issue.input === null) return t.errors.invalid_type_received_null

        const expected = issue.expected as keyof ZodErrorTranslations['types']
        const received = getTypeKey(issue.input)

        return t.errors.invalid_type(
          t.types[expected] ?? String(issue.expected),
          t.types[received] ?? String(received),
        )
      }

      case 'invalid_format': {
        if (issue.format === 'starts_with') {
          const prefix = 'prefix' in issue ? String(issue.prefix) : ''
          return t.errors.invalid_string.startsWith(prefix)
        }

        if (issue.format === 'ends_with') {
          const suffix = 'suffix' in issue ? String(issue.suffix) : ''
          return t.errors.invalid_string.endsWith(suffix)
        }

        const validation = getStringValidation(issue.format)
        if (!validation) {
          return issue.message || t.errors.custom
        }

        return t.errors.invalid_string[validation](t.validations[validation])
      }

      case 'too_small': {
        const rangeType = getRangeType(issue.origin)
        const minimum =
          issue.origin === 'date'
            ? new Date(Number(issue.minimum)).toString()
            : issue.minimum.toString()
        const variant = issue.exact
          ? 'exact'
          : issue.inclusive
            ? 'inclusive'
            : 'not_inclusive'

        const message = t.errors.too_small[rangeType][variant]
        return typeof message === 'function' ? message(minimum) : message
      }

      case 'too_big': {
        const rangeType = getRangeType(issue.origin)
        const maximum =
          issue.origin === 'date'
            ? new Date(Number(issue.maximum)).toString()
            : issue.maximum.toString()
        const variant = issue.exact
          ? 'exact'
          : issue.inclusive
            ? 'inclusive'
            : 'not_inclusive'

        const message = t.errors.too_big[rangeType][variant]
        return typeof message === 'function' ? message(maximum) : message
      }

      case 'unrecognized_keys':
        return t.errors.unrecognized_keys(joinValues(issue.keys, ', '))

      case 'invalid_union':
        return t.errors.invalid_union

      case 'invalid_value': {
        const received =
          issue.input === undefined ? 'undefined' : String(issue.input)
        return t.errors.invalid_enum_value(joinValues(issue.values), received)
      }

      case 'not_multiple_of':
        return t.errors.not_multiple_of(issue.divisor.toString())

      case 'custom': {
        const { key, values } = getKeyAndValues(
          issue.params?.i18n,
          'errors.custom',
        )
        const message = getNestedValue(t.custom, key)

        if (!message) return t.errors.custom
        return typeof message === 'function' ? message(values) : String(message)
      }

      default:
        return issue.message || t.errors.custom
    }
  }

  return customErrorMap
}
