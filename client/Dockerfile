FROM node:14.15.3

WORKDIR /client

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]