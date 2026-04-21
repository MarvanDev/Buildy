export interface User {
    id: string;
    email: string;
    name: string;
  }
  
  export interface IAuthService {
    login(email: string, password: string): Promise<User>;
    register(email: string, password: string, name: string): Promise<User>; // NUEVO
    logout(): Promise<void>;
  }
  
  class MockAuthService implements IAuthService {
    async login(email: string, password: string): Promise<User> {
      await new Promise((resolve) => setTimeout(resolve, 800));
      // Simulamos que cualquier correo con formato válido pasa
      if (email && password.length >= 6) {
        return { id: 'usr_' + Date.now(), email, name: email.split('@')[0] };
      }
      throw new Error('Credenciales inválidas.');
    }
  
    // NUEVO METODO DE REGISTRO
    async register(email: string, password: string, name: string): Promise<User> {
      await new Promise((resolve) => setTimeout(resolve, 800));
      if (password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres.');
      }
      console.log('Usuario registrado en DB Simulada:', { email, name });
      return { id: 'usr_' + Date.now(), email, name };
    }
  
    async logout(): Promise<void> {
      await new Promise((resolve) => setTimeout(resolve, 400));
    }
  }
  
  export const authService: IAuthService = new MockAuthService();