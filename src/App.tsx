// src/App.tsx
import { useEffect } from 'react'
import { WizardLayout } from './components/wizard/WizardLayout'
import { ProtectedRoute } from './auth/components/ProtectedRoute'
import { useAuthStore } from './auth/useAuthStore' // Verifica que esta ruta sea correcta

function App() {
  const initAuth = useAuthStore((state) => state.initAuth);
  const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);

  // Le decimos a Firebase que revise si hay un usuario al abrir la app
  useEffect(() => {
    initAuth();
  }, [initAuth]);

  // Si está revisando, mostramos una pantalla de carga para que no "parpadee" el login
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-[#0f172a] border border-[#1e293b] rounded-xl flex items-center justify-center animate-pulse">
            <span className="text-primary font-mono text-xl font-bold">{`>_`}</span>
          </div>
          <span className="text-muted-foreground font-mono text-sm animate-pulse">Iniciando sistema...</span>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <WizardLayout />
    </ProtectedRoute>
  )
}

export default App