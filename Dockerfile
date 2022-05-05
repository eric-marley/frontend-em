FROM node:16.11

EXPOSE 8080

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN npm install

CMD "npm" "run" "serve"
