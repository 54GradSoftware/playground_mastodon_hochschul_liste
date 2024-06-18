FROM node:alpine as builder

WORKDIR /app
ADD . .

RUN npm ci

RUN npm run get-data