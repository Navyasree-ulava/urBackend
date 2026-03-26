# Stage 1: Build
FROM node:22-alpine as build

WORKDIR /app

# Copy root package files for workspace support
COPY package.json package-lock.json ./

# Copy the common package and app package.jsons first for layer caching
COPY packages/common/package.json ./packages/common/
COPY apps/web-dashboard/package.json ./apps/web-dashboard/

# Install dependencies
RUN npm ci

# Copy the actual source code
COPY packages/common ./packages/common
COPY apps/web-dashboard ./apps/web-dashboard

# Set working directory to the dashboard app
WORKDIR /app/apps/web-dashboard

# Build the app
# Note: VITE_ variables must be available at build time for Vite
ARG VITE_API_URL=http://localhost:1234
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy the built assets from the build stage
COPY --from=build /app/apps/web-dashboard/dist /usr/share/nginx/html

# Add a basic Nginx config to handle SPA routing (redirect all to index.html)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
