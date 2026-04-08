import React, { useState } from 'react';
import { Box, Settings, ArrowRight, ArrowLeft } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TECHNOLOGIES = [
  { id: 'nodejs', label: 'Node.js', description: 'Entorno de ejecución para JavaScript', colorClass: 'text-emerald-400', borderClass: 'border-emerald-400/30', versions: ['22-alpine Recomendación Unillanos', '20-alpine', '18-alpine'], defaultCommand: 'npm start' },
  { id: 'python', label: 'Python', description: 'Lenguaje de propósito general', colorClass: 'text-blue-400', borderClass: 'border-blue-400/30', versions: ['3.12-slim', '3.11-slim'], defaultCommand: 'python app.py' },
  { id: 'php', label: 'PHP', description: 'Scripting para servidores web', colorClass: 'text-violet-400', borderClass: 'border-violet-400/30', versions: ['8.3-apache', '8.2-apache'], defaultCommand: 'apache2-foreground' },
  { id: 'java', label: 'Java', description: 'OpenJDK empresarial', colorClass: 'text-orange-400', borderClass: 'border-orange-400/30', versions: ['21-jdk-slim', '17-jdk-slim'], defaultCommand: 'java -jar app.jar' },
  { id: 'go', label: 'Go', description: 'Lenguaje compilado rápido', colorClass: 'text-cyan-400', borderClass: 'border-cyan-400/30', versions: ['1.23-alpine', '1.22-alpine'], defaultCommand: './app' },
];

export default function MinimalWizard() {
  const [step, setStep] = useState(1);
  const [state, setState] = useState({
    language: 'nodejs',
    version: '22-alpine Recomendación Unillanos',
    startCommand: 'npm start',
    internalPort: 3000,
    publicAccess: false,
  });

  const activeTech = TECHNOLOGIES.find(t => t.id === state.language);

  // Manejadores
  const handleTechSelect = (techId: string) => {
    const tech = TECHNOLOGIES.find(t => t.id === techId);
    if (tech) {
      setState({ ...state, language: tech.id, version: tech.versions[0], startCommand: tech.defaultCommand });
    }
  };

  const nextStep = () => setStep(Math.min(step + 1, 2));
  const prevStep = () => setStep(Math.max(step - 1, 1));

  return (
    <div className="min-h-screen bg-background text-foreground p-8 font-sans">
      
      {/* HEADER / PASOS */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-4 border-b border-border pb-6">
          <div className={cn("flex flex-col items-center gap-2", step === 1 ? "opacity-100" : "opacity-50")}>
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center border-2", step === 1 ? "border-primary text-primary" : "border-muted-foreground text-muted-foreground")}>
              1
            </div>
            <span className={cn("text-sm font-medium", step === 1 ? "text-primary" : "text-muted-foreground")}>Core</span>
          </div>
          <div className="w-16 h-[2px] bg-border mb-6"></div>
          <div className={cn("flex flex-col items-center gap-2", step === 2 ? "opacity-100" : "opacity-50")}>
            <div className={cn("w-12 h-12 rounded-full flex items-center justify-center border-2", step === 2 ? "border-primary text-primary" : "border-muted-foreground text-muted-foreground")}>
              2
            </div>
            <span className={cn("text-sm font-medium", step === 2 ? "text-primary" : "text-muted-foreground")}>Red</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-card border border-border rounded-xl p-8 shadow-lg">
        <p className="text-primary text-sm font-bold mb-2">PASO {step} DE 2</p>
        
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold mb-2">Core del Proyecto</h2>
            <p className="text-muted-foreground mb-6">Selecciona el lenguaje base y configura el comando de inicio.</p>

            <h3 className="font-semibold mb-4">Lenguaje de programación</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {TECHNOLOGIES.map((tech) => (
                <button
                  key={tech.id}
                  onClick={() => handleTechSelect(tech.id)}
                  className={cn(
                    "interactive-card flex flex-col items-center p-4 rounded-xl border bg-secondary/50 text-center transition-all",
                    state.language === tech.id ? `card-selected ${tech.borderClass}` : "border-border hover:border-muted-foreground"
                  )}
                >
                  <Box className={cn("w-8 h-8 mb-3", tech.colorClass)} />
                  <span className="font-bold text-sm mb-1">{tech.label}</span>
                  <span className="text-xs text-muted-foreground">{tech.description}</span>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-semibold text-sm">Versión de {activeTech?.label}</label>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">Offline fallback</span>
                </div>
                <select 
                  className="w-full buildy-input p-3 rounded-lg text-sm text-foreground bg-input"
                  value={state.version}
                  onChange={(e) => setState({ ...state, version: e.target.value })}
                >
                  {activeTech?.versions.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="font-semibold text-sm mb-2 block">Comando de inicio</label>
                <input 
                  type="text" 
                  className="w-full buildy-input p-3 rounded-lg text-sm text-foreground bg-input font-mono"
                  value={state.startCommand}
                  onChange={(e) => setState({ ...state, startCommand: e.target.value })}
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-slide-right">
            <h2 className="text-2xl font-bold mb-2">Configuración de Red</h2>
            <p className="text-muted-foreground mb-6">Define los puertos de comunicación de tu contenedor.</p>

            <div className="bg-secondary/30 p-6 rounded-xl border border-border mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Settings className="text-primary w-5 h-5" />
                <h3 className="font-semibold">Puerto Interno</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">El puerto en el que tu aplicación escucha dentro del contenedor.</p>
              <input 
                type="number" 
                className="w-full md:w-1/3 buildy-input p-3 rounded-lg text-sm text-foreground bg-input font-mono"
                value={state.internalPort}
                onChange={(e) => setState({ ...state, internalPort: Number(e.target.value) })}
              />
            </div>

            <div className="flex items-center gap-3 bg-secondary/30 p-6 rounded-xl border border-border">
              <input 
                type="checkbox" 
                id="publicAccess"
                className="w-5 h-5 accent-primary"
                checked={state.publicAccess}
                onChange={(e) => setState({ ...state, publicAccess: e.target.checked })}
              />
              <div>
                <label htmlFor="publicAccess" className="font-semibold cursor-pointer">Acceso Público</label>
                <p className="text-sm text-muted-foreground">Exponer este puerto a la máquina anfitriona (localhost).</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-10 pt-6 border-t border-border">
          {step > 1 ? (
            <button onClick={prevStep} className="flex items-center gap-2 px-6 py-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Anterior
            </button>
          ) : <div></div>}
          
          {step < 2 ? (
            <button onClick={nextStep} className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground font-bold hover:bg-primary-glow transition-colors">
              Siguiente <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button className="flex items-center gap-2 px-6 py-2 rounded-lg bg-primary text-primary-foreground font-bold hover:bg-primary-glow transition-colors">
              Siguiente
            </button>
          )}
        </div>

      </div>
    </div>
  );
}