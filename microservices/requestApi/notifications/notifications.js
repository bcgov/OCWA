var notifications = {};

var fs = require('fs');

var path = require('path');
var template = fs.readFileSync(path.resolve(__dirname, 'emailTemplate.html'), 'utf8');

var setTemplate = function(request, user, triggeringUser){

    var config = require('config');
    var email = template;

    console.log("SET TEMPLATE", user);

    email = email.replace("{{name}}", user['name']);
    email = email.replace("{{updater}}", triggeringUser['name']);
    email = email.replace("{{url}}", config.get("ocwaUrl")+"requests/"+request._id);
    email = email.replace("{{requestId}}", request._id);

    return email
};


//user is the user making the change
notifications.notify = function(request, user){

    var config = require('config');
    var logger = require('npmlog');
    var db = require('../db/db');

    var notifyWho = request.reviewers.slice(0);
    notifyWho.push(request.author);

    logger.verbose("Notification triggered", user);

    for (var i=0; i<notifyWho.length; i++){

        var who = notifyWho[i];

        if ((true) || (who !== user.id)){
            //id could be name or email so either way we need userinfo for all who are not the active user
            //and we don't notify the active user at all as they made the change

            db.User.findOne({id: user.id}, function(err, userInfo) {

                if (err){
                    logger.error("Notifications - Error getting user info", err);
                    return;
                }else if (!userInfo){
                    logger.error("Notifications - No user info");
                    return;
                }

                var emailContent = setTemplate(request, userInfo, user);

                var nodemailer = require("nodemailer");

                var emailConfig = config.get('email');

                var transporter = nodemailer.createTransport({
                    service: emailConfig.service,
                    auth: {
                        user: emailConfig.user,
                        pass: emailConfig.pass
                    }
                });

                var mailOptions = {
                    from: emailConfig.from,
                    to: who,
                    subject: "OCWA - Request Update",
                    html: emailContent
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        logger.error("Error sending email to " + mailOptions.to, error);
                        return;
                    }
                    logger.debug("Email sent: " + info.response);
                });
            });
        }
    }
};

module.exports = notifications;