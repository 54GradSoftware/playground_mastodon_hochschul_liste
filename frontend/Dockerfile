FROM node:alpine as builder

WORKDIR /app
ADD . .

ENV VITE_DATA_SERVER_URL='ABC'

RUN echo "test"

RUN echo $VITE_DATA_SERVER_URL

RUN npm ci && VITE_DATA_SERVER_URL=$VITE_DATA_SERVER_URL npm run build

# build nginx webserver
FROM nginx:alpine

EXPOSE 3001

ADD ./nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /var/www/html