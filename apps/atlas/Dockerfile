# Step 1: build with turborepo
FROM node:20-alpine AS builder

WORKDIR /app

# Install OpenSSL for prisma
RUN apk add --no-cache openssl make g++ python3

# Copy root files
COPY package.json package-lock.json turbo.json ./

# Copy source code
COPY prune/atlas/full/apps/atlas ./apps/atlas
COPY prune/atlas/full/packages ./packages

RUN npm ci

# Generate Prisma client for ws-db package
WORKDIR /app/packages/ws-db
RUN npx prisma generate

# Back to root for turbo build
WORKDIR /app

# Build only the desired service
RUN npx turbo run build --filter=atlas...

# Step 2: runner
FROM node:20-alpine AS runner

WORKDIR /app

# Copy node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy your service
COPY --from=builder /app/apps/atlas/dist ./dist
COPY --from=builder /app/apps/atlas/package.json ./

# Also copy built shared packages
COPY --from=builder /app/packages ./packages

CMD ["node", "dist/main.js"]
