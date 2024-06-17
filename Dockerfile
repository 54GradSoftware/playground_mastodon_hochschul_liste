FROM node:alpine as builder

WORKDIR /app
ADD . .

RUN npm run grab-the-data-and-build

# build nginx webserver
FROM nginx:alpine

EXPOSE 3001

ADD ./nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/frontend/dist /var/www/html