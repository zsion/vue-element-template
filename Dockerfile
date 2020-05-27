FROM 10.10.10.96:8082/library/node:12-alpine AS build
RUN node --version && npm --version && \
    npm config set -g registry 'https://registry.npm.taobao.org' && \
    npm config set -g sass_binary_site https://npm.taobao.org/mirrors/node-sass
WORKDIR /src
COPY package.json .
RUN npm install
COPY . .
RUN npm run build:prod

FROM scratch AS publish
COPY --from=build /src/dist /app
