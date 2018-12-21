var notifications = {};

var fs = require('fs');

var template = fs.readFileSync('./emailTemplate.html');

var setTemplate = function(request, user, triggeringUser){

    var config = require('config');
    var email = template;

    email = email.replace("{{name}}", user.['name']);
    email = email.replace("{{updater}}", triggeringUser['name']);
    email = email.replace("{{url}}", config.get("ocwaUrl")+"/requests/"+request._id);
    email = email.replace("{{requestId}}", request._id);

    return email
};


//user is the user making the change
notifications.notify = function(request, user){

    var config = require('config');
    var logger = require('npmlog');

    var notifiyWho = request.reviewers.slice(0);
    notifyWho.append(request.author);

    for (var i=0; i<notifyWho.length; i++){

        var who = notifyWho[i];

        if (who !== user.id){
            //id could be name or email so either way we need userinfo for all who are not the active user
            //and we don't notify the active user at all as they made the change

            var httpReq = require('request');

            httpReq.post({
                url: config.get('authUrl')+'/userinfo',
                headers: {
                    'Authorization': "Bearer "+req.user.jwt
                }
            }, function(apiErr, apiRes, body) {
                if ((!apiErr) && (apiRes.statusCode === 200)) {
                    var info = body;

                    var emailContent = setTemplate(request, info, user);

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
                        to: info['email'],
                        subject: "OCWA - Request Update",
                        html: emailContent
                    };

                    transporter.sendMail(mailOptions, function(error, info){
                        if (error){
                            logger.error("Error sending email to " + mailOptions.to, error);
                            return;
                        }
                        logger.debug("Email sent: " + info.response);
                    });
                    return;
                }
                logger.error("Error getting userinfo for " + who + " for emailing");
            });
        }

    }

};

module.exports = notifications;