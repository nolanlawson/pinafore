# Using Alpine to keep the images smaller
FROM alpine:latest

# Pushing all files into image
WORKDIR /app
ADD . /app

# Install updates and NodeJS+Dependencies
RUN apk add --update --no-cache --virtual build-dependencies git python build-base clang \
# Install updates and NodeJS+Dependencies
 && apk add --update --no-cache nodejs npm \
# Install yarn
 && npm i yarn -g \
# Install Pinafore
 && yarn --production --pure-lockfile \
 && yarn build \
 && yarn cache clean \
 && rm -rf ./src \
# Cleanup
 && apk del build-dependencies

# Expose port 4002
EXPOSE 4002

# Setting run-command, using explicit `node` command
# rather than `yarn` or `npm` to use less memory
# https://github.com/nolanlawson/pinafore/issues/971
CMD PORT=4002 node server.js
