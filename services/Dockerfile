FROM node:current-alpine3.13 

ENV NODE_ENV=production

WORKDIR /opt/koth
COPY . . 

EXPOSE 8000

RUN npm ci

CMD [ "node", "backend.js" ]
