# nuxt2 + element dashboard

## Docs

For detailed explanation on how things work, checkout the [Nuxt.js docs](https://github.com/nuxt/nuxt.js).

## Script

```bash
# install dependencies
$ yarn

# serve with hot reload at localhost:3000
# using mock api to develop
$ yarn mock

# using mock api to develop which doesn't need login
$ yarn mock:nologin

# using backend api to develop
$ yarn dev

# build for production
$ yarn build
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
