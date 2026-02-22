# Base stage - shared dependencies
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY prisma ./prisma/
RUN npx prisma generate

# Development stage
FROM base AS dev
COPY . .
EXPOSE 4000
CMD ["npm", "run", "dev"]

# Build stage
FROM base AS build
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS prod
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
COPY --from=build /app/prisma ./prisma
EXPOSE 4000
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
