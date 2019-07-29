db.createUser(
    {
        user: "${MONGO_USERNAME}",
        pwd: "${MONGO_PASSWORD}",
        roles: [ "readWrite" ]
    }
);

db.permissions.insert({"priority":100,"allow":true, "group_ids":["/oc","/reports"], "topic_id":"*"});

db.projects.insert({name:"project_override_1",permissions:{autoAccept:{export:true,import:false}}});
db.projects.insert({name:"project_override_2",permissions:{autoAccept:{export:false,import:false}}});

db.rules.remove({});
db.rules.insert({name:"Not a warning file type", source:"print('$${file.Filename}'['$${file.Filename}'.rfind('.')+1:] not in ['sav','dbf','dat','csv','bin','egp'])",mandatory:false});
db.rules.insert({name:"Not a blocked file type", source:"print('$${file.Filename}'['$${file.Filename}'.rfind('.')+1:] not in ['zip','tgz','gzip','tar','com','exe','dll','scr','sas7bdat','spv','rda','dta'])",mandatory:true});
db.rules.insert({name:"File size is under 3.5Mb", source:"print($${file.size}<3670016)",mandatory:false });
db.rules.insert({name:"File size is under 5Mb", source:"print($${file.size}<5242880)",mandatory:true });
/* Checks file content for anything matching exactly 1 alphanumeric followed by 9 digits */
db.rules.insert({name:"No study ids are present in the content", source:"print(not bool(re.compile(b'[\\w]{1}[\\d]{9}').search($${file.content})))", mandatory: true});
