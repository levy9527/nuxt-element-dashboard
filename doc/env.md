## 环境变量说明

- API_SERVER axios的baseURL，可不传。不传时，则使用相对路径发送请求
- PUBLIC_PATH 对应webpack的publicPath，用于指定静态文件访问路径，默认为 http://cdn.deepexi.com/，一定要/结尾
- NO_LOGIN 是否登陆拦截，传1则不会有登录拦截
- COOKIE_PATH 用于设置cookie的path，如果多个项目需要共享cookie，则应该保证项目在共同的目录下，且设置COOKIE_PATH为它们的共同目录地址
