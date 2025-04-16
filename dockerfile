FROM node:20.14.0-alpine

WORKDIR /appback

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start:dev"]