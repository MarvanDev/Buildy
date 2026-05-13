import { create } from 'zustand';
import { authService, User } from './auth.service';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isCheckingAuth: boolean; // NUEVO: Para saber si está cargando por primera vez
  error: string | null;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  initAuth: () => void; // NUEVO
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isCheckingAuth: true, // NUEVO: Inicia en true hasta que Firebase nos responda
  error: null,

  // ... (Tus funciones login, register y logout quedan EXACTAMENTE IGUAL)
  login: async (email, pass) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.login(email, pass);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  register: async (email, pass, name) => {
    set({ isLoading: true, error: null });
    try {
      const user = await authService.register(email, pass, name);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    await authService.logout();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  // NUEVO: Conectamos la vigilancia de Firebase con nuestro estado
  initAuth: () => {
    authService.onAuthStateChange((user) => {
      if (user) {
        set({ user, isAuthenticated: true, isCheckingAuth: false });
      } else {
        set({ user: null, isAuthenticated: false, isCheckingAuth: false });
      }
    });
  }
}));