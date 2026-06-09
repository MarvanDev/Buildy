🏗️ Buildy - Docker Wizard
Asistente web educativo que automatiza la creación de entornos Docker (docker-compose.yml) estandarizados por materia, listos para ejecutarse con un solo comando y sin fricción técnica.

🚀 Tecnologías Principales
Core: Vite + React + TypeScript

Gestor de Paquetes: pnpm (Reemplazo de npm por seguridad y velocidad)

Estilos y UI: Tailwind CSS + shadcn/ui

Gestión de Estado: Zustand

Base de Datos & Auth: Firebase

Infraestructura y Nube (DevOps): Docker + Azure Container Registry (ACR) + Azure App Service (Linux) + Azure Pipelines (CI/CD)

⚙️ Instalación y Uso Local
⚠️ IMPORTANTE: Este proyecto usa pnpm para la gestión de dependencias. NO uses npm install.

1. Clonar el repositorio y entrar a la carpeta:
git clone https://github.com/MarvanDev/Buildy.git
cd Buildy

2. Configurar Entorno Seguro:
Este proyecto protege sus credenciales. Duplica el archivo .env.example, renómbralo a .env.local y reemplaza los valores de prueba con las llaves de tu propio proyecto de Firebase.

3. Instalar pnpm a nivel global (Si no lo tienes) y dependencias:
npm install -g pnpm
pnpm install

4. Levantar el servidor local:
pnpm run dev
El proyecto estará disponible en http://localhost:5173 (o en el puerto que asigne Vite).

🛠️ Scripts Disponibles
pnpm run dev: Inicia el servidor de desarrollo con Hot-Reload.

pnpm run build: Compila la aplicación para producción.

pnpm run lint: Ejecuta ESLint y TypeScript para verificar errores en el código antes de subir cambios.

👥 Flujo de Trabajo (Equipo)
Este proyecto se gestiona a través de Azure Boards. Por favor, asegúrate de crear una rama nueva para cada Feature o Historia de Usuario antes de modificar el código base.

☁️ Arquitectura y Despliegue Continúo (CI/CD)
El proyecto implementa prácticas modernas de DevOps a través de Azure Pipelines. Al realizar un push o fusionar cambios en la rama main:

El pipeline inyecta de forma segura los secretos de producción en tiempo de compilación (--build-arg).

Construye una imagen mediante un Dockerfile multi-etapa ultra ligero basado en Nginx.

Empuja la imagen resultante a una bóveda privada en Azure Container Registry.

Despliega la nueva versión automáticamente en un Azure App Service.
