/**
 * Lista de puertos reservados o conflictivos que podrían chocar
 * con servicios comunes en la máquina del usuario o del sistema.
 */
export const RESERVED_PORTS = [
  80,    
  443,   
  3306,  
  5432,  
  27017, 
  9090,  
  5050   
];

export function isPortReserved(port: number): boolean {
  return RESERVED_PORTS.includes(port);
}