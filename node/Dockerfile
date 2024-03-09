FROM node:6.14-alpine

RUN mkdir /src
WORKDIR /src

RUN apk update \
    && apk --no-cache --update add build-base postgresql-dev python
RUN npm install -g node-gyp

ADD ./package.json /src/
RUN npm install --production

# Likely better to just copy over package.json then npm install then copy everything else. caching of container should work better.
ADD . /src/

EXPOSE 3000

CMD node /src/server.js