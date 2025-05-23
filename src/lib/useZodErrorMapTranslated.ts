import { ZodErrorTranslations } from '@/i18n/translations/zodTranslations.en'
import { z, ZodIssueCode, ZodParsedType } from 'zod'

/*
inspired by https://github.com/aiji42/zod-i18n/blob/main/packages/core/src/index.ts
*/

// switch (issue.code) {
//   case ZodIssueCode.invalid_type:
//     if (issue.received === ZodParsedType.undefined) {
//       message = t('errors.invalid_type_received_undefined', {
//         ns,
//         defaultValue: message,
//         ...path,
//       })
//     } else if (issue.received === ZodParsedType.null) {
//       message = t('errors.invalid_type_received_null', {
//         ns,
//         defaultValue: message,
//         ...path,
//       })
//     } else {
//       message = t('errors.invalid_type', {
//         expected: t(`types.${issue.expected}`, {
//           defaultValue: issue.expected,
//           ns,
//         }),
//         received: t(`types.${issue.received}`, {
//           defaultValue: issue.received,
//           ns,
//         }),
//         ns,
//         defaultValue: message,
//         ...path,
//       })
//     }
//     break
//   case ZodIssueCode.invalid_literal:
//     message = t('errors.invalid_literal', {
//       expected: JSON.stringify(issue.expected, jsonStringifyReplacer),
//       ns,
//       defaultValue: message,
//       ...path,
//     })
//     break
//   case ZodIssueCode.unrecognized_keys:
//     message = t('errors.unrecognized_keys', {
//       keys: joinValues(issue.keys, ', '),
//       count: issue.keys.length,
//       ns,
//       defaultValue: message,
//       ...path,
//     })
//     break
//   case ZodIssueCode.invalid_union:
//     message = t('errors.invalid_union', {
//       ns,
//       defaultValue: message,
//       ...path,
//     })
//     break
//   case ZodIssueCode.invalid_union_discriminator:
//     message = t('errors.invalid_union_discriminator', {
//       options: joinValues(issue.options),
//       ns,
//       defaultValue: message,
//       ...path,
//     })
//     break
//   case ZodIssueCode.invalid_enum_value:
//     message = t('errors.invalid_enum_value', {
//       options: joinValues(issue.options),
//       received: issue.received,
//       ns,
//       defaultValue: message,
//       ...path,
//     })
//     break
//   case ZodIssueCode.invalid_arguments:
//     message = t('errors.invalid_arguments', {
//       ns,
//       defaultValue: message,
//       ...path,
//     })
//     break
//   case ZodIssueCode.invalid_return_type:
//     message = t('errors.invalid_return_type', {
//       ns,
//       defaultValue: message,
//       ...path,
//     })
//     break
//   case ZodIssueCode.invalid_date:
//     message = t('errors.invalid_date', {
//       ns,
//       defaultValue: message,
//       ...path,
//     })
//     break
//   case ZodIssueCode.invalid_string:
//     if (typeof issue.validation === 'object') {
//       if ('startsWith' in issue.validation) {
//         message = t(`errors.invalid_string.startsWith`, {
//           startsWith: issue.validation.startsWith,
//           ns,
//           defaultValue: message,
//           ...path,
//         })
//       } else if ('endsWith' in issue.validation) {
//         message = t(`errors.invalid_string.endsWith`, {
//           endsWith: issue.validation.endsWith,
//           ns,
//           defaultValue: message,
//           ...path,
//         })
//       }
//     } else {
//       message = t(`errors.invalid_string.${issue.validation}`, {
//         validation: t(`validations.${issue.validation}`, {
//           defaultValue: issue.validation,
//           ns,
//         }),
//         ns,
//         defaultValue: message,
//         ...path,
//       })
//     }
//     break
//   case ZodIssueCode.too_small:
//     const minimum =
//       issue.type === 'date' ? new Date(issue.minimum as number) : issue.minimum
//     message = t(
//       `errors.too_small.${issue.type}.${
//         issue.exact ? 'exact' : issue.inclusive ? 'inclusive' : 'not_inclusive'
//       }`,
//       {
//         minimum,
//         count: typeof minimum === 'number' ? minimum : undefined,
//         ns,
//         defaultValue: message,
//         ...path,
//       },
//     )
//     break
//   case ZodIssueCode.too_big:
//     const maximum =
//       issue.type === 'date' ? new Date(issue.maximum as number) : issue.maximum
//     message = t(
//       `errors.too_big.${issue.type}.${
//         issue.exact ? 'exact' : issue.inclusive ? 'inclusive' : 'not_inclusive'
//       }`,
//       {
//         maximum,
//         count: typeof maximum === 'number' ? maximum : undefined,
//         ns,
//         defaultValue: message,
//         ...path,
//       },
//     )
//     break
//   case ZodIssueCode.custom:
//     const { key, values } = getKeyAndValues(issue.params?.i18n, 'errors.custom')

//     message = t(key, {
//       ...values,
//       ns,
//       defaultValue: message,
//       ...path,
//     })
//     break
//   case ZodIssueCode.invalid_intersection_types:
//     message = t('errors.invalid_intersection_types', {
//       ns,
//       defaultValue: message,
//       ...path,
//     })
//     break
//   case ZodIssueCode.not_multiple_of:
//     message = t('errors.not_multiple_of', {
//       multipleOf: issue.multipleOf,
//       ns,
//       defaultValue: message,
//       ...path,
//     })
//     break
//   case ZodIssueCode.not_finite:
//     message = t('errors.not_finite', {
//       ns,
//       defaultValue: message,
//       ...path,
//     })
//     break
//   default:
// }
const jsonStringifyReplacer = (_: string, value: any): any => {
  if (typeof value === 'bigint') {
    return value.toString()
  }
  return value
}
function joinValues<T extends any[]>(array: T, separator = ' | '): string {
  return array
    .map((val) => (typeof val === 'string' ? `'${val}'` : val))
    .join(separator)
}

export const useZodErrorMapTranslated = (t: ZodErrorTranslations) => {
  const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
    let message: string | Function = ctx.defaultError
    switch (issue.code) {
      case ZodIssueCode.invalid_type:
        if (issue.received === ZodParsedType.undefined) {
          message = t.errors.invalid_type_received_undefined
        } else if (issue.received === ZodParsedType.null) {
          message = t.errors.invalid_type_received_null
        } else {
          message = t.errors.invalid_type(
            t.types[issue.expected],
            t.types[issue.received],
          )
        }
        break
      case ZodIssueCode.invalid_literal:
        message = t.errors.invalid_literal(
          JSON.stringify(issue.expected, jsonStringifyReplacer),
        )
        break
      case ZodIssueCode.unrecognized_keys:
        message = t.errors.unrecognized_keys(joinValues(issue.keys, ', '))
        break
      case ZodIssueCode.invalid_union:
        message = t.errors.invalid_union
        break
      case ZodIssueCode.invalid_union_discriminator:
        message = t.errors.invalid_union_discriminator(
          joinValues(issue.options),
        )
        break
      case ZodIssueCode.invalid_enum_value:
        message = t.errors.invalid_enum_value(
          joinValues(issue.options),
          issue.received.toString(),
        )
        break
      case ZodIssueCode.invalid_arguments:
        message = t.errors.invalid_arguments
        break
      case ZodIssueCode.invalid_return_type:
        message = t.errors.invalid_return_type
        break
      case ZodIssueCode.invalid_date:
        message = t.errors.invalid_date
        break
      case ZodIssueCode.invalid_string:
        if (typeof issue.validation === 'object') {
          if ('startsWith' in issue.validation) {
            message = t.errors.invalid_string.startsWith(
              issue.validation.startsWith,
            )
          } else if ('endsWith' in issue.validation) {
            message = t.errors.invalid_string.endsWith(
              issue.validation.endsWith,
            )
          }
        } else {
          message = t.errors.invalid_string[issue.validation](
            t.validations[issue.validation],
          )
        }
        break
      case ZodIssueCode.too_small:
        const minimum =
          issue.type === 'date'
            ? new Date(issue.minimum as number).toString()
            : issue.minimum.toString()
        const issueType = issue.type === 'bigint' ? 'number' : issue.type
        message =
          t.errors.too_small[issueType][
            issue.exact
              ? 'exact'
              : issue.inclusive
                ? 'inclusive'
                : 'not_inclusive'
          ]
        if (typeof message === 'function') {
          message = message(minimum)
        }

        break
    }

    return { message: message as string }
  }
  return customErrorMap
}
