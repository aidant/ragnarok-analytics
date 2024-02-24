FROM node:20-alpine as builder
WORKDIR /app
COPY . .
RUN npm ci && \
  npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
CMD node lib/entrypoint.js
