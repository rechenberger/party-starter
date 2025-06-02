import { Organization } from '@/db/schema-zod'
import { SimpleSeededAvatar } from './simple/SimpleSeededAvatar'

export const OrgAvatar = ({
  org,
  size = 20,
  className,
}: {
  org: Pick<Organization, 'slug'>
  size?: number | string
  className?: string
}) => {
  return (
    <>
      <SimpleSeededAvatar
        size={size}
        variant="bauhaus"
        value={org.slug}
        className={className}
        colors={['#1c1917', '#78716c', '#e7e5e4']}
      />
    </>
  )
}
