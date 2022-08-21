FROM node:latest

USER 0

COPY ["package.json", "package-lock.json*", "./"]
#RUN mkdir -p /opt/graphql/
#WORKINGDIR /opt/graphql/
#RUN chmod 777 .
RUN npm install --production

COPY . .
USER 1001
ENTRYPOINT [ "node", "index.js" ]
