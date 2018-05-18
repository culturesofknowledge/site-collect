EMLO-COLLECT
============

Install Docker
--------------
For redhat:

    yum install docker docker-compose

then:

    systemctl enable docker
    systemctl start docker
    
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
    
