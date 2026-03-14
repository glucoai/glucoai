FROM node:20-alpine AS builder
WORKDIR /repo
RUN corepack enable
RUN apk add --no-cache git
ARG GIT_REPO=https://github.com/glucoai/glucoai.git
ARG GIT_REF=main
ARG GIT_TOKEN=
RUN if [ -n "$GIT_TOKEN" ]; then REPO_NO_PROTO=$(echo "$GIT_REPO" | sed -e 's#https://##' -e 's#http://##'); git clone --depth 1 --branch ${GIT_REF} https://${GIT_TOKEN}@${REPO_NO_PROTO} /repo; else git clone --depth 1 --branch ${GIT_REF} ${GIT_REPO} /repo; fi
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @gluco/backend generate
RUN pnpm --filter @gluco/backend build
RUN pnpm prune --prod

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /repo/node_modules ./node_modules
COPY --from=builder /repo/apps/backend/dist ./apps/backend/dist
COPY --from=builder /repo/apps/backend/package.json ./apps/backend/package.json
EXPOSE 3000
CMD ["node", "apps/backend/dist/index.js"]
