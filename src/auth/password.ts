import { hash, verify } from '@node-rs/argon2'

export const hashPassword = async ({ password }: { password: string }) => {
  return hash(password)
}

export const comparePasswords = async ({
  password,
  hash,
}: {
  password: string
  hash: string
}) => {
  return verify(hash, password)
}
