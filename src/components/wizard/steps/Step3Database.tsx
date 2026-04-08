import { Database, RefreshCw, Eye, EyeOff } from 'lucide-react'
import React, { useState, memo } from 'react'
import { cn } from '../../../lib/utils'
import { generateSecureCredentials } from '../../../hooks/useBuildyWizard'
import type { UseBuildyWizardReturn } from '../../../types/wizard.types'
import { DB_OPTIONS } from '../../../constants/db.constants'

interface StepProps { wizard: UseBuildyWizardReturn }

const DbCard = memo(({ db, isSelected, onClick }: { db: any, isSelected: boolean, onClick: () => void }) => (
  <button onClick={onClick}
    className={cn('flex flex-col items-center gap-2.5 rounded-lg border p-4 interactive-card cursor-pointer text-center transition-all duration-75',
      isSelected ? `card-selected ${db.bgClass}` : 'border-border bg-muted/30 hover:bg-muted/50')}>
    <span className="text-2xl leading-none">{db.icon}</span>
    <div>
      <p className={cn('text-sm font-semibold', isSelected ? 'text-foreground' : 'text-muted-foreground')}>{db.label}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{db.description}</p>
    </div>
  </button>
))
DbCard.displayName = 'DbCard'

export function Step3Database({ wizard }: StepProps) {
  const { state, updateDatabase } = wizard
  const [showPassword, setShowPassword] = useState(false)
  const [generating, setGenerating] = useState(false)

  const handleGenerateCredentials = () => {
    setGenerating(true)
    const creds = generateSecureCredentials()
    updateDatabase({ name: creds.dbName, user: creds.user, password: creds.password })
    setTimeout(() => setGenerating(false), 600)
  }

  return (
    <div className="p-6 space-y-7 animate-fade-in">
      <div>
        <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-1">Paso 3 de 5</p>
        <h2 className="text-xl font-bold text-foreground">Base de Datos</h2>
        <p className="text-sm text-muted-foreground mt-1">Selecciona el motor de base de datos para tu proyecto.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {DB_OPTIONS.map((db) => (
          <DbCard
            key={db.id}
            db={db}
            isSelected={state.database.choice === db.id}
            onClick={() => updateDatabase({ choice: db.id })}
          />
        ))}
      </div>

      {state.database.choice !== 'none' && (
        <div className="space-y-4 animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium text-foreground">Credenciales de la base de datos</p>
            </div>
            <button onClick={handleGenerateCredentials}
              className="flex items-center gap-1.5 text-xs text-primary px-3 py-1.5 rounded-md border border-primary/30 bg-primary/10 hover:bg-primary/15 transition-all duration-200 active:scale-95">
              <RefreshCw className={cn('h-3 w-3', generating && 'animate-spin')} />
              Generar seguras
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wide">Nombre de la DB</label>
              <input type="text" value={state.database.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateDatabase({ name: e.target.value })} placeholder="myapp_db" className="buildy-input w-full rounded-lg px-3 py-2.5 text-sm font-mono" />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wide">Usuario</label>
              <input type="text" value={state.database.user} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateDatabase({ user: e.target.value })} placeholder="admin" className="buildy-input w-full rounded-lg px-3 py-2.5 text-sm font-mono" />
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block uppercase tracking-wide">Contraseña</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={state.database.password} onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateDatabase({ password: e.target.value })} placeholder="Genera una contraseña segura →" className="buildy-input w-full rounded-lg px-3 py-2.5 pr-10 text-sm font-mono" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}