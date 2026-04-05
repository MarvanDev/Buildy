// ============================================================
//  Buildy — Definiciones Centrales de Tipos
// ============================================================

// ── Tipos principales del dominio ───────────────────────────
export type LanguageId = 'nodejs' | 'python' | 'php' | 'java' | 'go'
export type DatabaseChoice = 'postgresql' | 'mysql' | 'mongodb' | 'none'
export type SubjectPresetId = 'none' | 'databases' | 'networks'

export interface TechVersion {
  label: string
  value: string
  recommended?: boolean
  /** true cuando se obtienen en vivo de Docker Hub, false = respaldo local */
  live?: boolean
}

export interface Technology {
  id: LanguageId
  label: string
  icon: string
  color: string
  colorClass: string
  bgClass: string
  borderClass: string
  description: string
  versions: TechVersion[]
  defaultCommand: string
  defaultPort: number
}

export interface SubjectPreset {
  id: SubjectPresetId
  label: string
  description: string
  icon: string
  extras: string[]
}

// ── Estado del Asistente (Wizard) ───────────────────────────
export interface DatabaseConfig {
  choice: DatabaseChoice
  name: string
  user: string
  password: string
}

export interface PersistenceConfig {
  enabled: boolean
  localPath: string
}

export interface WizardState {
  language: LanguageId | null
  version: string
  startCommand: string
  internalPort: number
  publicAccess: boolean
  database: DatabaseConfig
  persistence: PersistenceConfig
  subjectPreset: SubjectPresetId
}

// ── Salida de Docker Compose ───────────────────────────────
export interface DockerService {
  image?: string
  build?: { context: string; dockerfile?: string }
  container_name?: string
  working_dir?: string
  restart?: string
  ports?: string[]
  environment?: Record<string, string> | string[]
  volumes?: string[]
  depends_on?: string[]
  networks?: string[]
  command?: string
  privileged?: boolean
}

export interface DockerNetwork { driver: string; external?: boolean }
export interface DockerVolume { driver?: string }

export interface DockerComposeConfig {
  version: string
  services: Record<string, DockerService>
  networks?: Record<string, DockerNetwork>
  volumes?: Record<string, DockerVolume>
}

// ── Tipos del Servicio API ─────────────────────────────────
/** Resultado devuelto por el servicio API para una sola tecnología */
export interface ApiVersionResult {
  techId: LanguageId
  versions: TechVersion[]
  /** Indica si los datos vinieron de la API en vivo o del respaldo local */
  source: 'api' | 'fallback'
}

/** Estado expuesto por useBuildyWizard para la carga de versiones */
export interface VersionLoadState {
  /** ¿Está la carga de la API actualmente en progreso? */
  isLoadingVersions: boolean
  /** Mapa de techId → indica si sus versiones vinieron de la API en vivo */
  liveVersionSources: Partial<Record<LanguageId, boolean>>
}

// ── Tipos de nodos del Diagrama de Arquitectura ─────────────
export type DiagramNodeKind =
  | 'app'
  | 'database'
  | 'pgadmin'
  | 'adminer'
  | 'cadvisor'
  | 'internet'

export interface DiagramNodeData {
  kind: DiagramNodeKind
  label: string
  /** Clase de color de Tailwind para el acento del nodo (coincide con la paleta de la tecnología) */
  colorClass: string
  /** Emoji o identificador de icono */
  icon: string
  /** Sub-etiqueta mostrada debajo de la etiqueta principal */
  sublabel?: string
}

// ── Tipo de retorno del Hook ───────────────────────────────
export interface UseBuildyWizardReturn {
  /** @internal Usado por Step1Core para establecer la versión desde datos en vivo cuando el lenguaje cambia */
  _selectLanguageVersion?: (langId: string) => void
  state: WizardState
  currentStep: number
  totalSteps: number
  /** Arreglo de tecnologías, enriquecido con versiones en vivo cuando están disponibles */
  technologies: Technology[]
  versionLoad: VersionLoadState
  updateState: (updates: Partial<WizardState>) => void
  updateDatabase: (updates: Partial<DatabaseConfig>) => void
  updatePersistence: (updates: Partial<PersistenceConfig>) => void
  nextStep: () => void
  prevStep: () => void
  goToStep: (step: number) => void
  isFirstStep: boolean
  isLastStep: boolean
  canAdvance: boolean
  resetWizard: () => void
  generatedYaml: string
  generatedReadme: string
}