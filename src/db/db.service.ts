import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCDPrCCEDJjfALfDMBawBW8LBkks_X6xdE",
  authDomain: "buildy-96e0e.firebaseapp.com",
  projectId: "buildy-96e0e",
  storageBucket: "buildy-96e0e.firebasestorage.app",
  messagingSenderId: "101289311017",
  appId: "1:101289311017:web:21334d2a3de829a26d5538"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar el servicio de autenticación para usarlo en el auth.service.ts
export const authInstance = getAuth(app);

export const dbConnection = {
  isConnected: true,
  log: () => console.log('🔥 Conectado a Firebase'),
};