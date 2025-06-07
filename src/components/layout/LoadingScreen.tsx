'use client'

import { useTranslations } from '@/i18n/useTranslations'
import { BRAND } from '@/lib/starter.config'
import Image from 'next/image'

export const LoadingScreen = () => {
  const t = useTranslations()
  return (
    <div className="bg-background flex-1 w-full flex flex-col items-center justify-center">
      <div className="mx-8 animate-pulse">
        <Image
          src={BRAND.logoUrl}
          width={200}
          height={200}
          alt={t.standardWords.logo}
          priority
        />
      </div>
    </div>
  )
}
