import slugifyLib from 'slugify'

export const slugify = (
  text: string,
  options?: Parameters<typeof slugifyLib>[1],
) => {
  if (typeof options !== 'object') {
    options = {}
  }
  return slugifyLib(text, {
    lower: true,
    strict: true,
    trim: true,
    ...options,
  })
}
