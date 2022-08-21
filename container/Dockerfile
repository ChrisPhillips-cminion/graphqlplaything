FROM node:latest

COPY ["package.json", "package-lock.json*", "./"]
RUN chmod 777 .
RUN npm install --production

COPY . .

CMD [ "node", "index.js" ]
