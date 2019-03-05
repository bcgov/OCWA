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
db.rules.insert({name:"warning_file_types", source:"print('$${file.Filename}'['$${file.Filename}'.rfind('.')+1:] not in ['sav','dbf','dat','csv','bin','egp'])",mandatory:false});
db.rules.insert({name:"restricted_file_types", source:"print('$${file.Filename}'['$${file.Filename}'.rfind('.')+1:] not in ['zip','tgz','gzip','tar','com','exe','dll','scr','sas7bdat','spv','rda','dta'])",mandatory:true});
db.rules.insert({name:"file_size_under_3.5mb", source:"print($${file.size}<3670016)",mandatory:false });
db.rules.insert({name:"file_size_under_5mb", source:"print($${file.size}<5242880)",mandatory:true });
/* Checks file content for anything matching exactly 1 alphanumeric followed by 9 digits */
db.rules.insert({name:"studyid_not_in_content", source:"print(not bool(re.search(r'[\\w]{1}[\\d]{9}', $${file.content}.decode('utf-8'))))", mandatory: true});
