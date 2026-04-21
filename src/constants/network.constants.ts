/**
 * Lista de puertos reservados o conflictivos que podrían chocar
 * con servicios comunes en la máquina del usuario o del sistema.
 */
export const RESERVED_PORTS = [
  80,    // HTTP
  443,   // HTTPS
  3306,  // MySQL local
  5432,  // PostgreSQL local
  27017, // MongoDB local
  9090,  // cAdvisor / Prometheus
  5050   // pgAdmin
];

export function isPortReserved(port: number): boolean {
  return RESERVED_PORTS.includes(port);
}