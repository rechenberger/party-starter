import { getMyUserOrLogin } from '@/auth/getMyUser'
import { SimpleDataCard } from '@/components/simple/SimpleDataCard'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Account',
}

export default async function Page() {
  const user = await getMyUserOrLogin()

  return <SimpleDataCard data={user} />
}
