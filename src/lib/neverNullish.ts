export const neverNullish = <T, Options>(
  fn: (options: Options) => Promise<T | null | undefined>,
  fallbackFn: () => Promise<never> | never,
): ((options: Options) => Promise<T>) => {
  return async (options: Options) => {
    const result = await fn(options)
    if (result === null || result === undefined) {
      return await fallbackFn()
    }
    return result
  }
}

export const throwError = (error: string | Error) => {
  return () => {
    throw error instanceof Error ? error : new Error(error)
  }
}
