FROM node:20-bullseye-slim AS base
WORKDIR /repo
RUN corepack enable
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates git openssl libssl1.1 \
  && rm -rf /var/lib/apt/lists/*
ARG GIT_REPO=https://github.com/glucoai/glucoai.git
ARG GIT_REF=main
ARG GIT_TOKEN=
RUN GIT_REPO_CLEAN=$(echo "$GIT_REPO" | tr -d '\`') \
  && if [ -n "$GIT_TOKEN" ]; then REPO_NO_PROTO=$(echo "$GIT_REPO_CLEAN" | sed -e 's#https://##' -e 's#http://##'); git clone --depth 1 --branch ${GIT_REF} https://${GIT_TOKEN}@${REPO_NO_PROTO} /repo; else git clone --depth 1 --branch ${GIT_REF} ${GIT_REPO_CLEAN} /repo; fi

FROM base AS builder
ARG URL_BANCO
ENV URL_BANCO=${URL_BANCO}
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @gluco/backend generate
RUN pnpm --filter @gluco/backend build

FROM node:20-bullseye-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /repo/node_modules ./node_modules
COPY --from=builder /repo/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=builder /repo/apps/backend/dist ./apps/backend/dist
COPY --from=builder /repo/apps/backend/package.json ./apps/backend/package.json
EXPOSE 3000
CMD ["node", "apps/backend/dist/index.js"]
