# Step 1: build with turborepo
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root files
COPY package.json package-lock.json turbo.json ./

# Copy source code
COPY prune/heimdall/full/apps/heimdall ./apps/heimdall
COPY prune/heimdall/full/packages ./packages

RUN npm ci

# Build only the desired service
RUN npx turbo run build --filter=heimdall...

# Step 2: runner
FROM node:20-slim AS runner

WORKDIR /app

# Copy node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy your service
COPY --from=builder /app/apps/heimdall/dist ./dist
COPY --from=builder /app/apps/heimdall/package.json ./

# Also copy built shared packages
COPY --from=builder /app/packages ./packages

CMD ["node", "dist/main.js"]
