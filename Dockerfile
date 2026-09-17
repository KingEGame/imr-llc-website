FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@10.34.3 --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM node:22-alpine AS runner
RUN npm install -g serve
WORKDIR /app
COPY --from=builder /app/dist ./dist
EXPOSE 3000
ENV PORT=3000
CMD ["serve", "dist", "-l", "3000"]
