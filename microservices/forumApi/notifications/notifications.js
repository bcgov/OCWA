var notifications = {};

var fs = require('fs');

var path = require('path');
var template = fs.readFileSync(path.resolve(__dirname, 'emailTemplate.html'), 'utf8');

var setTemplate = function(topic, comment, user, triggeringUser){

    var config = require('config');
    var email = template;

    email = email.replace("{{name}}", user['name']);
    email = email.replace("{{updater}}", triggeringUser['name']);
    email = email.replace("{{topic}}", topic.name);
    email = email.replace("{{comment}}", comment.author_user);

    return email
};


//user is the user making the change
notifications.notify = function(topic, comment, user){

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

    var notifyWho = topic.subscribers == null ? []:topic.subscribers;

    logger.verbose("Notification triggered", user);

    for (var i=0; i<notifyWho.length; i++){

        var who = notifyWho[i];

        if (who !== user.id){
            //we don't notify the active user at all as they made the change

            db.User.findOne({id: who}, function(err, userInfo) {

                if (err){
                    logger.error("Notifications - Error getting user info", err);
                    return;
                }else if (!userInfo){
                    logger.error("Notifications - No user info");
                    return;
                }

                var emailContent = setTemplate(topic, comment, userInfo, user);

                var emailPort = (typeof(emailConfig.port) === "undefined") ? 25 : emailConfig.port;
                var emailSecure = (typeof(emailConfig.secure) === "undefined") ? false : emailConfig.secure;

                var transportOpts = {
                    host: emailConfig.service,
                    port: emailPort,
                    secure: emailSecure
                };

                if (!emailSecure){
                    transportOpts['tls'] = {
                        rejectUnauthorized: false
                    }
                }

                if ( (emailConfig.user !== "") && (emailConfig.pass !== "") ){
                    transportOpts['auth'] = {
                        user: emailConfig.user,
                        pass: emailConfig.pass
                    }
                }

                var transporter = nodemailer.createTransport(transportOpts);

                var mailOptions = {
                    from: emailConfig.from,
                    to: userInfo['email'],
                    subject: emailConfig.subject,
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