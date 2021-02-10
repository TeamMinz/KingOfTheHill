FROM node:erbium-buster-slim

EXPOSE 8081
ENV NODE_ENV=production

COPY . /opt/koth
WORKDIR /opt/koth

RUN npm ci

CMD [ "node", "backend.js" ]