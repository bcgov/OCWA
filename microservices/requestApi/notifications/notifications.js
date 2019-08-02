const email = require('./email')
const gitops = require('./gitops')

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

module.exports = notifications;