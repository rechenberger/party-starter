export * from '@/components/BaseLayout'
import { BaseLayout } from '@/components/BaseLayout'
import { MainTop } from '@/components/layout/MainTop'

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale?: string }>
}) {
  return (
    <BaseLayout params={params}>
      <MainTop />
      <hr />
      {children}
    </BaseLayout>
  )
}
