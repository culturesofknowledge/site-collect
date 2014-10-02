export PORT=3000
cd ~/node.198/emlocollect
forever -w server.js 2>&1 | tee ../log/p${PORT}.log
