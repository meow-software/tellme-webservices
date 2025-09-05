# Étape 1 : builder avec turborepo
FROM node:20-alpine AS builder

WORKDIR /app

# Copier les fichiers racine
COPY package.json package-lock.json turbo.json ./

# Copier le code source
COPY prune/heimdall/full/apps/heimdall ./apps/heimdall
COPY prune/heimdall/full/packages ./packages

RUN npm ci

# Build uniquement le service voulu
RUN npx turbo run build --filter=heimdall...

# Étape 2 : runner
# Runner
FROM node:20-slim AS runner

WORKDIR /app

# Copier node_modules du builder
COPY --from=builder /app/node_modules ./node_modules

# Copier ton service
COPY --from=builder /app/apps/heimdall/dist ./dist
COPY --from=builder /app/apps/heimdall/package.json ./

# Copier aussi les packages partagés buildés
COPY --from=builder /app/packages ./packages

CMD ["node", "dist/main.js"]
