'use client'

// source: https://originui.com/input

import { useId } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import type { Button } from './button'

export const InputWithButton = ({
  label,
  icon,
  inputProps,
  buttonProps,
}: {
  label?: string
  icon: React.ReactNode
  inputProps: React.ComponentProps<typeof Input> & {
    'data-testid'?: string
  }
  buttonProps: React.ComponentProps<typeof Button>
}) => {
  const id = useId()
  const { className: classNameInput, ...restInputProps } = inputProps
  const { className: classNameButton, ...restButtonProps } = buttonProps
  return (
    <div className="*:not-first:mt-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <div className="flex rounded-md shadow-xs">
        <Input
          id={id}
          className={cn(
            '-me-px flex-1 rounded-e-none shadow-none focus-visible:z-10',
            classNameInput,
          )}
          {...restInputProps}
        />
        <button
          className={cn(
            'border-input bg-background text-muted-foreground/80 hover:bg-accent hover:text-accent-foreground focus-visible:border-ring focus-visible:ring-ring/50 inline-flex w-9 items-center justify-center rounded-e-md border text-sm transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
            classNameButton,
          )}
          {...restButtonProps}
        >
          {icon}
        </button>
      </div>
    </div>
  )
}
