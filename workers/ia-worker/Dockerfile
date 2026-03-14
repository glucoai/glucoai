FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable
RUN apk add --no-cache git
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY workers/ia-worker/package.json workers/ia-worker/package.json
RUN pnpm install --frozen-lockfile
COPY workers/ia-worker ./workers/ia-worker
RUN pnpm --filter @gluco/ia-worker build
RUN pnpm prune --prod

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/workers/ia-worker/dist ./workers/ia-worker/dist
COPY --from=builder /app/workers/ia-worker/package.json ./workers/ia-worker/package.json
CMD ["node", "workers/ia-worker/dist/index.js"]
