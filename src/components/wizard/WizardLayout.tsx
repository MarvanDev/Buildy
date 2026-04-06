import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Box, Terminal } from 'lucide-react'
import { useBuildyWizard, useBuildyWizardUtils } from '../../hooks/useBuildyWizard'
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

  const [showResult, setShowResult] = useState(false)

  // Variables calculadas manualmente (ya que las quitamos del store principal para optimizar)
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

  // Reconstruimos el objeto 'wizard' tal cual lo esperan tus Steps (StepProps)
  // Esto engaña felizmente a TypeScript y a tus componentes originales
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
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 border border-primary/20">
              <Box className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-gradient-cyan">Buildy</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Docker Compose Generator</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Terminal className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">docker-compose wizard</span>
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