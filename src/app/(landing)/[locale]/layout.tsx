import { MainTopLayout } from '@/components/layout/MainTopLayout'
export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale?: string }>
}) {
  return <MainTopLayout>{children}</MainTopLayout>
}
