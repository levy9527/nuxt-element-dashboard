# !/bin/sh
n=`ps aux | grep node | awk '{print $2}' | sed -n '2p'`
kill -9 $n
git pull
npm run build
nohup npm run start &
