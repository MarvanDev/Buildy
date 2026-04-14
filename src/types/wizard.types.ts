// ============================================================
//  Buildy — Central Type Definitions
// ============================================================

// ── Core domain types ─────────────────────────────────────
export type LanguageId = 'nodejs' | 'python' | 'php' | 'java' | 'go'
export type DatabaseChoice = 'postgresql' | 'mysql' | 'mongodb' | 'none'
export type SubjectPresetId = 'none' | 'databases' | 'networks'

export interface TechVersion {
  label: string
  value: string
  recommended?: boolean
  /** true when fetched live from Docker Hub, false = local fallback */
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

// ── Wizard state ───────────────────────────────────────────
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

// ── Docker Compose output ─────────────────────────────────
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

// ── API Service types ─────────────────────────────────────
/** Result returned by the API service for a single technology */
export interface ApiVersionResult {
  techId: LanguageId
  versions: TechVersion[]
  /** Whether the data came from the live API or the local fallback */
  source: 'api' | 'fallback'
}

/** State exposed by useBuildyWizard for version loading */
export interface VersionLoadState {
  /** Is the API fetch currently in progress? */
  isLoadingVersions: boolean
  /** Map of techId → whether its versions came from live API */
  liveVersionSources: Partial<Record<LanguageId, boolean>>
}

// ── Architecture Diagram node types ───────────────────────
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
  /** Tailwind color class for the node accent (matches technology palette) */
  colorClass: string
  /** Emoji or icon identifier */
  icon: string
  /** Sub-label shown below main label */
  sublabel?: string
}

// ── Hook return type ─────────────────────────────────────
export interface UseBuildyWizardReturn {
  /** @internal Used by Step1Core to set version from live data when language changes */
  _selectLanguageVersion?: (langId: string) => void
  state: WizardState
  currentStep: number
  totalSteps: number
  /** Technologies array, enriched with live versions when available */
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
