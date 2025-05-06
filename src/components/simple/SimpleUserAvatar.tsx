import { User } from '@/db/schema-zod'
import { cn } from '@/lib/utils'
import SeededAvatar from '../SeededAvatar'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

export const SimpleUserAvatar = ({
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
          <SeededAvatar value={user.name || user.email} />
        </AvatarFallback>
      </Avatar>
    </>
  )
}
