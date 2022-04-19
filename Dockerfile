# Using Alpine to keep the images smaller
# Change to using the official NodeJS Alpine container
FROM node:16-alpine

# Pushing all files into image
WORKDIR /app
COPY . /app

# Install Pinafore
RUN yarn --production --pure-lockfile && \
    yarn build && \
    yarn cache clean && \
    rm -rf ./src ./docs ./tests ./bin

# Expose port 4002
EXPOSE 4002

# Setting run-command, using explicit `node` command
# rather than `yarn` or `npm` to use less memory
# https://github.com/nolanlawson/pinafore/issues/971
CMD PORT=4002 node server.js
