#!/usr/bin/env bash

#################################################################
# 功能: 以docker方式启动项目
#
# 使用说明: 方括号表示可选项
#   [DEBUG=xxx] [NODE_ENV=xxx] ./docker-startup.sh [1]
#
# 参数说明
#   DEBUG环境变量影响debug日志, DEBUG= 表示不输出任何debug日志
#   参数说明: NODE_ENV环境变量影响配置, DEBUG=test 表示使用 test配置
#   [1] 表示 使用 npm i
#
# 示例:
#   DEBUG=merchant*,utils NODE_ENV=test ./docker-startup.sh 1
#   NODE_ENV=prod ./docker-startup.sh 1
#################################################################

c_name=dashboard
host_port=3333     # 根据情况修改 主机映射端口 host_port
is_proxy=0         # is_proxy=0 表示使用网关, is_proxy=1 时使用node的代理
context=0          # context 默认值为0，表示没有上下文。需要上下文时只需要传上下文的名字，如 dashboard
api_server=http://deepexi.top  # 网关地址
project_no=0

docker rm -f $c_name &> /dev/null
git pull

# $1=1 表示需要 npm i
#_cmd="npm run dev"
#_cmd="npm run generate"
_cmd="npm run build:docker && npm run start:docker"

# $1=1 表示需要 npm i
if [ "$1" = "1" ]; then
    _cmd="npm i && ${_cmd}"
fi
echo "$_cmd"

docker run \
-d \
-p $host_port:3000 \
--name $c_name \
-v $PWD:/workdir \
-w /workdir \
-e PROJECT_NO=$project_no \
-e API_SERVER=$api_server \
-e SECURITY_API_SERVER=$api_server \
-e IS_PROXY=$is_proxy \
-e CONTEXT=$context \
-e HOST=0.0.0.0 \
-e MODE=prod \
node:8.9.1 \
sh -c "$_cmd"
