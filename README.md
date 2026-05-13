# 🏗️ Buildy - Docker Wizard

Buildy es un generador visual de infraestructura diseñado para estudiantes universitarios. Permite generar archivos `docker-compose.yml` listos para usar mediante un asistente (Wizard) paso a paso, seleccionando tecnologías, bases de datos y puertos de manera intuitiva.

## 🚀 Tecnologías Principales

* **Core:** Vite + React + TypeScript
* **Gestor de Paquetes:** pnpm (Reemplazo de npm por seguridad y velocidad)
* **Estilos y UI:** Tailwind CSS + shadcn/ui
* **Gestión de Estado:** Zustand
* **Base de Datos & Auth:** Firebase
* **Despliegue:** Azure Static Web Apps (CI/CD)

## ⚙️ Instalación y Uso Local

⚠️ **IMPORTANTE:** Este proyecto usa `pnpm` para la gestión de dependencias. **NO uses `npm install`**.

1. **Instalar pnpm a nivel global (Si no lo tienes):**
   ```bash
   npm install -g pnpm
Clonar el repositorio y entrar a la carpeta:

Bash
git clone https://TitanOps@dev.azure.com/TitanOps/Buildy/_git/Buildy
cd Buildy

Instalar las dependencias:

Bash
pnpm install
Levantar el servidor local:

Bash
pnpm run dev
El proyecto estará disponible en http://localhost:3000 o en el puerto que asigne Vite.

🛠️ Scripts Disponibles
pnpm run dev: Inicia el servidor de desarrollo con Hot-Reload.

pnpm run build: Compila la aplicación para producción.

pnpm run lint: Ejecuta ESLint y TypeScript para verificar errores en el código antes de subir cambios.

👥 Flujo de Trabajo (Equipo)
Este proyecto se gestiona a través de Azure Boards. Por favor, asegúrate de crear una rama nueva para cada Feature o Historia de Usuario antes de modificar el código base.


### El Paso Final para Azure

Como Azure tiene que compilar tu aplicación usando el nuevo comando `pnpm run build`, necesitamos darle una pequeña indicación en tu archivo del pipeline.

1. **Ve a DevOps > Pipelines > Edita tu pipeline (el archivo YAML)** o edítalo desde VS Code si lo tienes localmente (`azure-pipelines.yml`).
2. Tienes que agregar un pequeñísimo paso antes del `AzureStaticWebApp` para que el servidor de Microsoft sepa que debe usar `pnpm`.

El pipeline debería quedar algo así (solo es agregar la tarea de `npm install -g pnpm`):

```yaml
trigger:
  - main

pool:
  vmImage: 'ubuntu-latest'

steps:
  - checkout: self
    submodules: true

  # AÑADIR ESTE PASO NUEVO:
  - script: |
      npm install -g pnpm
    displayName: 'Instalar pnpm globalmente'

  - task: AzureStaticWebApp@0
    inputs:
      app_location: '/' 
      api_location: '' 
      output_location: 'dist' 
      azure_static_web_apps_api_token: $(deployment_token)