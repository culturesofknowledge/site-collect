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

    docker cp mongo-dump <container_name>:\

Decompress if needs be, then restore:

    mongorestore --db emlo-edit /mongo-dump
    
