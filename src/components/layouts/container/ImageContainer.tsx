import { cn } from '@/lib'

type ImageContainerProps = {
  className?: string
  children: React.ReactNode
}

export const ImageContainer = ({
  className,
  children
}: ImageContainerProps) => {
  return (
    <div
      className={cn(
        'h-[430px] rounded-xl bg-gray-900/5 p-4 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl',
        className
      )}>
      {children}
    </div>
  )
}
