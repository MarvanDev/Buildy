# 🏗️ Buildy - Docker Wizard

Buildy es un generador visual de infraestructura diseñado para estudiantes universitarios. Permite generar archivos `docker-compose.yml` listos para usar mediante un asistente (Wizard) paso a paso, seleccionando tecnologías, bases de datos y puertos de manera intuitiva.

## 🚀 Tecnologías Principales

* **Core:** Vite + React + TypeScript
* **Estilos y UI:** Tailwind CSS + shadcn/ui
* **Gestión de Estado:** Zustand
* **Diagramas:** React Flow (Por implementar)
* **Empaquetado:** JSZip + File-Saver

## ⚙️ Instalación y Uso Local

Sigue estos pasos para levantar el entorno de desarrollo en tu computadora:

1. **Clonar el repositorio y entrar a la carpeta:**
   ```bash
   # (Reemplazar con la URL real de Azure Repos cuando esté lista)
   git clone <url-del-repositorio>
   cd Buildy
Instalar las dependencias:

Bash
npm install
Levantar el servidor local:

Bash
npm run dev
El proyecto estará disponible en http://localhost:3000

🛠️ Scripts Disponibles
npm run dev: Inicia el servidor de desarrollo con Hot-Reload.

npm run build: Compila la aplicación para producción.

npm run lint: Ejecuta ESLint y TypeScript para verificar errores en el código antes de subir cambios.

👥 Flujo de Trabajo (Equipo) 
Este proyecto se gestiona a través de Azure Boards. Por favor, asegúrate de crear una rama nueva para cada Feature o Historia de Usuario antes de modificar el código base.