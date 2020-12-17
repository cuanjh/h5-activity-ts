#!/bin/sh
folder="luckyDraw"
echo $folder
echo "start build..."
gulp --name $folder --command build
echo "build completed!"

echo "start deploy test environment..."
rsync -arvz /Users/talkmate/Documents/gitlab/h5-activity-ts/dist/* root@test.200h.com:/200h/testing/chuiJunHui/activity/$folder
echo "deploy successfully!"