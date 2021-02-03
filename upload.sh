#!/bin/sh
if test $# -eq 2
then
  case $1 in
    'dev'|'prod')
      if [[ ! -d "./src/$2" ]]; then
        echo "你输入的第二个参数文件目录名字不存在，例如：'luckyDraw'"
      else
        echo $2
        echo "start build $1..."
        echo "gulp --env $1 --name $2 --command build"
        gulp --env $1 --name $2 --command build
        echo "build completed!"
        echo "start deploy $1 environment..."
        if [ $1 == "dev" ]
        then
          rsync -arvz /Users/talkmate/Documents/gitlab/h5-activity-ts/dist/* root@test.200h.com:/200h/testing/chuiJunHui/activity/$2
        else
          echo "./qshell qupload ./deploy/$2.json"
          ./qshell qupload ./deploy/$2.json
          ./qshell cdnrefresh ./cdn-refresh.txt
        fi
        echo "deploy successfully!"
      fi
      ;;
    *) echo '你输入的第一个参数构建环境不正确，测试环境为"dev"，线上环境为"prod"'
    ;;
  esac
else
  echo '需要传入两个参数，第一个参数为构建的环境（dev | prod）,第二个参数为构建的目录名字'
  echo '例如：sh ./upload.sh dev luckyDraw'
fi