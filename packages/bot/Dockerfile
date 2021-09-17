FROM node:16-alpine as builder
WORKDIR /app
COPY . .
RUN npm install --force && \
  npm run build && \
  npm prune --production

FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/lib /app/node_modules /app/package.json ./
CMD node lib/entrypoint.js
