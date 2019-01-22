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

    if (!config.has('email')){
        logger.debug("Notifications - Triggered but not configured");
        return;
    }

    var emailConfig = config.get('email');
    if (!emailConfig.enabled){
        return;
    }


    var nodemailer = require("nodemailer");
    var db = require('../db/db');

    var notifyWho = request.reviewers.slice(0);
    notifyWho.push(request.author);

    logger.verbose("Notification triggered", user);

    for (var i=0; i<notifyWho.length; i++){

        var who = notifyWho[i];

        if (who !== user.id){
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

                var emailPort = (typeof(emailConfig.port) === "undefined") ? 25 : emailConfig.port;
                var emailSecure = (typeof(emailConfig.secure) === "undefined") ? false : emailConfig.secure;

                var transporter = nodemailer.createTransport({
                    host: emailConfig.service,
                    port: emailPort,
                    secure: emailSecure,
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