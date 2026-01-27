# Stage 1: Build the application
FROM node:22-alpine AS builder

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Enable corepack for yarn support if needed, or simply use yarn as it comes with node images often
# Copy package files
COPY package.json package-lock.json ./

# Install dependencies including devDependencies for build
RUN npm ci

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

# Command to run migrations and start the application
# Note: Using `npx prisma migrate deploy` in production startup is risky for zero-downtime, but standard for simple setups.
# Ensure `node dist/index.js` matches your build output entry point.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
