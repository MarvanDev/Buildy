import { useState, useEffect, useDeferredValue } from 'react'
import { motion } from 'framer-motion'
import { RotateCcw, FileCode, BookOpen, Sparkles, Network, Terminal, Edit2 } from 'lucide-react'
import { cn } from '../../lib/utils'
import { CodeBlock } from './CodeBlock'
import { DownloadButton } from './DownloadButton'
import { ArchitectureDiagram } from './ArchitectureDiagram'
import { TECHNOLOGIES } from '../../constants/technologies'
import type { WizardState } from '../../types/wizard.types'


interface ResultViewProps {
  yaml: string; readme: string; onReset: () => void; state: WizardState
}

type ActiveTab = 'yaml' | 'readme' | 'diagram'

export function ResultView({ yaml, readme, onReset, state }: ResultViewProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>('yaml')
  const [customProjectName, setCustomProjectName] = useState('')

// MAGIA DE RENDIMIENTO: Diferimos la actualización del estado pesado
  const deferredState = useDeferredValue(state)
  
  // 1. FABIÁN: Diferir también el string del nombre del proyecto
  // Esto evita que el diagrama parpadee o cause lag al escribir rápido en el input
  const deferredProjectName = useDeferredValue(customProjectName)

  useEffect(() => {
    setCustomProjectName(`${state.language ?? 'app'}-${state.version?.replace(/[^a-z0-9]/gi, '') || 'v1'}`)
  }, [state.language, state.version])

  const tech = TECHNOLOGIES.find((t) => t.id === state.language)

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-primary/20 bg-primary/5 p-6">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 border border-primary/25">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">¡Todo listo! 🎉</h2>
              <div className="flex items-center gap-2 mt-1.5 group">
                <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
                <input 
                  value={customProjectName}
                  onChange={(e) => setCustomProjectName(e.target.value.replace(/[^a-z0-9-_]/gi, ''))}
                  className="bg-transparent border-b border-transparent hover:border-primary/30 focus:border-primary focus:outline-none font-mono text-sm text-primary w-48 transition-colors"
                />
                <Edit2 className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100" />
              </div>
            </div>
          </div>
          <button onClick={onReset} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground border border-border px-3 py-1.5 rounded-lg hover:bg-muted/30">
            <RotateCcw className="h-3.5 w-3.5" /> Nuevo
          </button>
        </div>
      </motion.div>

      <div className="flex justify-center">
        <DownloadButton yaml={yaml} readme={readme} projectName={customProjectName} />
      </div>

<div className="space-y-3">
        <div className="flex items-center gap-1 border-b border-border">
          <TabButton active={activeTab === 'yaml'} onClick={() => setActiveTab('yaml')} icon={<FileCode className="h-3.5 w-3.5" />} label="docker-compose.yml" />
          <TabButton active={activeTab === 'readme'} onClick={() => setActiveTab('readme')} icon={<BookOpen className="h-3.5 w-3.5" />} label="README.md" />
          <TabButton active={activeTab === 'diagram'} onClick={() => setActiveTab('diagram')} icon={<Network className="h-3.5 w-3.5" />} label="Arquitectura Visual" />
        </div>

        <div className="animate-fade-in">
          {activeTab === 'yaml' && <CodeBlock code={yaml} language="yaml" filename="docker-compose.yml" />}
          {activeTab === 'readme' && <CodeBlock code={readme} language="markdown" filename="README.md" />}
          
          {/* 2. FABIÁN: Pasar las variables diferidas al componente de Camilo */}
          {activeTab === 'diagram' && (<ArchitectureDiagram state={deferredState} projectName={deferredProjectName} />
          )}
        </div>
      </div>
    </div>
  )
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button onClick={onClick} className={cn(
      'flex items-center gap-2 px-4 py-2 text-xs font-medium border-b-2 transition-all',
      active ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
    )}>
      {icon} {label}
    </button>
  )
}