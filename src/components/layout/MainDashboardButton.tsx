import Link from 'next/link'
import { Button } from '../ui/button'

export const MainDashboardButton = () => {
  return (
    <Button variant={'outline'} asChild>
      <Link href={'/app'}>Dashboard</Link>
    </Button>
  )
}
