/**
 * StepIndicator — Barra de progreso visual del wizard.
 * Muestra los 5 pasos con estado: completado / activo / pendiente.
 */
import { Check } from 'lucide-react'
import { cn } from '../../lib/utils'

interface Step {
  number: number
  label: string
}

const STEPS: Step[] = [
  { number: 1, label: 'Core' },
  { number: 2, label: 'Red' },
  { number: 3, label: 'Base de Datos' },
  { number: 4, label: 'Persistencia' },
  { number: 5, label: 'Preset' },
]

interface StepIndicatorProps {
  currentStep: number
  onStepClick?: (step: number) => void
  completedSteps: number[]
}

export function StepIndicator({
  currentStep,
  onStepClick,
  completedSteps,
}: StepIndicatorProps) {
  return (
    <div className="w-full px-6 py-5">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step.number)
          const isActive = step.number === currentStep
          const isPast = step.number < currentStep
          const isClickable = isPast || isCompleted

          return (
            <div key={step.number} className="flex items-center flex-1">
              {/* Círculo del paso */}
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={() => isClickable && onStepClick?.(step.number)}
                  disabled={!isClickable}
                  className={cn(
                    'relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
                    'text-sm font-semibold transition-all duration-300',
                    'ring-2 ring-offset-2 ring-offset-background',
                    {
                      // Activo
                      'bg-primary text-primary-foreground ring-primary shadow-glow scale-110':
                        isActive,
                      // Completado
                      'bg-primary/20 text-primary ring-primary/40 cursor-pointer hover:bg-primary/30':
                        isPast && !isActive,
                      // Pendiente
                      'bg-muted text-muted-foreground ring-transparent':
                        !isActive && !isPast,
                    }
                  )}
                  aria-label={`Paso ${step.number}: ${step.label}`}
                >
                  {isPast ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span>{step.number}</span>
                  )}

                  {/* Pulso animado en paso activo */}
                  {isActive && (
                    <span className="absolute inset-0 rounded-full animate-ping bg-primary/30" />
                  )}
                </button>

                {/* Label debajo del círculo */}
                <span
                  className={cn(
                    'hidden sm:block text-xs font-medium transition-colors duration-300 whitespace-nowrap',
                    {
                      'text-primary': isActive,
                      'text-muted-foreground/70': !isActive && !isPast,
                      'text-primary/70': isPast && !isActive,
                    }
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Línea conectora entre pasos */}
              {index < STEPS.length - 1 && (
                <div className="flex-1 mx-2 mb-5 sm:mb-0">
                  <div
                    className={cn(
                      'h-px step-line',
                      step.number < currentStep
                        ? 'bg-primary/50'
                        : 'bg-border'
                    )}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
