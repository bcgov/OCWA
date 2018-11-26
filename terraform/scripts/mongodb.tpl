db.createUser(
    {
        user: "${MONGO_USERNAME}",
        pwd: "${MONGO_PASSWORD}",
        roles: [ "readWrite" ]
    }
);

db.topics.insert({"name":"topic1", "contributors" : [ ], "author_groups" : [ "/exporter" ]});
db.permissions.insert({"priority":100,"allow":true, "group_ids":["*"], "topic_id":"*"});
