FROM node:current-buster-slim

ENV NODE_ENV=production

WORKDIR /opt/koth
COPY . . 

EXPOSE 8000

RUN npm ci

CMD [ "node", "backend.js" ]
