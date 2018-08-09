#!/bin/bash

# An example backup script using backup-helper. To be run daily.
destination=/data/backups
filename=my-backup.tar.gz

cd /data/emlo-collect

# First include the backup script
backup_helper=backup-script/backup-helper.sh

if [ ! -f ${backup_helper} ]; then
    echo "The backup-helper.sh file is required. Not found at ${backup_helper}. Download it at https://bitbucket.org/akademy/backup-script"
	exit 1
fi

. ${backup_helper}

now=$(date)

echo "Backing up at ${now} to ${destination}/${filename} ..."

docker-compose exec -T mongo sh -c 'mongodump -d emlo-edit -o /data/db/dump'
tar -czf ${destination}/${filename} -C volumes/mongo/ dump

backup_rotate_store ${destination} ${filename}

now=$(date)
echo "... ${now} backup complete."