#!/bin/bash

cd /data/emlo-editor
. backup-helper.sh

DEST=/data/backups
FILENAME=mongo-dump_emlo-edit.tar.gz

docker-compose exec mongo sh -c 'mongodump -d emlo-edit -o /data/db/dump'
tar -czf ${DEST}/${FILENAME} -C volumes/mongo/ dump

backup_rotate_store ${DEST} ${FILENAME}
