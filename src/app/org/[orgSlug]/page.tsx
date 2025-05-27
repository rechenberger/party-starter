import { TopHeader } from '@/components/TopHeader'
import { getTranslations } from '@/i18n/getTranslations'
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
    const t = await getTranslations()
    return (
      <>
        <TopHeader>{t.org.dashboardTopHeader(orgSlug)}</TopHeader>
        <div>{say}</div>
      </>
    )
  },
)
