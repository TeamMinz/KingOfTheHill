FROM node:current-alpine3.13 

ENV NODE_ENV=production

WORKDIR /opt/koth
COPY . . 

EXPOSE 8000

RUN yarn install --immutable

CMD [ "node", "backend.js" ]
