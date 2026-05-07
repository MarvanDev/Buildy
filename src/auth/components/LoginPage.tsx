import React, { useState } from 'react';
import { useAuthStore } from '../useAuthStore';
import { Terminal, Lock, Mail, User as UserIcon, Loader2, Box, Database, Network } from 'lucide-react';
import { useIsMobile } from '../../hooks/use-mobile';

// === COMPONENTE DE ANIMACIÓN LIGERA (Cero impacto en rendimiento) ===
const DockerBackground = () => {
  const isMobile = useIsMobile();

  return (
    // CAMBIO 1: Subimos la opacidad a 20% (opacity-20) para que se noten elegante
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 opacity-20">
      {isMobile ? (
        /* VERSIÓN MOBILE: Modo ahorro de batería y espacio (Solo esquinas) */
        <>
          <Terminal className="absolute top-[2%] left-[5%] w-16 h-16 text-primary animate-spin" style={{ animationDuration: '40s' }} />
          <Box className="absolute top-[5%] right-[5%] w-12 h-12 text-primary animate-spin" style={{ animationDuration: '35s', animationDirection: 'reverse' }} />
          
          <Database className="absolute bottom-[2%] right-[10%] w-20 h-20 text-primary animate-spin" style={{ animationDuration: '45s' }}/>
          <Network className="absolute bottom-[5%] left-[5%] w-14 h-14 text-primary animate-spin" style={{ animationDuration: '38s', animationDirection: 'reverse' }} />
        </>
      ) : (
        /* VERSIÓN DESKTOP: La galaxia completa */
        <>
          {/* Sector Superior Izquierdo */}
          <Terminal className="absolute top-[5%] left-[10%] w-32 h-32 text-primary animate-spin" style={{ animationDuration: '45s' }} />
          <Box className="absolute top-[20%] left-[25%] w-16 h-16 text-primary animate-spin" style={{ animationDuration: '35s', animationDirection: 'reverse' }} />

          {/* Sector Centro Izquierdo */}
          <Database className="absolute top-[50%] left-[5%] w-24 h-24 text-primary animate-spin" style={{ animationDuration: '50s' }} />
          
          {/* Sector Inferior Izquierdo */}
          <Terminal className="absolute bottom-[10%] left-[15%] w-40 h-40 text-primary animate-spin" style={{ animationDuration: '40s', animationDirection: 'reverse' }} />
          <Network className="absolute bottom-[25%] left-[35%] w-20 h-20 text-primary animate-spin" style={{ animationDuration: '38s' }} />

          {/* Sector Superior Derecho */}
          <Box className="absolute top-[10%] right-[15%] w-36 h-36 text-primary animate-spin" style={{ animationDuration: '48s', animationDirection: 'reverse' }} />
          <Terminal className="absolute top-[25%] right-[35%] w-12 h-12 text-primary animate-spin" style={{ animationDuration: '32s' }} />

          {/* Sector Centro Derecho */}
          <Network className="absolute top-[45%] right-[8%] w-28 h-28 text-primary animate-spin" style={{ animationDuration: '42s', animationDirection: 'reverse' }} />

          {/* Sector Inferior Derecho */}
          <Database className="absolute bottom-[15%] right-[20%] w-32 h-32 text-primary animate-spin" style={{ animationDuration: '46s' }} />
          <Box className="absolute bottom-[5%] right-[40%] w-16 h-16 text-primary animate-spin" style={{ animationDuration: '36s', animationDirection: 'reverse' }} />
          
          {/* Flotantes sutiles cerca del centro */}
          <Terminal className="absolute top-[15%] left-[45%] w-10 h-10 text-primary animate-spin" style={{ animationDuration: '30s' }} />
          <Database className="absolute bottom-[20%] right-[45%] w-14 h-14 text-primary animate-spin" style={{ animationDuration: '34s', animationDirection: 'reverse' }} />
        </>
      )}
    </div>
  );
};

export function LoginPage() {
  const { login, register, isLoading, error } = useAuthStore();
  
  // Estados del formulario
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering) {
      await register(email, password, name);
    } else {
      await login(email, password);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    // Limpiamos errores y contraseñas al cambiar de modo
    setPassword(''); 
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <DockerBackground />

      {/* Contenedor principal (z-10 para estar por encima del fondo) */}
      <div className="w-full max-w-md bg-[#0a0a0a] border border-border/50 rounded-2xl p-8 shadow-2xl z-10 animate-scale-in">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#0f172a] border border-[#1e293b] rounded-xl flex items-center justify-center mb-4">
            <span className="text-primary font-mono text-xl font-bold">{`>_`}</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Buildy Access</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isRegistering ? 'Crea una cuenta nueva' : 'Inicia sesión para crear entornos'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-destructive-foreground bg-destructive/20 border border-destructive/50 rounded-lg text-center animate-fade-in">
              {error}
            </div>
          )}

          {/* Campo extra: Solo se muestra si está registrando */}
          {isRegistering && (
            <div className="space-y-1.5 animate-slide-right">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Nombre</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#171717] border border-[#262626] pl-10 pr-4 py-2.5 rounded-lg text-sm text-foreground outline-none focus:border-primary/50 transition-colors"
                  placeholder="Tu nombre"
                  required={isRegistering} 
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#171717] border border-[#262626] pl-10 pr-4 py-2.5 rounded-lg text-sm text-foreground outline-none focus:border-primary/50 transition-colors"
                placeholder="admin@buildy.com"
                required 
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#171717] border border-[#262626] pl-10 pr-4 py-2.5 rounded-lg text-sm text-foreground outline-none focus:border-primary/50 transition-colors"
                placeholder="••••••••"
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-glow text-[#000000] font-bold py-2.5 rounded-lg transition-colors flex justify-center items-center gap-2 mt-6 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isRegistering ? 'Crear cuenta' : 'Ingresar al sistema')}
          </button>
        </form>

        {/* TOGGLE ENTRE LOGIN Y REGISTRO */}
        <div className="mt-6 text-center">
          <button 
            type="button" 
            onClick={toggleMode}
            className="text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            {isRegistering 
              ? '¿Ya tienes una cuenta? Inicia sesión aquí' 
              : '¿No tienes cuenta? Regístrate aquí'}
          </button>
        </div>
      </div>
    </main>
  );
}