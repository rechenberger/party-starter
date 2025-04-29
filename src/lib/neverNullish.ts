export const neverNullish = <T extends (...args: any[]) => Promise<any>>(
  fn: T,
  fallbackFn: () => Promise<never> | never,
): ((
  ...options: Parameters<T>
) => Promise<Exclude<Awaited<ReturnType<T>>, null | undefined>>) => {
  return async (...options: Parameters<T>) => {
    const result = await fn(...options)
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
