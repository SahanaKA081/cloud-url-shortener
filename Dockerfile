# ============================================================
# Stage 1: Build the React Frontend
# ============================================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Install dependencies
COPY frontend/package*.json ./
RUN npm ci

# Copy source and build
COPY frontend/ ./
RUN npm run build

# ============================================================
# Stage 2: Run the Node.js Backend + Serve Frontend
# ============================================================
FROM node:20-alpine AS production

WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --omit=dev

# Copy backend source
COPY backend/ ./backend/

# Copy the built React app from Stage 1
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Expose Hugging Face Spaces default port
EXPOSE 7860

# Set NODE_ENV to production
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:7860/api/url/health || exit 1

# Start the Express server
CMD ["node", "backend/server.js"]
