import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { cn } from '../../lib/utils'

interface NavigationButtonsProps {
  onPrev: () => void
  onNext: () => void
  isFirstStep: boolean
  isLastStep: boolean
  canAdvance: boolean
}

export function NavigationButtons({ onPrev, onNext, isFirstStep, isLastStep, canAdvance }: NavigationButtonsProps) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-5 border-t border-border">
      <button onClick={onPrev} disabled={isFirstStep}
        className={cn('flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-lg text-sm font-medium border border-border transition-all duration-200',
          'disabled:opacity-0 disabled:pointer-events-none hover:bg-muted hover:border-muted-foreground/30 active:scale-95 text-muted-foreground hover:text-foreground',
          'flex-1 sm:flex-none')}>
        <ArrowLeft className="h-4 w-4 shrink-0" />
        Anterior
      </button>
      
      <button onClick={onNext} disabled={!canAdvance}
        className={cn('flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95 whitespace-nowrap',
          'flex-1 sm:flex-none',
          canAdvance
            ? isLastStep
              ? 'bg-primary text-primary-foreground shadow-glow hover:brightness-110 hover:shadow-glow-lg'
              : 'bg-primary text-primary-foreground hover:brightness-110'
            : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50')}>
        {isLastStep ? (
          <><Sparkles className="h-4 w-4 shrink-0" />Generar Compose</>
        ) : (
          <>Siguiente<ArrowRight className="h-4 w-4 shrink-0" /></>
        )}
      </button>
    </div>
  )
}