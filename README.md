# nuxt2 + element dashboard
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/levy9527/nuxt-element-dashboard/pulls)

## Feature

在[Nuxt.js](https://github.com/nuxt/nuxt.js)的基础上，集成以下技术栈：

- Vue.js: [vue 2.0](https://cn.vuejs.org/v2/guide/index.html)

- 路由管理：[vue-router](https://router.vuejs.org/api/)

- 状态管理：[vuex](https://vuex.vuejs.org/)

- 页面Meta信息：[Vue-Meta](https://github.com/declandewet/vue-meta)

- UI库：[element-ui](http://element.eleme.io/#/)

- ajax库： [axios](https://github.com/axios/axios)

- css预处理器：[less](http://lesscss.org/)

- 代码格式化：[prettier](https://github.com/prettier/prettier)

## Script

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

## 环境变量
使用.env设置环境变量, 即在项目根目录新建一个.env文件, 填写环境变量即可。

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


## 构建

构建默认生成的是hash路由模式的spa, 会读取根目录下的.env文件获取环境变量

命令如下:

```sh
yarn build
```

## License

[MIT](./LICENSE)
