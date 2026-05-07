import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut 
} from 'firebase/auth';
import { authInstance } from '../db/db.service';

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface IAuthService {
  login(email: string, password: string): Promise<User>;
  register(email: string, password: string, name: string): Promise<User>;
  logout(): Promise<void>;
}

class FirebaseAuthService implements IAuthService {
  
  async login(email: string, password: string): Promise<User> {
    try {
      // Magia de Firebase: Iniciar sesión
      const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
      
      return { 
        id: userCredential.user.uid, 
        email: userCredential.user.email!, 
        name: userCredential.user.email!.split('@')[0] // Usamos la primera parte del correo como nombre temporal
      };
    } catch (error: any) {
      throw new Error('Credenciales inválidas o el usuario no existe.');
    }
  }

  async register(email: string, password: string, name: string): Promise<User> {
    try {
      // Magia de Firebase: Crear usuario
      const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
      
      return { 
        id: userCredential.user.uid, 
        email: userCredential.user.email!, 
        name: name 
      };
    } catch (error: any) {
      // Manejo de errores específicos de Firebase para darle buen feedback al usuario
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Este correo ya está registrado.');
      }
      if (error.code === 'auth/weak-password') {
        throw new Error('La contraseña debe tener al menos 6 caracteres.');
      }
      throw new Error('Error al registrar el usuario.');
    }
  }

  async logout(): Promise<void> {
    // Magia de Firebase: Cerrar sesión
    await signOut(authInstance);
  }
}

// Exportamos la instancia real de Firebase en lugar del Mock
export const authService: IAuthService = new FirebaseAuthService();