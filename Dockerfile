FROM node:alpine as builder
WORKDIR /data
RUN apk update \
    && apk add git \
    && rm -rf /var/cache/apk/*
COPY . .
RUN git config --global user.email "github-actions[bot]@users.noreply.github.com" \
    && git config --global user.name "github-actions[bot]"
RUN npm install
RUN npm run build

FROM qjoly/lighttpd:latest
WORKDIR /var/www/localhost/htdocs
COPY --from=builder /data/build/ .
CMD ["start.sh"]
