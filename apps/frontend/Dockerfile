FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable
RUN apk add --no-cache git
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY apps/frontend/package.json apps/frontend/package.json
COPY packages/ui/package.json packages/ui/package.json
COPY packages/utils/package.json packages/utils/package.json
COPY packages/tipos/package.json packages/tipos/package.json
RUN pnpm install --frozen-lockfile
COPY apps/frontend ./apps/frontend
COPY packages ./packages
RUN pnpm --filter @gluco/frontend build

FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html
COPY --from=builder /app/apps/frontend/dist .
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
