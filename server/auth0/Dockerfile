FROM alpine:latest AS builder
RUN mkdir /app
WORKDIR /app
RUN apk add nodejs yarn
COPY package.json package.json
#RUN yarn set version berry
RUN yarn install
COPY tsconfig.json tsconfig.json
COPY src/ src/
RUN yarn run build

FROM alpine:latest AS runtime
RUN apk add nodejs yarn
RUN mkdir /app
WORKDIR /app
COPY --from=builder /app/dist/ .
COPY --from=builder /app/package.json package.json
COPY --from=builder /app/yarn.lock yarn.lock
RUN yarn install --production

ENTRYPOINT ["node"]
CMD ["index.js"]
