# nuxt2 + element dashboard
[![Build Status](https://travis-ci.com/levy9527/nuxt-element-dashboard.svg?branch=master)](https://travis-ci.com/levy9527/nuxt-element-dashboard)[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/levy9527/nuxt-element-dashboard/pulls)[![Automated Release Notes by gren](https://img.shields.io/badge/%F0%9F%A4%96-release%20notes-00B2EE.svg)](https://github-tools.github.io/github-release-notes/)

## Table of Contents

- **[Feature](#feature)**
- **[快速开始](#快速开始)**
- **[工程结构](#工程结构)**
- **[开发](#开发)**
  - **[新建页面](#新建页面)**
  - **[调用接口](#调用接口)**
  - **[CRUD](#CRUD)**
  - **[设置代理](#设置代理)**
- **[环境变量](#环境变量)**
- **[构建](#构建)**
- **[License](#license)**

## Feature

在[Nuxt.js](https://github.com/nuxt/nuxt.js)的基础上，集成以下技术栈：

- UI库：[element-ui](http://element.eleme.io/#/)
- ajax库： [axios](https://github.com/axios/axios)
- css预处理器：[less](http://lesscss.org/)
- 代码格式化：[prettier](https://github.com/prettier/prettier)
- 环境变量: [dotenv](https://www.npmjs.com/package/dotenv)

[⬆ Back to Top](#table-of-contents)

## 快速开始

```bash
# 安装依赖
yarn

# 使用mock接口进行开发
yarn mock

# 使用mock接口进行开发，且不会有登录拦截
yarn mock:nologin

# 使用后端接口进行开发
yarn dev

# 使用webpack进行生产构建
yarn build

# 生成静态站点
yarn generate
```

[⬆ Back to Top](#table-of-contents)

## 工程结构

```sh
├── README.md
├── nuxt.config.js  框架配置文件
├── package.json    
├── src
│   ├── assets      资源，包括样式文件与图片
│   │   └── global.less
│   ├── components  可复用的组件
│   ├── const       常量文件
│   │   ├── api.js  定义api路径
│   │   └── path.js 定义页面跳转路径
│   ├── layouts     可复用的页面布局
│   │   ├── default.vue 
│   │   └── login.vue
│   ├── middleware  自定义函数，会在每个页面渲染前执行
│   │   └── meta.js
│   ├── mixins      可复用的“织入”页面的代码片断
│   │   └── auth.js
│   ├── pages       应用视图 & 路由名称，每个文件都对应一个路由视图，开发者框无需手动维护路由文件
│   │   ├── index.vue
│   │   └── login.vue
│   ├── plugins     应用插件，在Vue.js 初始化前运行，可在这里引入第三方类库
│   │   ├── axios.js
│   │   └── element.js
│   └── store       Vuex状态管理文件
│       └── index.js
├── static          静态资源
│   └── favicon.ico
└── yarn.lock
```

[⬆ Back to Top](#table-of-contents)

## 开发

### 新建页面

Nuxt.js 会依据 `pages` 目录中的所有 `*.vue` 文件生成应用的路由配置

在`pages`目录下新建一个名为 `hello.vue` 的页面

```html
<template>
  <h1>Hello world!</h1>
</template>
```

即可在 <http://localhost:3000/hello> 访问到新建的页面

[⬆ Back to Top](#table-of-contents)

### 调用接口

使用`this.$axios` 调用接口：

- 可以在 `*.vue` 文件中的生命周期钩子函数中调用
- 可以在 `methods` 里调用
- 可以在 `store/*.js` 的 `actions` 里调用

```js
// vue文件
export default {
  mounted() {
    this.$axios.$get(url)
  },
  methods: {
    fetchData() {
      this.$axios.$get(url)
    }
  }
}
```

```js
// store/index.js
export const actions = {
  async fetchData({commit}, {params}) {
    let resp = await this.$axios.$get(url, {params})
    commit('update', resp)
  }
}
```

[⬆ Back to Top](#table-of-contents)

### CRUD

注意方法前有$

```js
// GET 请求
this.$axios.$get('/users', {params: {key: value})
.then(resp => {
})
.catch(e => {})
```

```js
// POST 请求
this.$axios.$post('/user', {
    firstName: 'Fred',
    lastName: 'Flintstone'
  })
 .then(resp => {
  })
.catch(e => {})
```

```js
// PUT 请求
this.$axios.$put('/user/1', {
    firstName: 'Fred',
    lastName: 'Flintstone'
  })
 .then(resp => {
  })
.catch(e => {})
```

```js
// DELETE 请求
this.$axios.$delete('/user/1')
 .then(resp => {
  })
.catch(e => {})
```

```js
// 或
this.$axios({
  method: 'delete',
  url: '/users',
  data: {
    rows: [1,2],
  }
})
```

[⬆ Back to Top](#table-of-contents)

### 设置代理

开发时，api使用的都是相对路径，通过代理来解决跨域问题。

在 `nuxt.config.js` 中找到 `config` 变量，修改 `mock` 设置：

```sh
env: {
    mock: {
      '/api': 'http://mock.api.server',
    },
    dev: {
      '/api': 'http://real.api.server',
    }
  }
```

则对于所有以 `/api` 开头的请求：

1. 在 `yarn mock` 模式下，都会变成 `http://mock.api.server/api`

1. 在 `yarn dev` 模式下，都会变成 `http://real.api.server/api`

**注意，每次修改代理设置，都需要重新启动应用才能生效**

[⬆ Back to Top](#table-of-contents)

## 环境变量

使用.env设置环境变量, 即在项目根目录新建一个.env文件, 填写环境变量即可。

**注意，该文件不能提交至版本控制系统中。**

.env文件示例:

```sh
# 左边是变量名(一般大写，下划线分割单词)，右边是变量值
# 注意=号两边不能有空格
TESTING_VAR=just-fot-testing
ANOTHER_VAR=another
```

可以在项目的vue文件或js文件中读取

```js
mounted() {
  console.log(process.env.TESTING_VAR) // 输出 just-fot-testing
}
```

**自带的环境变量说明**

| 环境变量名  | 说明                                                         | 是否必须             | 默认值                   | 示例 |
| ----------- | ------------------------------------------------------------ | ----------------------- | ------------------------- | ----------- |
| PUBLIC_PATH | 对应webpack的publicPath，用于指定静态文件访问路径，一定要/结尾 | 是 |  | http://cdn.deepexi.com/ |
| API_SERVER | axios的baseURL，可不传。不传时，使用相对路径发送请求 | 否 |    | https://www.easy-mock.com |
| NO_LOGIN    | 是否登陆拦截，传1则不会有登录拦截                            | 否 |                          | 1 |
| COOKIE_PATH | 用于设置cookie的path，如果多个项目需要共享cookie，则应该保证项目在共同的目录下，且设置COOKIE_PATH为它们的共同目录地址 | 否                      | /                   | /xpaas |

[⬆ Back to Top](#table-of-contents)

## 构建

构建会读取根目录下的.env文件获取环境变量, 默认生成的是hash路由模式的spa, 在`dist`目录输出静态文件

命令如下:

```sh
yarn build
```

## License

[MIT](./LICENSE)

[⬆ Back to Top](#table-of-contents)
