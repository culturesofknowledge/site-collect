export PORT=3000
cd /home/cofkadmin/backend/emlo.dev/node.js/node.198/git/
MESSAGE="\n\n--------------------------------------------\n  SERVER RESTART $(date)  \n--------------------------------------------------\n" 
printf "$MESSAGE" >> log/p${PORT}.err
forever -a -l "/dev/null" -o "/dev/null" -e "log/p${PORT}.err" start server.js
