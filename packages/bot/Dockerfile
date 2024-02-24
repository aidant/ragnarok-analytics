FROM node:20-alpine as builder
WORKDIR /app
COPY . .
RUN npm install --force && \
  npm run build && \
  npm prune --production

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/lib /app/lib
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json
CMD node lib/entrypoint.js
