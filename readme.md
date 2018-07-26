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


Start server
-----------

 - Run ./start.sh

Index mongo (IF needed, don't overwrite new data!)
-----------

Get data 

    mongodump -d emlo-edit -o /tmp/mongo-dump
    
	tar -czf mongo-dump.tar.gz mongo-dump
	
and copy to container:

    docker cp mongo-dump.tar.gz <container_name>:\tmp

	docker-compose exec <container_name> bash

Decompress if needs be:

    tar -xzf mongo-dump.tar.gz

Current backups produce a folder path, so find the files we need:

    cd mongodump/emlo-edit

then restore:

    mongorestore --drop --db emlo-edit .
    
