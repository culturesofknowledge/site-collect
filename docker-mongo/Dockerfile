FROM mongo:2.4

# Place bson and json files in mongo-dump to copy to
COPY mongo-dump /data/db/mongo-dump/

EXPOSE 27017
CMD ["mongod"]

# RUN mongorestore --db emlo-edit /data/db/mongo-dump

# To build:
# > docker build -t mongo-with-emlo .
# and container created:
# > docker create