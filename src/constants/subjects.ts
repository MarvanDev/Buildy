import type { SubjectPreset } from '../types/wizard.types'
export const SUBJECT_PRESETS: SubjectPreset[] = [
  { id: 'none', label: 'Programación Web', description: 'Configuración estándar sin herramientas adicionales', icon: 'Code2', extras: [] },
  { id: 'databases', label: 'Bases de Datos II', description: 'Agrega Adminer o pgAdmin para gestión visual de la DB', icon: 'Database', extras: ['adminer_or_pgadmin'] },
  { id: 'networks', label: 'Redes de Computadores', description: 'Agrega Google cAdvisor para monitoreo de contenedores', icon: 'Network', extras: ['cadvisor'] },
]
export const ADMINER_SERVICE = { image: 'adminer:latest', ports: ['8080:8080'], restart: 'unless-stopped', networks: ['app-network'] }
export const PGADMIN_SERVICE = { image: 'dpage/pgadmin4:latest', environment: { PGADMIN_DEFAULT_EMAIL: 'admin@buildy.local', PGADMIN_DEFAULT_PASSWORD: 'buildy_admin_2024' }, ports: ['5050:80'], restart: 'unless-stopped', networks: ['app-network'] }
export const CADVISOR_SERVICE = { image: 'gcr.io/cadvisor/cadvisor:latest', ports: ['8090:8080'], volumes: ['/:/rootfs:ro', '/var/run:/var/run:rw', '/sys:/sys:ro', '/var/lib/docker/:/var/lib/docker:ro'], restart: 'unless-stopped', networks: ['app-network'], privileged: true }
