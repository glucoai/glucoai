FROM node:20-alpine AS builder
WORKDIR /repo
RUN corepack enable
RUN apk add --no-cache git
ARG GIT_REPO=https://github.com/glucoai/glucoai.git
ARG GIT_REF=main
ARG GIT_TOKEN=
RUN if [ -n "$GIT_TOKEN" ]; then REPO_NO_PROTO=$(echo "$GIT_REPO" | sed -e 's#https://##' -e 's#http://##'); git clone --depth 1 --branch ${GIT_REF} https://${GIT_TOKEN}@${REPO_NO_PROTO} /repo; else git clone --depth 1 --branch ${GIT_REF} ${GIT_REPO} /repo; fi
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @gluco/frontend build

FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html
COPY --from=builder /repo/apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /repo/apps/frontend/dist .
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
