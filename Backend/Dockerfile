FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5050

ENV NODE_ENV=production

CMD ["npm", "run", "start"]
