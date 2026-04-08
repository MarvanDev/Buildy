 import type { DatabaseChoice } from '../types/wizard.types'
 export const DB_OPTIONS: { id: DatabaseChoice; label: string; description: string; icon: string; activeClass: string }[] = [
   { id: 'postgresql', label: 'PostgreSQL', description: 'Relacional · ACID', icon: '🐘', activeClass: 'bg-blue-500/10 border-blue-500/50 shadow-sm shadow-blue-500/5' },
   { id: 'mysql', label: 'MySQL', description: 'Relacional · Popular', icon: '🐬', activeClass: 'bg-amber-500/10 border-amber-500/50 shadow-sm shadow-amber-500/5' },
   { id: 'mongodb', label: 'MongoDB', description: 'NoSQL · Documentos', icon: '🍃', activeClass: 'bg-emerald-500/10 border-emerald-500/50 shadow-sm shadow-emerald-500/5' },
   { id: 'none', label: 'Ninguna', description: 'Sin base de datos', icon: '∅', activeClass: 'bg-slate-500/10 border-slate-500/50 shadow-sm shadow-slate-500/5' },
 ]

 export const DB_PORTS = {
   postgresql: 5432,
   mysql: 3306,
   mongodb: 27017,
 } as const;