const email = require('./email')
const gitops = require('./gitops')

var notifications = {};

notifications.notify = function(request, user){
    email.notify(request, user);
    gitops.process(request, user);
};

module.exports = notifications;