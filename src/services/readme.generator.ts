/**
 * Servicio de generación del README.md.
 * Responsabilidad única: producir instrucciones de uso claras y adaptadas al config.
 */
import type { WizardState } from '../types/wizard.types'
import { TECHNOLOGIES } from '../constants/technologies'
import { SUBJECT_PRESETS } from '../constants/subjects'

export function generateReadme(state: WizardState): string {
  const tech = TECHNOLOGIES.find((t) => t.id === state.language)
  const subject = SUBJECT_PRESETS.find((s) => s.id === state.subjectPreset)
  const techLabel = tech?.label ?? state.language ?? 'App'
  const subjectLabel = subject?.label ?? ''

  const accessMode = state.publicAccess
    ? `http://localhost:${state.internalPort} (acceso desde red local)`
    : `http://localhost:${state.internalPort} (solo acceso local)`

  let dbSection = ''
  if (state.database.choice !== 'none') {
    const dbLabels: Record<string, string> = {
      postgresql: 'PostgreSQL',
      mysql: 'MySQL',
      mongodb: 'MongoDB',
    }
    dbSection = `
## 🗄️ Base de Datos

| Parámetro  |             Valor              | 
|------------|--------------------------------|
| Motor      | ${dbLabels[state.database.choice] ?? state.database.choice} |
| Nombre DB  | \`${state.database.name}\`     |
| Usuario    | \`${state.database.user}\`     |
| Contraseña | \`${state.database.password}\` |

> ⚠️ **Importante:** Cambia la contraseña antes de usar en producción.
`
  }

  let extrasSection = ''
  if (state.subjectPreset === 'databases' && state.database.choice !== 'none') {
    if (state.database.choice === 'postgresql') {
      extrasSection = `
## 🔎 pgAdmin (Gestión Visual PostgreSQL)

- **URL:** http://localhost:5050
- **Email:** admin@buildy.local
- **Contraseña:** buildy_admin_2024
`
    } else {
      extrasSection = `
## 🔎 Adminer (Gestión Visual de Base de Datos)

- **URL:** http://localhost:8080
- **Sistema:** Selecciona ${state.database.choice === 'mysql' ? 'MySQL' : 'MongoDB'}
- **Servidor:** \`${state.database.choice === 'mysql' ? 'mysql_db' : 'mongodb_db'}\`
- **Usuario:** \`${state.database.user}\`
- **Contraseña:** \`${state.database.password}\`
`
    }
  }

  if (state.subjectPreset === 'networks') {
    extrasSection = `
## 📡 cAdvisor (Monitoreo de Contenedores)

- **URL:** http://localhost:8090
- Muestra métricas en tiempo real de CPU, memoria y red por contenedor.
`
  }

  let persistenceSection = ''
  if (state.persistence.enabled) {
    persistenceSection = `
## 📁 Persistencia de Archivos

Los archivos subidos por tu aplicación se guardan en la carpeta \`./uploads\` local,
mapeada al directorio \`${state.persistence.localPath}\` dentro del contenedor.
`
  }

  const stopCommand =
    state.database.choice !== 'none'
      ? 'docker-compose down -v   # También elimina los volúmenes de datos'
      : 'docker-compose down'

  const dockerHubSlug =
    tech?.id === 'nodejs' ? 'node' :
    tech?.id === 'java' ? 'openjdk' :
    tech?.id ?? ''

  return `# 🐳 ${techLabel} — Proyecto Docker

> Generado con **Buildy** (Proyecto de Arquitectura/DevOps) · Materia: **${subjectLabel}**
## 🚀 Inicio Rápido

### Requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) (incluido en Docker Desktop)

### Levantar el proyecto

\`\`\`bash
# 1. Clonar / copiar tu código en esta carpeta
# 2. Desde la carpeta donde está el docker-compose.yml, ejecutar:

docker-compose up -d
\`\`\`

El flag \`-d\` corre los contenedores en **background** (modo detached).

### Ver logs en tiempo real

\`\`\`bash
docker-compose logs -f
\`\`\`

### Tu aplicación estará disponible en:

> **${accessMode}**
${dbSection}${extrasSection}${persistenceSection}
## 🛑 Detener el proyecto

\`\`\`bash
${stopCommand}
\`\`\`

## 🔧 Comandos útiles
 ________________________________________________________________________________
|                Comando           |                Descripción                  |
|----------------------------------|---------------------------------------------|
| \`docker-compose up -d\`           | Inicia todos los servicios en background    |
| \`docker-compose down\`            | Detiene y elimina los contenedores          |
| \`docker-compose logs -f\`         | Muestra logs en tiempo real                 |
| \`docker-compose ps\`              | Lista el estado de los contenedores         |
| \`docker-compose exec app bash\`   | Abre una terminal dentro del contenedor app |
| \`docker-compose restart\`         | Reinicia todos los servicios                |
---------------------------------------------------------------------------------
## 📚 Recursos

- [Documentación de Docker](https://docs.docker.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/reference/)
- [Docker Hub — ${techLabel}](https://hub.docker.com/_/${dockerHubSlug})

---

*Generado automáticamente por **Buildy** — Tu asistente de Docker para la universidad* 🎓
`
}
