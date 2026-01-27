# Stage 1: Build the application
FROM node:22-alpine AS builder

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Enable corepack for yarn support if needed, or simply use yarn as it comes with node images often
# Copy package files
COPY package.json package-lock.json ./

# Install dependencies including devDependencies for build
# Use --include=dev because NODE_ENV might be set to production by the build environment
RUN npm ci --include=dev

# Copy the rest of the application source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the TypeScript code
RUN npm run build

# Stage 2: Create the production image
FROM node:22-alpine

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy the built application from the builder stage
COPY --from=builder /app/dist ./dist
# Copy Prisma schema and migrations if runtime migration/generation is needed
COPY --from=builder /app/prisma ./prisma
# Copy generated Prisma engine/client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Environment variables will be injected by Coolify, but we can set defaults
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port (Coolify usually maps internal port)
EXPOSE 3000

# Debug: Check if dist exists and has content
RUN ls -la /app/dist

# Command to start the application
CMD ["node", "dist/index.js"]
