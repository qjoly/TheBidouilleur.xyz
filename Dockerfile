FROM node:alpine as builder
WORKDIR /data
COPY . .
RUN npm install
RUN npm run build

FROM alpine
RUN apk update \
    && apk add lighttpd \
    && rm -rf /var/cache/apk/*
COPY --from=builder /data/build /var/www/localhost/htdocs
CMD ["lighttpd","-D","-f","/etc/lighttpd/lighttpd.conf"]
