# nuxt2 + element dashboard

## Build Setup

```bash
# install dependencies
$ yarn

# serve with hot reload at localhost:3000
# using mock api
$ yarn mock

# using backend api
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start
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

### projectNo

you can add a project in [usercenter](http://gateway.deepexi.top/cp-web/)
and custom project config. then add projectNo in nuxt.config.js.

## 测试

项目默认添加了测试命令, 但是未安装测试依赖, 如果想使用 e2e 测试请先安装依赖

```shell
  npm i --save-dev nuxt-puppeteer-jest
```

本项目测试默认集成了 **Jest** 和 **Puppeteer**, 对于该工具使用可参考

[Jest api doc](https://facebook.github.io/jest/docs/en/api.html)
[Puppeteer doc](https://github.com/GoogleChrome/puppeteer)

安装后可以输入以下命令, 默认运行 test 目录下的 `*.test.js` 文件

```shell
  npm run test:e2e
```

[nuxt-puppeteer-jest 的使用说明文档](https://github.com/PepperYan/nuxt-jest-puppeteer)

在项目 test 目录中, 预留一个 test demo, 可以查看 `test/login.test.js` 并尝试实现自己的测试用例.

## code style

when you npm i or yarn, prettier has already installed

the configuration file is .prettierrc

Pre-commit Hook use [pretty-quick](https://github.com/azz/pretty-quick), maybe commit in terminal will be better, in IDE
like webstorm it may get confused behavior😕
