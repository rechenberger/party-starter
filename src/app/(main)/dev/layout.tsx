import { NavTabs } from './NavTabs'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavTabs
        className="self-center"
        tabs={[
          { name: 'Public Secret', href: '/dev/public-secret' },
          { name: 'Dialog', href: '/dev/dialog' },
          { name: 'Kv', href: '/dev/kv' },
        ]}
      />
      {children}
    </>
  )
}
