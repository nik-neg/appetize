FROM node:14.15.3

WORKDIR /server

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "node", "index.js" ]