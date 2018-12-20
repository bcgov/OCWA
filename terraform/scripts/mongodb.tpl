db.createUser(
    {
        user: "${MONGO_USERNAME}",
        pwd: "${MONGO_PASSWORD}",
        roles: [ "readWrite" ]
    }
);

db.topics.insert({"name":"topic1", "contributors" : [ ], "author_groups" : [ "/exporter" ]});
db.permissions.insert({"priority":100,"allow":true, "group_ids":["*"], "topic_id":"*"});

db.rules.remove({});
db.rules.insert({name:"warning_file_type", source:"$${file.extension} in ['sav','dbf','dat','csv','bin','egp']",mandatory:false});
db.rules.insert({name:"restricted_file_type", source:"$${file.extension} in ['zip','tgz','gzip','tar','com','exe','dll','scr','sas7bdat','spv','rda','dta']",mandatory:true});

db.rules.insert({name:"file_size_exceeds_3.5mb", source:"$${file.size}<3500000",mandatory:false });
db.rules.insert({name:"file_size_exceeds_5mb", source:"$${file.size}<5000000",mandatory:true });

