FROM node:10

WORKDIR /opt/app

COPY ./app/package.json ./app/yarn.lock ./app/start.sh ./

RUN yarn

CMD ./start.sh