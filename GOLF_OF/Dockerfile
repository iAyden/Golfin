# Fase 1: Construcción del sitio web estático
FROM node:20 AS builder

WORKDIR /app

COPY package.json package-lock.json* ./

RUN npm install -g expo-cli

RUN npm install

COPY . .


RUN npx expo export:web

# Fase 2: Servir con Nginx
FROM nginx:alpine

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d

# Asegúrate que este directorio es el correcto (Expo lo crea por defecto)
COPY --from=builder /app/web-build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
