import { MainTop } from '@/components/layout/MainTop'

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale?: string }>
}) {
  return (
    <>
      <MainTop />
      <hr />
      {children}
    </>
  )
}
