import { FolderOpen, HardDrive } from 'lucide-react'
import { cn } from '../../../lib/utils'
import type { UseBuildyWizardReturn } from '../../../types/wizard.types'

interface StepProps { wizard: UseBuildyWizardReturn }

const PATH_EXAMPLES = ['/app/uploads', '/app/public/files', '/var/www/html/uploads', '/app/storage']

export function Step4Persistence({ wizard }: StepProps) {
  const { state, updatePersistence } = wizard

  return (
    <div className="p-6 space-y-7 animate-fade-in">
      <div>
        <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-1">Paso 4 de 5</p>
        <h2 className="text-xl font-bold text-foreground">Persistencia de Archivos</h2>
        <p className="text-sm text-muted-foreground mt-1">Configura si tu aplicación almacena archivos subidos por usuarios.</p>
      </div>

      <div className="rounded-xl border border-border bg-muted/20 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
              <HardDrive className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">¿Tu app sube archivos locales?</p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Si tu app guarda imágenes u otros archivos, activa esta opción para mapear la carpeta al host.
              </p>
            </div>
          </div>
          <button role="switch" aria-checked={state.persistence.enabled}
            onClick={() => updatePersistence({ enabled: !state.persistence.enabled })}
            className={cn('relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-200',
              state.persistence.enabled ? 'bg-primary' : 'bg-muted')}>
            <span className={cn('pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200',
              state.persistence.enabled ? 'translate-x-5' : 'translate-x-0')} />
          </button>
        </div>
      </div>

      {state.persistence.enabled && (
        <div className="space-y-4 animate-slide-up">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Ruta de la carpeta dentro del contenedor</label>
            <div className="relative">
              <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input type="text" value={state.persistence.localPath}
                onChange={(e) => updatePersistence({ localPath: e.target.value })}
                placeholder="/app/uploads"
                className="buildy-input w-full rounded-lg pl-9 pr-3 py-2.5 text-sm font-mono" />
            </div>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Rutas comunes:</p>
            <div className="flex flex-wrap gap-2">
              {PATH_EXAMPLES.map((example) => (
                <button key={example} onClick={() => updatePersistence({ localPath: example })}
                  className={cn('text-xs font-mono px-2.5 py-1 rounded-md border transition-all duration-150',
                    state.persistence.localPath === example
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-muted/30 text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  )}>
                  {example}
                </button>
              ))}
            </div>
          </div>
          {state.persistence.localPath && (
            <div className="rounded-lg border border-border/60 bg-muted/20 p-4 font-mono text-xs space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Mapeo resultante</p>
              <div className="flex gap-2"><span className="text-muted-foreground">host:</span><code className="text-primary">./uploads/</code></div>
              <div className="flex gap-2"><span className="text-muted-foreground">container:</span><code className="text-primary">{state.persistence.localPath}</code></div>
              <div className="flex gap-2 pt-1 border-t border-border/40 mt-1">
                <span className="text-muted-foreground">yaml:</span>
                <code className="text-amber-400/80">- "./uploads:{state.persistence.localPath}"</code>
              </div>
            </div>
          )}
        </div>
      )}

      {!state.persistence.enabled && (
        <div className="rounded-lg border border-border/40 bg-muted/10 px-4 py-3 text-xs text-muted-foreground">
          Sin persistencia habilitada — los archivos del contenedor se perderán al reiniciarlo.
        </div>
      )}
    </div>
  )
}
