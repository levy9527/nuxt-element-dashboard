FROM node:8.9.1
COPY . /app
WORKDIR /app
RUN npm install --registry=https://registry.npm.taobao.org
EXPOSE 3333
CMD npm run build && npm run start
