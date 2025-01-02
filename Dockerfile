FROM node:18.13.0-alpine
WORKDIR /usr/src/app
COPY . .
RUN chown -R node /usr/src/app
RUN npm install vite -g
USER node
RUN npm install && npm run build
EXPOSE 5436
CMD ["npm", "run", "start"]
