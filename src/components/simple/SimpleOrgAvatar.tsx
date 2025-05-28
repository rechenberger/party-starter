import { Organization } from '@/db/schema-zod'
import SeededAvatar from '../SeededAvatar'

export const SimpleOrgAvatar = ({
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
      <SeededAvatar
        size={size}
        variant="bauhaus"
        value={org.slug}
        className={className}
      />
    </>
  )
}
