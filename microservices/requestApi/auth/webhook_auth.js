var auth = function(){
    const passport = require('passport');
    
    const passApiKey = require('passport-headerapikey');
    const HeaderAPIKeyStrategy = passApiKey.HeaderAPIKeyStrategy;
    const config = require('config');
    

    passport.use(new HeaderAPIKeyStrategy(
        { header: 'Authorization', prefix: 'Api-Key ' },
        false,
        function(apiKey, cb) {
            if (config.get("webhookSecret") == apiKey) {
                const user = {
                }
                return cb(null, user);
            } else {
                return cb(null, false);
            }
        }
    ));
    
    return passport;
}

module.exports = auth;
