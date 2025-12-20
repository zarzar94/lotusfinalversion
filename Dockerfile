# ═══════════════════════════════════════════════════════════════════════════
# FRONTEND BUILD STAGE
# ═══════════════════════════════════════════════════════════════════════════

FROM node:20-alpine AS frontend-builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy source files
COPY . .

# Build frontend
ARG VITE_API_URL=/api
ARG VITE_CLINIC_PHONE=+966500000000
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CLINIC_PHONE=$VITE_CLINIC_PHONE

RUN npm run build

# ═══════════════════════════════════════════════════════════════════════════
# BACKEND BUILD STAGE
# ═══════════════════════════════════════════════════════════════════════════

FROM node:20-alpine AS backend-builder

WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy backend source
COPY backend/ .

# ═══════════════════════════════════════════════════════════════════════════
# PRODUCTION STAGE
# ═══════════════════════════════════════════════════════════════════════════

FROM node:20-alpine AS production

# Install dumb-init for proper process handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S lotus -u 1001

WORKDIR /app

# Copy backend from builder
COPY --from=backend-builder --chown=lotus:nodejs /app/backend ./backend

# Copy frontend build from builder
COPY --from=frontend-builder --chown=lotus:nodejs /app/dist ./frontend/dist

# Create uploads directory
RUN mkdir -p /app/backend/uploads && chown lotus:nodejs /app/backend/uploads

# Switch to non-root user
USER lotus

WORKDIR /app/backend

# Environment variables
ENV NODE_ENV=production
ENV PORT=3001

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Start with dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "src/index.js"]
