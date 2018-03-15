FROM node:6.12

RUN mkdir /src
WORKDIR /src
ADD . /src/

ENV NODE_ENV='docker-production'

RUN npm install

EXPOSE 3000

CMD node /src/server.js