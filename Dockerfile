# 1. Imagen base oficial ligera de Node.js en Alpine Linux
FROM node:20-alpine

# 2. Directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copiar descriptores de paquetes
COPY package*.json ./

# 4. Instalar dependencias
RUN npm install

# 5. Copiar el código fuente del proyecto
COPY . .

# 6. Compilar el bundle de producción con esbuild
RUN npm run build

# 7. Crear directorios para persistencia de archivos subidos y base de datos
RUN mkdir -p uploads/photos uploads/documents uploads/avatars src/data

# 8. Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=8000

# 9. Exponer el puerto de la aplicación
EXPOSE 8000

# 10. Comando de ejecución
CMD ["node", "server.js"]
