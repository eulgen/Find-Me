# Étape 1 : Build de l'application Nuxt 3
FROM node:26-alpine AS builder

WORKDIR /app

# Copie des fichiers de dépendances
COPY package*.json ./

# Installation propre des dépendances
RUN npm ci

# Copie du reste des fichiers du projet
COPY . .

# Construction du bundle de production (Nitro)
RUN npm run build

# Étape 2 : Image finale d'exécution légère
FROM node:26-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3000

# Copie uniquement du build serveur Nitro généré
COPY --from=builder /app/.output ./.output

EXPOSE 3000

# Built-in container healthcheck
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://localhost:3000/').then(r=>r.ok?process.exit(0):process.exit(1)).catch(()=>process.exit(1))"

# Démarrage du serveur Nuxt (Nitro)
CMD ["node", ".output/server/index.mjs"]
