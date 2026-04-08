import { Network, Globe, Lock } from 'lucide-react'
import { cn } from '../../../lib/utils'
import type { UseBuildyWizardReturn } from '../../../types/wizard.types'

interface StepProps { wizard: UseBuildyWizardReturn }

export function Step2Network({ wizard }: StepProps) {
  const { state, updateState } = wizard
  const hostBinding = `${state.publicAccess ? '0.0.0.0' : '127.0.0.1'}:${state.internalPort}:${state.internalPort}`

  // FUNCIÓN DE VALIDACIÓN DE PUERTO
  const handlePortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = parseInt(e.target.value, 10);
    
    // Si el usuario borra todo, permitimos que quede en 0 o vacío momentáneamente
    if (isNaN(val)) val = 0;
    
    // El límite físico de los puertos TCP es 65535
    if (val > 65535) val = 65535;
    
    // Prevenimos puertos negativos
    if (val < 0) val = 1;

    updateState({ internalPort: val });
  }

  return (
    <div className="p-6 space-y-7 animate-fade-in">
      <div>
        <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-1">Paso 2 de 5</p>
        <h2 className="text-xl font-bold text-foreground">Red y Conexiones</h2>
        <p className="text-sm text-muted-foreground mt-1">Configura cómo se expone tu aplicación en la red.</p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Puerto interno de la aplicación</label>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Network className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input 
                type="number" 
                min={1} 
                max={65535} 
                value={state.internalPort || ''}
                onChange={handlePortChange}
                className="buildy-input w-36 rounded-lg pl-9 pr-3 py-2.5 text-sm font-mono" 
              />
            </div>
            <p className="text-sm text-muted-foreground">Puerto que escucha tu app dentro del contenedor (Máx: 65535).</p>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-muted/20 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">Acceso desde otros equipos</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {state.publicAccess ? 'La app será accesible desde otros equipos en la red local.' : 'Solo tú podrás acceder a la app desde este mismo equipo.'}
              </p>
            </div>
            <button role="switch" aria-checked={state.publicAccess} onClick={() => updateState({ publicAccess: !state.publicAccess })}
              className={cn('relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-200',
                state.publicAccess ? 'bg-primary' : 'bg-muted')}>
              <span className={cn('pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200',
                state.publicAccess ? 'translate-x-5' : 'translate-x-0')} />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Vista previa del binding de puertos</p>
          <div className="grid sm:grid-cols-2 gap-3">
            <div className={cn('rounded-lg border p-4 transition-all duration-200', state.publicAccess ? 'border-primary bg-primary/5' : 'border-border bg-muted/20 opacity-50')}>
              <div className="flex items-center gap-2 mb-2">
                <Globe className={cn('h-4 w-4', state.publicAccess ? 'text-primary' : 'text-muted-foreground')} />
                <span className="text-xs font-semibold text-foreground">Acceso en red local</span>
              </div>
              <code className="text-xs font-mono text-muted-foreground block">0.0.0.0:{state.internalPort}:{state.internalPort}</code>
              <p className="text-xs text-muted-foreground mt-1">Útil en aulas y laboratorios</p>
            </div>
            <div className={cn('rounded-lg border p-4 transition-all duration-200', !state.publicAccess ? 'border-primary bg-primary/5' : 'border-border bg-muted/20 opacity-50')}>
              <div className="flex items-center gap-2 mb-2">
                <Lock className={cn('h-4 w-4', !state.publicAccess ? 'text-primary' : 'text-muted-foreground')} />
                <span className="text-xs font-semibold text-foreground">Solo acceso local</span>
              </div>
              <code className="text-xs font-mono text-muted-foreground block">127.0.0.1:{state.internalPort}:{state.internalPort}</code>
              <p className="text-xs text-muted-foreground mt-1">Más seguro para desarrollo personal</p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/20 px-4 py-3 flex items-center gap-3">
            <span className="text-xs text-muted-foreground">en tu docker-compose:</span>
            <code className="text-xs font-mono text-primary">- "{hostBinding}"</code>
          </div>
        </div>
      </div>
    </div>
  )
}