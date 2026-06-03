# Etapa 1: Construcción (Build)
FROM node:20-alpine AS build
WORKDIR /app
# Habilitamos pnpm
RUN npm install -g pnpm
# Copiamos solo los candados primero (optimización de caché)
COPY package.json pnpm-lock.yaml ./
RUN pnpm install
# Copiamos el resto del código y compilamos
COPY . .
RUN pnpm run build

# Etapa 2: Producción (Nginx)
FROM nginx:alpine AS final
# Copiamos la app compilada (la carpeta dist) desde la etapa 1 al servidor web
COPY --from=build /app/dist /usr/share/nginx/html
# Exponemos el puerto 80
EXPOSE 80
# Encendemos el servidor
CMD ["nginx", "-g", "daemon off;"]