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
    <div className="flex items-center justify-between px-6 py-5 border-t border-border">
      <button onClick={onPrev} disabled={isFirstStep}
        className={cn('flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-border transition-all duration-200',
          'disabled:opacity-0 disabled:pointer-events-none hover:bg-muted hover:border-muted-foreground/30 active:scale-95 text-muted-foreground hover:text-foreground')}>
        <ArrowLeft className="h-4 w-4" />
        Anterior
      </button>
      <button onClick={onNext} disabled={!canAdvance}
        className={cn('flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95',
          canAdvance
            ? isLastStep
              ? 'bg-primary text-primary-foreground shadow-glow hover:brightness-110 hover:shadow-glow-lg'
              : 'bg-primary text-primary-foreground hover:brightness-110'
            : 'bg-muted text-muted-foreground cursor-not-allowed opacity-50')}>
        {isLastStep ? (<><Sparkles className="h-4 w-4" />Generar docker-compose</>) : (<>Siguiente<ArrowRight className="h-4 w-4" /></>)}
      </button>
    </div>
  )
}
