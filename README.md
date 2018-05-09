# nuxt2 + element dashboard

## Build Setup

```bash
# install dependencies
$ npm install # Or yarn install

# serve with hot reload at localhost:3000
# using mock api
$ npm run dev

# using backend api
$ npm run test

# build for production and launch server
$ npm run build && npm start
```

## deploy

support node/docker/now

### node

run nodejs in your server

```bash
$ ./nohup.sh
```

### docker

run docker in your server

```bash
$ ./start.sh
```

### now

deploy to now

```bash
$ npm run deploy
```

For detailed explanation on how things work, checkout the [Nuxt.js docs](https://github.com/nuxt/nuxt.js).

## code style

when you npm i or yarn, prettier has already installed

the configuration file is .prettierrc

Pre-commit Hook use [pretty-quick](https://github.com/azz/pretty-quick), maybe commit in terminal will be better, in IDE
like webstorm it may get confused behavior😕
