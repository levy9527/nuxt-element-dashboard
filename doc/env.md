## 环境变量说明

- API_SERVER 用于指定接口请求的baseUrl, 如果不设置，则为当前请求路径
- PUBLIC_PATH 用于指定静态文件访问路径，默认为 http://cdn.deepexi.com/
- COOKIE_PATH 用于设置cookie的path，如果多个项目需要共享cookie，则应该保证项目在共同的目录下，且设置COOKIE_PATH为它们的共同目录地址
