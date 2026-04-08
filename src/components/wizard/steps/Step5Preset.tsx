import { Code2, Database, Network, Plus } from 'lucide-react'
import { cn } from '../../../lib/utils'
import { SUBJECT_PRESETS } from '../../../constants/subjects'
import type { UseBuildyWizardReturn, SubjectPresetId } from '../../../types/wizard.types'

interface StepProps { wizard: UseBuildyWizardReturn }

const PRESET_ICONS: Record<string, React.ReactNode> = { 
  Code2: <Code2 className="h-5 w-5" />, 
  Database: <Database className="h-5 w-5" />, 
  Network: <Network className="h-5 w-5" /> 
}

function getExtraLabel(extra: string, dbChoice: string): string {
  if (extra === 'adminer_or_pgadmin') return dbChoice === 'postgresql' ? 'pgAdmin' : 'Adminer'
  if (extra === 'cadvisor') return 'cAdvisor'
  return extra
}

export function Step5Preset({ wizard }: StepProps) {
  const { state, updateState } = wizard

  return (
    <div className="p-6 space-y-7 animate-fade-in">
      <div>
        <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-1">Paso 5 de 5</p>
        <h2 className="text-xl font-bold text-foreground">Preset de Materia</h2>
        <p className="text-sm text-muted-foreground mt-1">Selecciona la materia universitaria para adaptar el entorno.</p>
      </div>

      <div className="space-y-3">
        {SUBJECT_PRESETS.map((preset) => {
          const isSelected = state.subjectPreset === preset.id
          return (
            <button key={preset.id} onClick={() => updateState({ subjectPreset: preset.id as SubjectPresetId })}
              className={cn('w-full flex items-start gap-4 rounded-xl border p-5 text-left interactive-card transition-all duration-200',
                isSelected ? 'card-selected bg-primary/5 border-primary shadow-sm' : 'border-border bg-muted/20 hover:bg-muted/40')}>
              <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition-colors',
                isSelected ? 'bg-primary/15 border-primary/30 text-primary' : 'bg-muted/50 border-border text-muted-foreground')}>
                {PRESET_ICONS[preset.icon]}
              </div>
              <div className="flex-1 min-w-0">
                <p className={cn('text-sm font-semibold', isSelected ? 'text-foreground' : 'text-muted-foreground')}>{preset.label}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{preset.description}</p>
                
                {/* Etiquetas de herramientas extra que inyectará el preset */}
                {preset.extras.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {preset.extras.map((extra) => (
                      <span key={extra} className="flex items-center gap-1 text-xs font-mono bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">
                        <Plus className="h-2.5 w-2.5" />{getExtraLabel(extra, state.database.choice ?? 'mysql')}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className={cn('mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 transition-all duration-200',
                isSelected ? 'border-primary bg-primary' : 'border-border')} />
            </button>
          )
        })}
      </div>

      {/* RESUMEN FINAL CORREGIDO */}
      <div className="rounded-xl border border-border/60 bg-muted/20 p-5">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Resumen de tu configuración</p>
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
          {[ 
            { label: 'Lenguaje', value: state.language ? `${state.language} (${state.version.split('-')[0] || state.version})` : '—' }, 
            { label: 'Puerto', value: String(state.internalPort || '—') }, 
            { label: 'Acceso', value: state.publicAccess ? '0.0.0.0 (red local)' : '127.0.0.1 (local)' }, 
            { label: 'Base de datos', value: state.database.choice === 'none' ? 'Ninguna' : state.database.choice }, 
            { label: 'Persistencia', value: state.persistence.enabled ? state.persistence.localPath : 'No' }, 
            { label: 'Comando', value: state.startCommand || '—' } 
          ].map(({ label, value }) => (
            <div key={label} className="flex items-baseline gap-2">
              <span className="text-muted-foreground w-28 shrink-0">{label}</span>
              <span className="font-mono text-foreground/80 truncate" title={value}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}