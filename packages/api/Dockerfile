FROM node:16-alpine as builder
WORKDIR /app
COPY . .
RUN npm install && \
  npm run build

FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/lib ./lib
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
CMD node lib/entrypoint.js
