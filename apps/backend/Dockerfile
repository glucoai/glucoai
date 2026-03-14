FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable
RUN apk add --no-cache git
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/backend/package.json apps/backend/package.json
RUN pnpm install --frozen-lockfile
COPY apps/backend ./apps/backend
RUN pnpm --filter @gluco/backend generate
RUN pnpm --filter @gluco/backend build
RUN pnpm prune --prod

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/package.json ./apps/backend/package.json
EXPOSE 3000
CMD ["node", "apps/backend/dist/index.js"]
