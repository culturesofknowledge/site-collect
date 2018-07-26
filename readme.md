EMLO-COLLECT
============

Install Docker
--------------

Install.

    <PACKAGE_MANAGER> install docker docker-compose
    
Recommended: If you want to move the docker storage location (i.e. to use different disk space):

    mv /var/lib/docker /data/
    ln -s /data/docker /var/lib/docker

Now start docker:

    systemctl enable docker
    systemctl start docker

Setup server
-----------

 - Copy node/config/config.base.js to node/config/config.local.js and update the values.
 - generate/obtain ssl key and cert file for nginx build (e.g. sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout nginx/ssl/ssl.key -out nginx/ssl/ssl.crt )

Start server
-----------

 - Run ./start.sh

Run backup
----------

Add cron job. Run daily.

    /data/emlo-collect/backup.sh

Index mongo
-----------

Get data and copy to container:

    docker cp mongo-dump.tar.gz <container_name>:\

Decompress if needs be:

    tar -xzf mongo-dump.tar.gz

Current backups produce a folder path, so find the files we need:

    cd /var/backups/mongo/dump/emlo-edit

then restore:

    mongorestore --drop --db emlo-edit .
    
