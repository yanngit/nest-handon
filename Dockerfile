# Create a multi stage build for prod container (not installing dev dependencies, https://blog.logrocket.com/containerized-development-nestjs-docker/)
FROM node:15.14-alpine3.10 As development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
FROM node:15.14-alpine3.10 As production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install --only=production
COPY . .
COPY --from=development /usr/src/app/dist ./dist
RUN rm .env
EXPOSE 3000
CMD ["node", "dist/main"]