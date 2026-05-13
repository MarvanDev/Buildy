import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged, // NUEVO
  User as FirebaseUser // NUEVO: Le cambiamos el nombre aquí para que no choque con tu interfaz User
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
  onAuthStateChange(callback: (user: User | null) => void): void; // NUEVO
}

class FirebaseAuthService implements IAuthService {
  
  // ... (Tus funciones login, register y logout quedan EXACTAMENTE IGUAL)
  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(authInstance, email, password);
      return { 
        id: userCredential.user.uid, 
        email: userCredential.user.email!, 
        name: userCredential.user.email!.split('@')[0] 
      };
    } catch (error: any) {
      throw new Error('Credenciales inválidas o el usuario no existe.');
    }
  }

  async register(email: string, password: string, name: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(authInstance, email, password);
      return { id: userCredential.user.uid, email: userCredential.user.email!, name: name };
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') throw new Error('Este correo ya está registrado.');
      if (error.code === 'auth/weak-password') throw new Error('La contraseña debe tener al menos 6 caracteres.');
      throw new Error('Error al registrar el usuario.');
    }
  }

  async logout(): Promise<void> {
    await signOut(authInstance);
  }

  // NUEVO: La función que vigila si hay alguien logueado al recargar la página
  onAuthStateChange(callback: (user: User | null) => void): void {
    onAuthStateChanged(authInstance, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        callback({
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          name: firebaseUser.displayName || firebaseUser.email!.split('@')[0]
        });
      } else {
        callback(null);
      }
    });
  }
}

export const authService: IAuthService = new FirebaseAuthService();