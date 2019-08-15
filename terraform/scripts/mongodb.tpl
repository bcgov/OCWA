db.createUser(
    {
        user: "${MONGO_USERNAME}",
        pwd: "${MONGO_PASSWORD}",
        roles: [ "readWrite" ]
    }
);

db.permissions.insert({"priority":100,"allow":true, "group_ids":["/oc","/reports"], "topic_id":"*"});

db.projects.insert({name:"project_override_1",permissions:{autoAccept:{export:true,import:true}}});
db.projects.insert({name:"project_override_2",permissions:{autoAccept:{export:false,import:false}}});

