import React, { useCallback, memo } from 'react'
import { ChevronDown, Wifi, WifiOff, Loader2 } from 'lucide-react'
import { cn } from '../../../lib/utils'
import type { UseBuildyWizardReturn, Technology } from '../../../types/wizard.types'

const SVG_ICONS: Record<string, React.ReactElement> = {
  nodejs: (<svg viewBox="0 0 32 32" fill="currentColor" className="h-7 w-7"><path d="M16 3L3 10.5v13L16 31l13-7.5v-13L16 3zm0 2.6l10.5 6v12L16 29.6 5.5 23.6v-12L16 5.6z" /></svg>),
  python: (<svg viewBox="0 0 32 32" fill="currentColor" className="h-7 w-7"><path d="M16 3C11.1 3 8 5.1 8 8.5v2.5h8v1H6c-3 0-5 2-5 5.5s2 5.5 5 5.5h2v-3c0-3.5 2.5-5.5 6-5.5h8c3 0 5-2 5-5V8.5C27 5 24.7 3 20 3H16zm-3 3.5c.8 0 1.5.7 1.5 1.5S13.8 9.5 13 9.5 11.5 8.8 11.5 8 12.2 6.5 13 6.5z" /><path d="M16 29c4.9 0 8-2.1 8-5.5v-2.5h-8v-1h10c3 0 5-2 5-5.5s-2-5.5-5-5.5h-2v3c0 3.5-2.5 5.5-6 5.5h-8c-3 0-5 2-5 5v3c0 3.5 2.3 6.5 8 6.5H16zm3-3.5c-.8 0-1.5-.7-1.5-1.5s.7-1.5 1.5-1.5 1.5.7 1.5 1.5-.7 1.5-1.5 1.5z" /></svg>),
  php: (<svg viewBox="0 0 48 20" fill="currentColor" className="h-6 w-12"><ellipse cx="24" cy="10" rx="23" ry="9" fill="#8993be" /><text x="24" y="14" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">PHP</text></svg>),
  java: (<svg viewBox="0 0 32 32" fill="currentColor" className="h-7 w-7"><path d="M13 21s-1 .6.7.8c2 .2 3 .2 5.2-.2 0 0 .6.4 1.4.7C15.4 24.4 9.2 22.2 13 21zm-.7-2.8s-1.1.8.6 1c2.3.2 4.1.2 7.2-.3 0 0 .4.4 1 .6C14.8 21.3 7.8 19.7 12.3 18.2zm5.7-5.5c1.3 1.5-.3 2.8-.3 2.8s3.3-1.7 1.8-3.8C18.1 9.7 17 9 22.9 5.6c0 0-9.3 2.3-4.9 7.1z" /><path d="M22.8 24.2s.7.6-.8.9c-2.9.8-12 1.1-14.5.1-.9-.4.8-.9 1.3-.9.5-.1.8 0 .8 0-1-1-63 1.3-2.7 1.9 9.8 1.6 17.9-.7 15.9-2zm-10.3-7.7s-4.6 1.1-1.6 1.5c1.2.2 3.6.1 5.9-.1 1.8-.2 3.7-.6 3.7-.6s-.6.3-1.1.6c-4.3 1.1-12.7.6-10.3-.6 2.1-1 3.4-.8 3.4-.8zm11.2 5.9c4.4-2.3 2.4-4.5 1-4.2-.4.1-.5.2-.5.2s.1-.2.4-.3c2.9-1 5.2 3.1-1 4.7-.1 0 .1-.3.1-.4zM15.3 2s2.6 2.6-2.5 6.7c-4.1 3.2-.9 5.1 0 7.2-2.4-2.1-4.1-4-2.9-5.8C11.7 7.3 16.7 6 15.3 2z" /></svg>),
  go: (<svg viewBox="0 0 32 32" fill="currentColor" className="h-7 w-7"><path d="M2 15h4c.3 0 .5-.2.5-.5v-.1c0-.3-.2-.5-.5-.5H2c-.3 0-.5.2-.5.5v.1c0 .3.2.5.5.5zm5 0h4c.3 0 .5-.2.5-.5v-.1c0-.3-.2-.5-.5-.5H7c-.3 0-.5.2-.5.5v.1c0 .3.2.5.5.5z" /><path d="M4 18c0 4.4 3.6 8 8 8h8c4.4 0 8-3.6 8-8s-3.6-8-8-8H12c-4.4 0-8 3.6-8 8zm5.5-2.5h2.8l-.7 1.4H9.5l.7-1.4zm8.5 3.8c-.8.8-1.9 1.2-3.2 1.2-2.5 0-4-1.8-4-4.2 0-2.4 1.7-4.3 4.2-4.3.9 0 1.8.3 2.4.8l-.7.8c-.4-.4-.9-.6-1.5-.6-1.4 0-2.4 1.1-2.4 2.9 0 1.7.9 2.9 2.3 2.9.7 0 1.3-.2 1.8-.7v-1.1h-1.6v-1h2.8v2.4c0 .3 0 .5-.1.9zm5.3-.3c0 .1-.1.2-.2.2h-1l-2.4-3.3v3.2c0 .1-.1.2-.2.2h-1c-.1 0-.2-.1-.2-.2v-6c0-.1.1-.2.2-.2h1c.1 0 .2.1.2.2v3.1l2.3-3.1c0-.1.1-.1.2-.1H23c.1 0 .2.1.1.2L20.6 16l2.7 3.5z" /></svg>),
}

const TechIcon = memo(({ id }: { id: string }) => SVG_ICONS[id] ?? <span className="text-lg font-mono font-bold">{id.toUpperCase().slice(0, 2)}</span>)
TechIcon.displayName = 'TechIcon'

interface StepProps { wizard: UseBuildyWizardReturn }

function VersionSourceBadge({ isLive, isLoading }: { isLive: boolean; isLoading: boolean }) {
  if (isLoading) return <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-muted/50 text-muted-foreground border border-border/50"><Loader2 className="h-2.5 w-2.5 animate-spin" />Actualizando…</span>
  if (isLive) return <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"><Wifi className="h-2.5 w-2.5" />Docker Hub Live</span>
  return <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full bg-muted/50 text-muted-foreground border border-border/50"><WifiOff className="h-2.5 w-2.5" />Offline fallback</span>
}

export function Step1Core({ wizard }: StepProps) {
  const { state, updateState, technologies, versionLoad } = wizard
  const selectedTech = technologies.find((t) => t.id === state.language)

  const handleLanguageSelect = useCallback((tech: Technology) => {
    updateState({
      language: tech.id,
      version: tech.versions[0]?.value ?? '',
      startCommand: tech.defaultCommand,
      internalPort: tech.defaultPort,
    })
  }, [updateState])

  const isLiveForSelected = state.language != null && versionLoad.liveVersionSources[state.language] === true

  return (
    <div className="p-6 space-y-7 animate-fade-in">
      <div>
        <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-1">Paso 1 de 5</p>
        <h2 className="text-xl font-bold text-foreground">Core del Proyecto</h2>
        <p className="text-sm text-muted-foreground mt-1">Selecciona el lenguaje base y configura el comando de inicio.</p>
      </div>

      <div>
        <label className="text-sm font-medium text-foreground mb-3 block">Lenguaje de programación</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {technologies.map((tech) => {
            const isSelected = state.language === tech.id
            return (
              <button 
                key={tech.id} 
                onClick={() => handleLanguageSelect(tech)}
                className={cn(
                  'relative flex flex-col items-center gap-2.5 rounded-lg border p-4 interactive-card cursor-pointer text-center transition-all duration-75',
                  isSelected 
                    ? `card-selected ${tech.bgClass} border-primary` 
                    : 'border-border bg-muted/30 hover:bg-muted/50 hover:border-primary/50'
                )}
              >
                <span className={cn('transition-colors duration-75', isSelected ? tech.colorClass : 'text-muted-foreground')}>
                  <TechIcon id={tech.id} />
                </span>
                <div>
                  <p className={cn('text-sm font-semibold', isSelected ? 'text-foreground' : 'text-muted-foreground')}>{tech.label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">{tech.description}</p>
                </div>
                {isSelected && <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />}
              </button>
            )
          })}
        </div>
      </div>

      {selectedTech && (
        <div className="grid sm:grid-cols-2 gap-4 animate-slide-up">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">Versión de {selectedTech.label}</label>
              <VersionSourceBadge isLive={isLiveForSelected} isLoading={versionLoad.isLoadingVersions && !isLiveForSelected} />
            </div>
            <div className="relative">
              <select 
                value={state.version} 
                onChange={(e) => updateState({ version: e.target.value })}
                className="buildy-input w-full rounded-lg px-3 py-2.5 pr-9 text-sm appearance-none bg-input text-foreground cursor-pointer"
              >
                {selectedTech.versions.map((v) => (
                  <option key={v.value} value={v.value}>{v.label}{v.recommended ? 'Recomendación Unillanos' : ''}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Comando de inicio</label>
            <input 
              type="text" 
              value={state.startCommand} 
              onChange={(e) => updateState({ startCommand: e.target.value })}
              className="buildy-input w-full rounded-lg px-3 py-2.5 text-sm font-mono" 
            />
          </div>
        </div>
      )}
    </div>
  )
}