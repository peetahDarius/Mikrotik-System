FROM node:18.20-alpine as build

ENV NODE_OPTIONS="--max-old-space-size=4096"

WORKDIR /frontend

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

FROM nginx:alpine

COPY --from=build /frontend/build /usr/share/nginx/html

COPY --from=build /frontend/nginx /etc/nginx/conf.d/

RUN touch /usr/share/nginx/html/config.json

RUN chmod 644 /usr/share/nginx/html/config.json

EXPOSE 80