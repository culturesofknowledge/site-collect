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

Index mongo (IF needed, don't overwrite new data!)
-----------

Get data 

    mongodump -d emlo-edit -o /tmp/mongo-dump
    
	tar -czf mongo-dump.tar.gz mongo-dump
	
and copy to container:

    docker cp mongo-dump.tar.gz <container_name>:\tmp

	docker-compose exec mongo bash

Decompress if needs be:

    tar -xzf mongo-dump.tar.gz

Current backups produce a folder path, so find the files we need:

    cd mongodump/emlo-edit

then restore:

    mongorestore --drop --db emlo-edit .
    
Add Language
------------

Until a dedicated language adminstration is added, this is entirely a manual process.

You'll need to log into the Mongo container and manually add a language to the table. You'll need the name and the code, you can find a list of codes in the language-all collection in mongo.

    docker-compose exec mongo mongo
    use emlo-edit
    db["language-fav"].insert({language_code:"por","language_name":"Portuguese"})

