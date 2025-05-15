import { getMyUserOrLogin } from '@/auth/getMyUser'
import { SimpleDataCard } from '@/components/simple/SimpleDataCard'
import { ParamsWrapper } from '@/lib/paramsServerContext'

export default ParamsWrapper(async () => {
  const user = await getMyUserOrLogin()

  return <SimpleDataCard data={user} />
})
