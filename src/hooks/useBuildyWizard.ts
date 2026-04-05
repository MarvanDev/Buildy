import { create } from 'zustand'
import { useMemo, useEffect } from 'react'
import type { 
  WizardState, DatabaseConfig, PersistenceConfig, 
  UseBuildyWizardReturn, Technology, VersionLoadState 
} from '../types/wizard.types'
import { TECHNOLOGIES } from '../constants/technologies'
import { getAllLatestVersions } from '../services/api.service'
import { generateDockerCompose } from '../services/docker/docker.generator'
import { generateReadme } from '../services/readme.generator'

const TOTAL_STEPS = 5

const INITIAL_STATE: WizardState = {
  language: null, version: '', startCommand: '',
  internalPort: 3000, publicAccess: false,
  database: { choice: 'none', name: 'myapp_db', user: 'admin', password: '' },
  persistence: { enabled: false, localPath: '/app/uploads' },
  subjectPreset: 'none',
}

// ── HU-03: Generador de credenciales seguras ──
export function generateSecureCredentials() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$'
  const password = Array.from({ length: 18 }, () =>
    chars[Math.floor(Math.random() * chars.length)],
  ).join('')
  const adjs = ['secure', 'bright', 'swift', 'clean', 'bold']
  const nouns = ['app', 'service', 'project', 'system', 'api']
  const adj = adjs[Math.floor(Math.random() * adjs.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  return { user: `${adj}_${noun}_user`, password, dbName: `${adj}_${noun}_db` }
}

interface WizardStore extends WizardState {
  currentStep: number;
  technologies: Technology[];
  versionLoad: VersionLoadState;
  setTechnologies: (techs: Technology[]) => void;
  setVersionLoad: (load: VersionLoadState) => void;
  updateState: (updates: Partial<WizardState>) => void;
  updateDatabase: (updates: Partial<DatabaseConfig>) => void;
  updatePersistence: (updates: Partial<PersistenceConfig>) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
  resetWizard: () => void;
}

// ── Store Global con Zustand ──
const useWizardStore = create<WizardStore>((set) => ({
  ...INITIAL_STATE,
  currentStep: 1,
  technologies: TECHNOLOGIES,
  versionLoad: { isLoadingVersions: true, liveVersionSources: {} },
  
  setTechnologies: (technologies) => set({ technologies }),
  setVersionLoad: (versionLoad) => set({ versionLoad }),
  updateState: (updates) => set((state) => ({ ...state, ...updates })),
  updateDatabase: (updates) => set((state) => ({ database: { ...state.database, ...updates } })),
  updatePersistence: (updates) => set((state) => ({ persistence: { ...state.persistence, ...updates } })),
  nextStep: () => set((state) => ({ currentStep: Math.min(state.currentStep + 1, TOTAL_STEPS) })),
  prevStep: () => set((state) => ({ currentStep: Math.max(state.currentStep - 1, 1) })),
  goToStep: (step) => set({ currentStep: step }),
  resetWizard: () => set({ ...INITIAL_STATE, currentStep: 1 }),
}))

// ── Hook optimizado (Soporta componentes viejos y nuevos sin dar error) ──
export type LegacyWizardReturn = WizardStore & { state: WizardStore };

export function useBuildyWizard(): LegacyWizardReturn;
export function useBuildyWizard<T>(selector: (state: WizardStore) => T): T;
export function useBuildyWizard<T>(selector?: (state: WizardStore) => T): T | LegacyWizardReturn {
  const setTechs = useWizardStore(s => s.setTechnologies);
  const setLoad = useWizardStore(s => s.setVersionLoad);
  const techSource = useWizardStore(s => s.versionLoad.isLoadingVersions);

  useEffect(() => {
    if (!techSource) return;
    let isMounted = true;
    async function initApi() {
      try {
        const results = await getAllLatestVersions();
        if (!isMounted) return;
        const enrichedTechs = TECHNOLOGIES.map((tech) => {
          const result = results.find((r) => r.techId === tech.id);
          return (result && result.source === 'api') ? { ...tech, versions: result.versions } : tech;
        });
        const sources = Object.fromEntries(results.map((r) => [r.techId, r.source === 'api']));
        setTechs(enrichedTechs);
        setLoad({ isLoadingVersions: false, liveVersionSources: sources });
      } catch (e) {
        setLoad({ isLoadingVersions: false, liveVersionSources: {} });
      }
    }
    initApi();
    return () => { isMounted = false };
  }, [setTechs, setLoad, techSource]);

  // AQUÍ ESTÁ LA MAGIA: 
  // Obtenemos el store completo. Si hay selector, devolvemos solo ese pedacito.
  // Si no hay selector (como en tus Steps), devolvemos el store + el objeto 'state' anidado.
  const store = useWizardStore();
  if (selector) return selector(store);
  return { ...store, state: store };
}

// ── Utilidades separadas para no dar lag a la UI ──
export function useBuildyWizardUtils() {
  const store = useWizardStore();

  const generatedYaml = useMemo(() => {
    if (!store.language || !store.version) return ''
    try { return generateDockerCompose(store) } catch { return '' }
  }, [store.language, store.version, store.database, store.internalPort, store.persistence, store.publicAccess, store.subjectPreset]);

  const generatedReadme = useMemo(() => {
    if (!store.language) return ''
    return generateReadme(store)
  }, [store.language, store.version, store.database, store.internalPort]);

  const canAdvance = useMemo(() => {
    switch (store.currentStep) {
      case 1: 
        return store.language !== null && store.version.trim() !== '' && store.startCommand.trim() !== '';
      case 2: 
        return store.internalPort > 0 && store.internalPort <= 65535;
      case 3: 
        if (store.database.choice === 'none') return true;
        return store.database.name.trim() !== '' && store.database.user.trim() !== '' && store.database.password.trim() !== '';
      case 4: 
        if (!store.persistence.enabled) return true;
        return store.persistence.localPath.trim() !== '';
      case 5: 
        return true;
      default: 
        return false;
    }
  }, [
    store.currentStep, store.language, store.version, store.startCommand, 
    store.internalPort, store.database, store.persistence
  ]);

  return { 
    generatedYaml, 
    generatedReadme, 
    canAdvance,
    state: store 
  };
}