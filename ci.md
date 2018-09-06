# ci 步骤

* git pull
* vi .env

  API_SERVER=http://portal.deepexi.top
  CONTEXT=moby-platform-dashboard
  PROJECT_NO=321af7ccb5314f52b6f6cb9090af664c

* 安装 node.js(已安装跳过)
* 安装 yarn(已安装跳过)

  curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo

  yum install yarn

* 构建

  ./start.sh

其内容如下：

    yarn --registry=https://registry.npm.taobao.org/

    yarn build

    # moby-platform-dashboard 根据应用名不同而不同
    mv dist /usr/share/nginx/html/moby-platform-dashboard

* 安装 nginx

  yum install nginx

* 启动 nginx

  nginx

* 配置网关

配置 kong 的 upstream 及 target

* 配置 jenkins 即可
