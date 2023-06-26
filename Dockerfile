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

FROM alpine
RUN apk update \
    && apk add lighttpd \
    && rm -rf /var/cache/apk/*
COPY --from=builder /data/build /var/www/localhost/htdocs
CMD ["lighttpd","-D","-f","/etc/lighttpd/lighttpd.conf"]
