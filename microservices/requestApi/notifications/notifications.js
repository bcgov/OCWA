var notifications = function(db){
    const email = require('./email')(db);
    const gitops = require('./gitops')(db);

    var notifications = {};

    notifications.notify = function(request, user, submittedUnclaimed){
        email.notify(request, user, submittedUnclaimed);
        gitops.process(request, user);
    };

    notifications.process = function(request, user){
        gitops.process(request, user);
    };

    notifications.gitops = function(){
        return gitops;
    };
    return notifications;
}

module.exports = notifications;