import { StartPage } from '@/components/StartPage'
import { ParamsWrapper } from '@/lib/paramsServerContext'

export default ParamsWrapper(async () => {
  return <StartPage />
})
