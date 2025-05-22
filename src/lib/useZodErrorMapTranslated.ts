import { ZodErrorTranslations } from '@/i18n/translations/zodTranslations.en'
import { z, ZodIssueCode, ZodParsedType } from 'zod'

/*
inspired by https://github.com/aiji42/zod-i18n/blob/main/packages/core/src/index.ts
*/
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
