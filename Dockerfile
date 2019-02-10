# Using Alpine to keep the images smaller
FROM alpine:latest

# Pushing all files into image
WORKDIR /app
ADD . /app

# Install updates and NodeJS+Dependencies
RUN apk update && apk upgrade
RUN apk add nodejs npm git python build-base clang

# Install yarn
RUN npm i yarn -g

# Install Pinafore
RUN yarn --pure-lockfile
RUN yarn build

# Expose port 4002
EXPOSE 4002

# Setting run-command
CMD PORT=4002 yarn start
