import { TopHeader } from '@/components/TopHeader'
import { ParamsWrapper } from '@/lib/paramsServerContext'

export default ParamsWrapper(
  async ({
    params,
    searchParams,
  }: {
    params: Promise<{ orgSlug: string }>
    searchParams: Promise<{ say: string }>
  }) => {
    const { orgSlug } = await params
    const { say } = await searchParams
    return (
      <>
        <TopHeader>OrgPage for {orgSlug}</TopHeader>
        <div>{say}</div>
      </>
    )
  },
)
