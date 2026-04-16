import { Network, Globe, Lock, AlertCircle } from "lucide-react";
import { cn } from "../../../lib/utils";
import type { UseBuildyWizardReturn } from "../../../types/wizard.types";
import { useEffect, useState } from "react";
import { isPortReserved } from "@/constants/network.constants";

interface StepProps {
  wizard: UseBuildyWizardReturn;
}

export function Step2Network({ wizard }: StepProps) {
  const { state, updateState } = wizard;
  const hostBinding = `${state.publicAccess ? "0.0.0.0" : "127.0.0.1"}:${state.internalPort}:${state.internalPort}`;

  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    validatePort(state.internalPort.toString());
  }, [state.internalPort]);

  const validatePort = (val: string) => {
    if (!val || val === "" || val === "0") {
      setError("El puerto es obligatorio.");
      return;
    }

    const num = parseInt(val, 10);
    if (num < 1 || num > 65535) {
      setError("El puerto debe estar entre 1 y 65535.");
      return;
    }

    if (isPortReserved(num)) {
      setError(
        `Este puerto (${num}) es reservado o conflictivo. Por favor, elige otro (ej. 8080).`,
      );
      return;
    }
    setError(null);
  };

  const handlePortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, "");
    let val = rawValue === "" ? 0 : parseInt(rawValue, 10);
    if (val > 65535) val = 65535;
    updateState({ internalPort: val });
    validatePort(rawValue);
  };

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
          <div className="flex items-start gap-3">
            
            {/* NUEVO ENVOLTORIO FLEX-COL PARA QUE EL ERROR EMPUJE EL CONTENIDO HACIA ABAJO */}
            <div className="flex flex-col">
              <div className="relative">
                <Network className={cn("absolute left-3 top-2.5 h-4 w-4 pointer-events-none transition-colors", error ? "text-destructive" : "text-muted-foreground")} />
                
                <input 
                  type="text" 
                  inputMode="numeric"
                  value={state.internalPort === 0 ? '' : state.internalPort}
                  onChange={handlePortChange}
                  className={cn(
                    "buildy-input w-36 rounded-lg pl-9 pr-3 py-2.5 text-sm font-mono transition-colors outline-none",
                    error 
                      ? "border-destructive focus:border-destructive focus:ring-1 focus:ring-destructive/30" 
                      : "focus:border-primary/50 focus:ring-1 focus:ring-primary"
                  )} 
                  placeholder="Ej. 3000"
                />
              </div>
              {/* MENSAJE DE ERROR */}
              {error && (
                <div className="flex items-start gap-1.5 mt-2 w-56 animate-fade-in text-destructive">
                  <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                  <p className="text-[11px] font-medium leading-snug">{error}</p>
                </div>
              )}

            </div>
            
            <p className={cn("text-sm text-muted-foreground pt-2 transition-opacity", error && "opacity-0 sm:opacity-100")}>
              Puerto que escucha tu app dentro del contenedor (Máx: 65535).
            </p>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-muted/20 p-5 mt-4">
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