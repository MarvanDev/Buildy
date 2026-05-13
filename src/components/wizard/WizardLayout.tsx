import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, Terminal, LogOut, User as UserIcon } from 'lucide-react'
import { useBuildyWizard, useBuildyWizardUtils } from '../../hooks/useBuildyWizard'
import { useAuthStore } from '../../auth/useAuthStore' // IMPORTACIÓN NUEVA (verifica la ruta)
import { StepIndicator } from './StepIndicator'
import { NavigationButtons } from './NavigationButtons'
import { Step1Core } from './steps/Step1Core'
import { Step2Network } from './steps/Step2Network'
import { Step3Database } from './steps/Step3Database'
import { Step4Persistence } from './steps/Step4Persistence'
import { Step5Preset } from './steps/Step5Preset'
import { ResultView } from '../result/ResultView'
import type { UseBuildyWizardReturn } from '../../types/wizard.types'

const stepVariants = {
  enter: { opacity: 0, x: 20 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
}

export function WizardLayout() {
  // 1. El estado base (navegación y datos crudos)
  const wizardStore = useBuildyWizard()
  
  // 2. Las utilidades (validación, YAML, README y variables de cálculo)
  const utils = useBuildyWizardUtils()

  // 3. Autenticación (NUEVO)
  const { user, logout } = useAuthStore()

  const [showResult, setShowResult] = useState(false)

  // Variables calculadas
  const isFirstStep = wizardStore.currentStep === 1
  const isLastStep = wizardStore.currentStep === 5

  const handleNext = () => {
    if (isLastStep) {
      setShowResult(true)
    } else {
      wizardStore.nextStep()
    }
  }

  const handleReset = () => {
    wizardStore.resetWizard()
    setShowResult(false)
  }

  const completedSteps = Array.from({ length: wizardStore.currentStep - 1 }, (_, i) => i + 1)

  const wizardForSteps = {
    ...wizardStore,
    state: wizardStore,
    generatedYaml: utils.generatedYaml,
    generatedReadme: utils.generatedReadme,
    canAdvance: utils.canAdvance,
    totalSteps: 5,
    isFirstStep,
    isLastStep
  } as UseBuildyWizardReturn;

  const renderCurrentStep = () => {
    switch (wizardStore.currentStep) {
      case 1: return <Step1Core wizard={wizardForSteps} />
      case 2: return <Step2Network wizard={wizardForSteps} />
      case 3: return <Step3Database wizard={wizardForSteps} />
      case 4: return <Step4Persistence wizard={wizardForSteps} />
      case 5: return <Step5Preset wizard={wizardForSteps} />
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-background bg-noise flex flex-col">
      <header className="border-b border-border/60 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* LADO IZQUIERDO: Logo y Nombre */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 border border-primary/20">
              <Box className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-gradient-cyan">Buildy</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Docker Compose Generator</p>
            </div>
          </div>
          
          {/* LADO DERECHO: Info del Usuario y Logout (NUEVO) */}
          <div className="flex items-center gap-4">
            {/* Terminal text (Solo en desktop si hay espacio) */}
            <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground mr-2">
              <Terminal className="h-3.5 w-3.5" />
              <span>docker-compose wizard</span>
            </div>

            {user && (
              <div className="flex items-center gap-3 border-l border-border/50 pl-4">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-sm font-semibold text-foreground leading-tight">{user.name}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
                
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                  <UserIcon className="w-4 h-4 text-primary" />
                </div>

                <button 
                  onClick={() => logout()}
                  className="ml-1 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors flex items-center gap-2"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

        </div>
      </header>

      <main className="flex-1 flex items-start justify-center py-8 px-4">
        <div className="w-full max-w-3xl">
          {showResult ? (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <ResultView 
                yaml={utils.generatedYaml} 
                readme={utils.generatedReadme} 
                onReset={handleReset} 
                state={wizardStore} 
              />
            </motion.div>
          ) : (
            <div className="rounded-xl border border-border bg-card shadow-md overflow-hidden">
              <div className="border-b border-border bg-card/80">
                <StepIndicator 
                  currentStep={wizardStore.currentStep} 
                  completedSteps={completedSteps} 
                  onStepClick={wizardStore.goToStep} 
                />
              </div>

              <div className="min-h-[400px]">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div 
                    key={wizardStore.currentStep} 
                    variants={stepVariants} 
                    initial="enter" 
                    animate="center" 
                    exit="exit" 
                    transition={{ duration: 0.2 }}
                  >
                    {renderCurrentStep()}
                  </motion.div>
                </AnimatePresence>
              </div>

              <NavigationButtons 
                onPrev={wizardStore.prevStep} 
                onNext={handleNext} 
                isFirstStep={isFirstStep} 
                isLastStep={isLastStep} 
                canAdvance={utils.canAdvance} 
              />
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-border/40 py-4">
        <div className="max-w-4xl mx-auto px-6 text-center text-xs text-muted-foreground">
          Buildy — Generador de docker-compose para estudiantes universitarios 🎓
        </div>
      </footer>
    </div>
  )
}