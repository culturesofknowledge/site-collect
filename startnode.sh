export PORT=3000
cd /home/cofkadmin/backend/emlo.dev/node.js/node.198/git/
(forever -w server.js) > >(tee log/p${PORT}.log) 2> >(tee log/p${PORT}.err >&2)
