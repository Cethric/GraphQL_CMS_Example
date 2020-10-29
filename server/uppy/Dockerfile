FROM golang:1.12-alpine AS tusd-builder
RUN apk add git gcc libc-dev
RUN git clone https://github.com/tus/tusd.git
WORKDIR tusd
RUN go get -d
RUN version="$(git tag -l --points-at HEAD)" \
        && commit=$(git log --format="%H" -n 1) \
        && GOOS=linux GOARCH=amd64 go build \
            -ldflags="-X github.com/tus/tusd/cmd/tusd/cli.VersionName=${version} -X github.com/tus/tusd/cmd/tusd/cli.GitCommit=${commit} -X 'github.com/tus/tusd/cmd/tusd/cli.BuildDate=$(date --utc)'" \
            -o "/go/bin/tusd" ./cmd/tusd/main.go

FROM alpine:latest AS certificate-builder
RUN apk add openssl
RUN mkdir -p /keys
RUN openssl req -x509 -new -newkey rsa:4096 -nodes -sha256 -days 3650 -keyout /keys/tusd.key -out /keys/tusd.pem -subj "/CN=localhost"
RUN openssl req -x509 -new -newkey rsa:4096 -nodes -sha256 -days 3650 -keyout /keys/companion.key -out /keys/companion.pem -subj "/CN=localhost"

FROM alpine:latest AS uppy-runtime
COPY --from=tusd-builder /go/bin/tusd /usr/local/bin/tusd
COPY --from=certificate-builder /keys/ /keys/
RUN apk add --no-cache ca-certificates jq gcc nodejs npm
RUN addgroup -g 1000 tusd
RUN adduser -u 1000 -G tusd -s /bin/sh -D tusd
RUN mkdir -p /srv/tusd-hooks
RUN mkdir -p /srv/tusd-data
RUN chown tusd:tusd /srv/tusd-data
RUN npm install -g @uppy/companion concurrently

WORKDIR /srv/tusd-data
EXPOSE 1080
EXPOSE 3020
ENTRYPOINT ["concurrently"]
CMD ["--kill-others-on-fail", "--names", "tusd,companion","tusd --hooks-dir /srv/tusd-hooks --upload-dir /srv/tusd-data", "companion"]