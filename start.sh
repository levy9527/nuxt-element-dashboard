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
-p 4333:3333 \
--name $c_name \
-v $PWD:/workdir \
-w /workdir \
-e PROJECT_NO=82d9e6d75e4344fea177b42cd2bd7a44 \
-e API_SERVER=http://119.29.28.59 \
-e SECURITY_API_SERVER=http://119.29.28.59 \
-e IS_PROXY=0 \
-e CONTEXT=/ \
-e HOST=0.0.0.0 \
-e PORT=3333 \
-e mode=prod \
node:8.9.1 \
sh -c "$_cmd"
