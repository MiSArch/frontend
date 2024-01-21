FROM node:21 AS builder
WORKDIR /app
RUN corepack enable
RUN yarn set version berry
COPY . /app
RUN yarn
RUN yarn build

FROM nginx:latest
COPY --from=builder /app/dist /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/templates/default.conf.template