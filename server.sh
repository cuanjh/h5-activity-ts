#!/bin/sh
if test $# -eq 2
then
  case $1 in
    'dev'|'prod')
      if [[ ! -d "./src/$2" ]]; then
        echo "你输入的第二个参数文件目录名字不存在，例如：'luckyDraw'"
      else
        echo $2
        echo "start setup web server $1..."
        echo "gulp --env $1 --name $2 --command dev"
        gulp --env $1 --name $2 --command dev
      fi
      ;;
    *) echo '你输入的第一个参数构建环境不正确，测试环境为"dev"，线上环境为"prod"'
    ;;
  esac
else
  echo '需要传入两个参数，第一个参数为环境（dev | prod）,第二个参数为目录名字'
  echo '例如：sh ./server.sh dev luckyDraw'
fi