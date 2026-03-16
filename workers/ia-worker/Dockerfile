FROM node:20-alpine AS builder
WORKDIR /repo
RUN corepack enable
RUN apk add --no-cache git
ARG GIT_REPO=https://github.com/glucoai/glucoai.git
ARG GIT_REF=main
ARG GIT_TOKEN=
RUN if [ -n "$GIT_TOKEN" ]; then REPO_NO_PROTO=$(echo "$GIT_REPO" | sed -e 's#https://##' -e 's#http://##'); git clone --depth 1 --branch ${GIT_REF} https://${GIT_TOKEN}@${REPO_NO_PROTO} /repo; else git clone --depth 1 --branch ${GIT_REF} ${GIT_REPO} /repo; fi
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @gluco/ia-worker build
RUN CI=true pnpm --filter @gluco/ia-worker prune --prod

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /repo/node_modules ./node_modules
COPY --from=builder /repo/workers/ia-worker/dist ./workers/ia-worker/dist
COPY --from=builder /repo/workers/ia-worker/package.json ./workers/ia-worker/package.json
CMD ["node", "workers/ia-worker/dist/index.js"]
