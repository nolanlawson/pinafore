# Using Alpine to keep the images smaller
FROM alpine:latest

# Pushing all files into image
WORKDIR /app
ADD . /app

# Install updates and NodeJS+Dependencies
RUN apk update && apk upgrade
RUN apk add nodejs git python build-base clang

# Upgrading NPM
RUN npm i npm@latest -g

# Install Pinafore and setting run-command
RUN npm install
RUN npm run build

EXPOSE 4002

CMD PORT=4002 npm start