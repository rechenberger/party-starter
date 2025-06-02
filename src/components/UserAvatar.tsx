import { User } from '@/db/schema-zod'
import { cn } from '@/lib/utils'
import { SimpleSeededAvatar } from './simple/SimpleSeededAvatar'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export const UserAvatar = ({
  user,
  className,
}: {
  user: Pick<User, 'name' | 'email' | 'image'>
  className?: string
}) => {
  return (
    <>
      <Avatar className={cn(className)}>
        <AvatarImage
          src={user.image || undefined}
          alt={user.name || 'Member'}
        />
        <AvatarFallback asChild>
          <SimpleSeededAvatar
            value={user.email}
            variant="beam"
            // colors={['#44403c', '#d6d3d1']}
          />
        </AvatarFallback>
      </Avatar>
    </>
  )
}
