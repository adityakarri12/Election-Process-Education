# Stage 1: Build the Next.js frontend
FROM node:20-slim AS frontend-builder

# Set working directory
WORKDIR /app/frontend

# Copy package.json and yarn.lock
COPY frontend/package.json frontend/yarn.lock ./

# Install dependencies with Yarn
RUN yarn install --frozen-lockfile

# Copy the rest of the frontend code
COPY frontend/ ./

# Build the static files with Yarn
RUN yarn build

# Stage 2: Build the FastAPI backend
FROM python:3.11-slim AS backend-builder

# Set working directory
WORKDIR /app

# Copy backend requirements
COPY backend/requirements.txt ./

# Install backend dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code
COPY backend/ ./

# Copy the built frontend from the previous stage
COPY --from=frontend-builder /app/frontend/out /app/static

# Expose the port
EXPOSE 8080

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
