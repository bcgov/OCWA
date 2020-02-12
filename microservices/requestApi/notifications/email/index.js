var notifications = function(db){

    var notifications = {};
    var fs = require('fs');

    var path = require('path');
    var template = fs.readFileSync(path.resolve(__dirname, 'emailTemplate.html'), 'utf8');
    var submitTemplate = fs.readFileSync(path.resolve(__dirname, 'emailSubmitTemplate.html'), 'utf8');

    var setTemplate = function(request, user, triggeringUser, templateName){

        if (typeof(templateName) === "undefined"){
            templateName = "emailTemplate.html";
        }

        var config = require('config');
        var email = "";
        if (templateName === "emailSubmitTemplate.html"){
            email = submitTemplate;
        }else if (templateName === "emailTemplate.html"){
            email = template;
        }else{
            try{
                email = fs.readFileSync(path.resolve(__dirname, templateName), 'utf8');
            }catch(ex){
                email = "";
            }
        }

        var baseUrl = config.get("ocwaUrl");
        if (request.type === db.Request.INPUT_TYPE){
            baseUrl = config.get("ocwaImportUrl");
        }

        var requestUrl = baseUrl;

        if (requestUrl.substring(requestUrl.length-1) !== "/"){
            requestUrl += "/";
        }
        requestUrl += "requests/" + request._id;

        email = email.replace("{{name}}", user['name']);
        email = email.replace("{{updater}}", triggeringUser['name']);
        email = email.replace("{{baseURL}}", baseUrl);
        email = email.replace("{{url}}", requestUrl);
        email = email.replace("{{requestId}}", request._id);

        return email;
    };


    //user is the user making the change
    notifications.notify = function(request, user, submittedUnclaimed){

        var config = require('config');
        var logger = require('npmlog');

        if (typeof(submittedUnclaimed) === "undefined"){
            submittedUnclaimed = false;
        }

        if (!config.has('email')){
            logger.debug("Notifications[email] - Triggered but not configured");
            return;
        }

        var emailConfig = config.get('email');
        if (!emailConfig.enabled){
            logger.debug("Notifications[email] - Triggered but not enabled");
            return;
        }

        if (request.state === db.Request.DRAFT_STATE){
            logger.debug("Notifications[email] - Triggered but state is draft");
            return;
        }

        var notifyWho = request.reviewers.slice(0);
        notifyWho.push(request.author);

        if ( (submittedUnclaimed) && (config.has('emailOnInitialSubmit')) ){
            var emailList = config.get('emailOnInitialSubmit');
            for (var i=0; i<emailList.length; i++){
                sendEmail(request, {name: emailList[i].name, email: emailList[i].email}, user, "emailSubmitTemplate.html");
            }
        }

        logger.verbose("Notification[email] triggered", user);

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

                    sendEmail(request, userInfo, user);
                });
            }
        }
    };

    function sendEmail(request, userInfo, user, templateName){
        var config = require('config');
        var logger = require('npmlog');
        var emailConfig = config.get('email');
        var emailContent = setTemplate(request, userInfo, user, templateName);

        var emailPort = (typeof(emailConfig.port) === "undefined") ? 25 : emailConfig.port;
        var emailSecure = (typeof(emailConfig.secure) === "undefined") ? false : emailConfig.secure;

        var transportOpts = {
            host: emailConfig.service,
            port: emailPort,
            secure: emailSecure
        };

        if (!emailSecure){
            transportOpts.tls = {
                rejectUnauthorized: false
            }
        }

        if ( (emailConfig.user !== "") && (emailConfig.pass !== "") ){
            transportOpts.auth = {
                user: emailConfig.user,
                pass: emailConfig.pass
            }
        }

        var nodemailer = require("nodemailer");
        var transporter = nodemailer.createTransport(transportOpts);

        var mailOptions = {
            from: emailConfig.from,
            to: userInfo.email,
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
    }

    return notifications;
}

module.exports = notifications;